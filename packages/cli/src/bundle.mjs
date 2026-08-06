import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  checkActorReferences,
  checkAuthorization,
  checkContextLedger,
  checkContinuityBundle,
  checkHandoffReferences,
  checkSourceReview,
  checkSpaceReferences,
  checkTaskAuthorization,
  checkTaskCompletion,
  validateSchema
} from '../../kernel/src/index.mjs';

const SCHEMA_FILES = {
  space: 'space.schema.json',
  actor: 'actor.schema.json',
  authorization: 'authorization.schema.json',
  'context-ledger': 'context-ledger.schema.json',
  'intent-contract': 'intent-contract.schema.json',
  task: 'task.schema.json',
  evidence: 'evidence.schema.json',
  handoff: 'handoff.schema.json',
  'continuity-bundle': 'continuity-bundle.schema.json',
  'source-conflict-report': 'source-conflict-report.schema.json',
  'source-review': 'source-review.schema.json'
};

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function safeResolve(root, file) {
  const resolved = path.resolve(root, file);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (resolved !== path.resolve(root) && !resolved.startsWith(prefix)) {
    throw new Error(`artifact path escapes repository root: ${file}`);
  }
  return resolved;
}

async function loadSchemas(root) {
  const schemas = new Map();
  for (const [kind, file] of Object.entries(SCHEMA_FILES)) {
    schemas.set(kind, await readJson(path.join(root, 'schemas', file)));
  }
  return schemas;
}

export async function validateBundle(bundleFile, { root = process.cwd() } = {}) {
  const repositoryRoot = path.resolve(root);
  const bundlePath = safeResolve(repositoryRoot, bundleFile);
  const bundle = await readJson(bundlePath);
  const schemas = await loadSchemas(repositoryRoot);
  const errors = validateSchema(schemas.get('continuity-bundle'), bundle).map((error) => `${bundleFile}: ${error}`);
  const documents = [];

  for (const artifact of bundle.artifacts ?? []) {
    const artifactPath = safeResolve(repositoryRoot, artifact.path);
    try {
      await access(artifactPath);
    } catch {
      errors.push(`${bundle.bundle_id}: artifact path not found ${artifact.path}`);
      continue;
    }
    if (artifact.artifact_kind === 'state') continue;

    let document;
    try {
      document = await readJson(artifactPath);
    } catch (error) {
      errors.push(`${artifact.path}: invalid JSON: ${error.message}`);
      continue;
    }
    const schema = schemas.get(document.kind);
    if (!schema) {
      errors.push(`${artifact.path}: unknown kind ${String(document.kind)}`);
      continue;
    }
    errors.push(...validateSchema(schema, document).map((error) => `${artifact.path}: ${error}`));
    Object.defineProperty(document, '__file', { value: artifact.path, enumerable: false });
    documents.push(document);
  }

  const evidenceById = new Map(documents.filter((d) => d.kind === 'evidence').map((d) => [d.evidence_id, d]));
  const authorizationById = new Map(documents.filter((d) => d.kind === 'authorization').map((d) => [d.authorization_id, d]));
  for (const task of documents.filter((d) => d.kind === 'task')) {
    errors.push(...checkTaskAuthorization(task, authorizationById));
    errors.push(...checkTaskCompletion(task, evidenceById));
  }
  for (const authorization of documents.filter((d) => d.kind === 'authorization')) errors.push(...checkAuthorization(authorization));
  for (const ledger of documents.filter((d) => d.kind === 'context-ledger')) errors.push(...checkContextLedger(ledger));
  for (const review of documents.filter((d) => d.kind === 'source-review')) errors.push(...checkSourceReview(review, documents));
  for (const handoff of documents.filter((d) => d.kind === 'handoff')) errors.push(...checkHandoffReferences(handoff, documents));
  errors.push(...checkContinuityBundle(bundle, documents));
  errors.push(...checkSpaceReferences(documents));
  errors.push(...checkActorReferences(documents));

  return { bundle, documents, errors };
}

export function inspectBundle(bundle, documents) {
  const space = documents.find((d) => d.kind === 'space');
  const intent = documents.find((d) => d.kind === 'intent-contract');
  const handoff = documents.find((d) => d.kind === 'handoff');
  const authorization = documents.find((d) =>
    d.kind === 'authorization' &&
    d.authorization_id === handoff?.authorization_refs?.find((id) => id)
  ) ?? documents.find((d) => d.kind === 'authorization' && d.granted_to_actor_id === bundle.next_actor_id && d.status === 'active');
  const tasks = documents.filter((d) => d.kind === 'task');
  const evidence = documents.filter((d) => d.kind === 'evidence');
  const conflicts = documents.filter((d) => d.kind === 'source-conflict-report');
  const sourceReviews = documents.filter((d) => d.kind === 'source-review');

  return {
    bundle_id: bundle.bundle_id,
    source_revision: bundle.source_revision,
    space: space ? { id: space.space_id, name: space.name, purpose: space.purpose, boundaries: space.boundaries } : null,
    intent: intent ? { id: intent.intent_id, understanding: intent.current_understanding, next_action: intent.next_action } : null,
    next_actor_id: bundle.next_actor_id,
    authorization: authorization ? { id: authorization.authorization_id, status: authorization.status, allowed_actions: authorization.allowed_actions, resource_scope: authorization.resource_scope } : null,
    tasks: tasks.map((task) => ({ id: task.task_id, title: task.title, status: task.status, evidence_refs: task.evidence_refs })),
    evidence: evidence.map((item) => ({ id: item.evidence_id, status: item.verification_status, uri: item.uri })),
    source_conflicts: conflicts.flatMap((report) => report.candidates.map((candidate) => ({
      report_id: report.conflict_report_id,
      conflict_id: candidate.conflict_id,
      topic: candidate.topic,
      value_refs: candidate.values.map((value) => value.value_id)
    }))),
    source_reviews: sourceReviews.map((review) => ({
      id: review.review_id,
      conflict_id: review.conflict_id,
      reviewer_actor_id: review.reviewer_actor_id,
      status: review.review_status,
      decision: review.decision
    })),
    blockers: handoff?.blockers ?? [],
    next_actions: handoff?.next_actions ?? []
  };
}

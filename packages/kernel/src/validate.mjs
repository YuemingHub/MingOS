import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { checkActorReferences, checkAuthorization, checkContextLedger, checkContinuityBundle, checkHandoffReferences, checkSourceReview, checkSpaceReferences, checkTaskAuthorization, checkTaskCompletion } from './invariants.mjs';
import { validateSchema } from './schema-validator.mjs';

const root = path.resolve(process.cwd());
const target = path.resolve(root, process.argv[2] ?? 'examples');
const schemaDir = path.join(root, 'schemas');

const schemaFiles = {
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

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

const schemas = new Map();
for (const [kind, file] of Object.entries(schemaFiles)) {
  const schema = JSON.parse(await readFile(path.join(schemaDir, file), 'utf8'));
  schemas.set(kind, schema);
}

const documents = [];
const failures = [];
for (const file of await walk(target)) {
  const relative = path.relative(root, file);
  let document;
  try {
    document = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    failures.push(`${relative}: invalid JSON: ${error.message}`);
    continue;
  }

  const schema = schemas.get(document.kind);
  if (!schema) {
    failures.push(`${relative}: unknown kind ${String(document.kind)}`);
    continue;
  }
  for (const error of validateSchema(schema, document)) failures.push(`${relative}: ${error}`);
  Object.defineProperty(document, '__file', { value: relative, enumerable: false });
  documents.push(document);
}

const evidenceById = new Map(documents.filter((d) => d.kind === 'evidence').map((d) => [d.evidence_id, d]));
const authorizationById = new Map(documents.filter((d) => d.kind === 'authorization').map((d) => [d.authorization_id, d]));
for (const task of documents.filter((d) => d.kind === 'task')) {
  failures.push(...checkTaskAuthorization(task, authorizationById));
  failures.push(...checkTaskCompletion(task, evidenceById));
}
for (const authorization of documents.filter((d) => d.kind === 'authorization')) failures.push(...checkAuthorization(authorization));
for (const ledger of documents.filter((d) => d.kind === 'context-ledger')) failures.push(...checkContextLedger(ledger));
for (const review of documents.filter((d) => d.kind === 'source-review')) failures.push(...checkSourceReview(review, documents));
for (const handoff of documents.filter((d) => d.kind === 'handoff')) failures.push(...checkHandoffReferences(handoff, documents));
for (const bundle of documents.filter((d) => d.kind === 'continuity-bundle')) failures.push(...checkContinuityBundle(bundle, documents));
failures.push(...checkSpaceReferences(documents));
failures.push(...checkActorReferences(documents));

if (failures.length > 0) {
  console.error('MingOS validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`MingOS validation passed: ${documents.length} documents`);

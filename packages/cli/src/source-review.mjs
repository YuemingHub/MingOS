import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeSnapshot } from './snapshot.mjs';

function resolveInside(root, value) {
  const base = path.resolve(root);
  const resolved = path.resolve(base, value);
  if (resolved !== base && !resolved.startsWith(`${base}${path.sep}`)) {
    throw new Error(`path escapes allowed root: ${value}`);
  }
  return resolved;
}

function slug(value) {
  return String(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

function normalizeConflictRecord(record) {
  return {
    record_kind: record.record_kind,
    record_id: record.record_id,
    source_ref: record.source_ref,
    authority: record.authority,
    temporal_status: record.temporal_status,
    valid_as_of: record.valid_as_of ?? null,
    valid_until: record.valid_until ?? null
  };
}

function stableValues(values, topic) {
  return [...values]
    .sort((left, right) => JSON.stringify(left.asserted_value).localeCompare(JSON.stringify(right.asserted_value)))
    .map((value, index) => ({
      value_id: `VALUE-${slug(topic)}-${index + 1}`,
      asserted_value: value.asserted_value,
      records: value.records.map(normalizeConflictRecord)
    }));
}

export function buildSourceConflictReport(snapshotReport) {
  const candidates = [...snapshotReport.conflict_report.candidates]
    .sort((left, right) => left.topic.localeCompare(right.topic))
    .map((candidate) => ({
      conflict_id: `CONFLICT-${slug(candidate.topic)}`,
      topic: candidate.topic,
      values: stableValues(candidate.values, candidate.topic)
    }));

  return {
    schema_version: '0.1.0',
    kind: 'source-conflict-report',
    conflict_report_id: `CONFLICT-REPORT-${slug(snapshotReport.snapshot_id)}`,
    snapshot_id: snapshotReport.snapshot_id,
    subject_space_id: snapshotReport.space.space_id,
    automatic_resolution: false,
    candidates,
    created_at: `${snapshotReport.snapshot_at}T00:00:00Z`
  };
}

export function buildPendingSourceReviews(conflictReport, {
  spaceId,
  createdByActorId,
  reviewerActorId,
  createdAt
}) {
  if (!spaceId || !createdByActorId || !reviewerActorId || !createdAt) {
    throw new Error('source review scaffold requires spaceId, createdByActorId, reviewerActorId and createdAt');
  }
  return conflictReport.candidates.map((candidate, index) => ({
    schema_version: '0.1.0',
    kind: 'source-review',
    review_id: `SOURCE-REVIEW-${slug(conflictReport.snapshot_id)}-${index + 1}`,
    space_id: spaceId,
    conflict_report_id: conflictReport.conflict_report_id,
    conflict_id: candidate.conflict_id,
    candidate_value_refs: candidate.values.map((value) => value.value_id),
    created_by_actor_id: createdByActorId,
    reviewer_actor_id: reviewerActorId,
    review_status: 'pending',
    decision: null,
    selected_value_ref: null,
    rationale: null,
    supporting_refs: [],
    requested_evidence: [],
    revocable: true,
    decided_at: null,
    revoked_at: null,
    revocation_reason: null,
    supersedes_review_id: null,
    created_at: createdAt,
    updated_at: createdAt
  }));
}

function renderReviewInstructions(conflictReport, reviews) {
  const items = reviews.map((review) => {
    const conflict = conflictReport.candidates.find((candidate) => candidate.conflict_id === review.conflict_id);
    return `- \`${review.review_id}\`: ${conflict?.topic ?? review.conflict_id}`;
  }).join('\n');

  return `# Human source review required

The system created pending review requests only. It did not choose a value or submit a decision.

## Pending reviews

${items}

## Allowed human decisions

- \`accept-value\`: choose one candidate value and cite supporting sources.
- \`preserve-history\`: explicitly classify one candidate value as historical.
- \`unresolved\`: record that the available evidence is insufficient.
- \`request-evidence\`: list the additional evidence needed before deciding.

Every submitted decision must name an active human Actor, include a rationale and remain revocable. Original source records are never overwritten.
`;
}

export async function scaffoldSourceReviews(configFile, outputDir, options = {}) {
  if (!outputDir) throw new Error('source-review scaffold requires --out <directory>');
  const root = path.resolve(options.root ?? process.cwd());
  const snapshotReport = await analyzeSnapshot(configFile, { root });
  const conflictReport = buildSourceConflictReport(snapshotReport);
  if (conflictReport.candidates.length === 0) {
    throw new Error('source-review scaffold requires at least one explicit conflict candidate');
  }

  const reviews = buildPendingSourceReviews(conflictReport, {
    spaceId: options.spaceId,
    createdByActorId: options.createdByActorId,
    reviewerActorId: options.reviewerActorId,
    createdAt: options.createdAt
  });
  const target = resolveInside(root, outputDir);
  const reviewsDir = path.join(target, 'reviews');
  await mkdir(reviewsDir, { recursive: true });

  const outputs = [
    { path: path.join(target, 'conflict-report.json'), content: conflictReport },
    { path: path.join(target, 'REVIEW_REQUIRED.md'), content: renderReviewInstructions(conflictReport, reviews) },
    ...reviews.map((review) => ({ path: path.join(reviewsDir, `${review.review_id}.json`), content: review }))
  ];

  for (const output of outputs) {
    try {
      await access(output.path);
      if (!options.force) throw new Error(`refusing to overwrite existing file: ${path.relative(root, output.path)}`);
    } catch (error) {
      if (error.code !== 'ENOENT' && !String(error.message).startsWith('refusing')) throw error;
      if (String(error.message).startsWith('refusing')) throw error;
    }
    const body = typeof output.content === 'string'
      ? output.content
      : `${JSON.stringify(output.content, null, 2)}\n`;
    await writeFile(output.path, body, 'utf8');
  }

  return {
    conflictReport,
    reviews,
    outputDir: path.relative(root, target).replaceAll(path.sep, '/'),
    files: outputs.map((output) => path.relative(target, output.path).replaceAll(path.sep, '/'))
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { checkSourceReview } from '../packages/kernel/src/index.mjs';
import { analyzeSnapshot } from '../packages/cli/src/snapshot.mjs';
import { buildPendingSourceReviews, buildSourceConflictReport, scaffoldSourceReviews } from '../packages/cli/src/source-review.mjs';

const execFileAsync = promisify(execFile);
const unifiedConfig = 'fixtures/mingos-unified-snapshot-input/snapshot.config.json';

function actors() {
  return [
    { kind: 'actor', actor_id: 'human-reviewer', actor_type: 'human', active: true },
    { kind: 'actor', actor_id: 'agent-creator', actor_type: 'ai_agent', active: true }
  ];
}

async function fixture() {
  const snapshot = await analyzeSnapshot(unifiedConfig);
  const conflictReport = buildSourceConflictReport(snapshot);
  const reviews = buildPendingSourceReviews(conflictReport, {
    spaceId: 'mingos-project',
    createdByActorId: 'agent-creator',
    reviewerActorId: 'human-reviewer',
    createdAt: '2026-08-06T14:50:00Z'
  });
  return { conflictReport, reviews, documents: [conflictReport, ...reviews, ...actors()] };
}

test('source review scaffold creates deterministic conflict and pending review IDs', async () => {
  const { conflictReport, reviews } = await fixture();
  assert.equal(conflictReport.conflict_report_id, 'CONFLICT-REPORT-mingos-unified-archive-2026-08-06');
  assert.equal(conflictReport.automatic_resolution, false);
  assert.deepEqual(conflictReport.candidates.map((candidate) => candidate.conflict_id), [
    'CONFLICT-family-space-product-repository',
    'CONFLICT-foundation-repository',
    'CONFLICT-mingos-canonical-entrypoint'
  ]);
  assert.equal(reviews.length, 3);
  assert.ok(reviews.every((review) => review.review_status === 'pending'));
  assert.ok(reviews.every((review) => review.decision === null));
  assert.ok(reviews.every((review) => review.created_by_actor_id === 'agent-creator'));
  assert.ok(reviews.every((review) => review.reviewer_actor_id === 'human-reviewer'));
});

test('committed conflict report is the deterministic output of the fixed snapshot', async () => {
  const { conflictReport } = await fixture();
  const committed = JSON.parse(await readFile('examples/source-review-pilot/conflict-report.json', 'utf8'));
  assert.deepEqual(committed, conflictReport);
});

test('pending source review passes without impersonating a human decision', async () => {
  const { reviews, documents } = await fixture();
  assert.deepEqual(checkSourceReview(reviews[0], documents), []);
});

test('submitted human accept-value review requires rationale and supporting sources', async () => {
  const { reviews, documents } = await fixture();
  const review = {
    ...reviews[0],
    review_status: 'submitted',
    decision: 'accept-value',
    selected_value_ref: reviews[0].candidate_value_refs[0],
    rationale: 'The current repository status file and merged repository identity support this value.',
    supporting_refs: ['github:YuemingHub/Family-Space@4e77e245/CURRENT_PROJECT_STATUS.md'],
    decided_at: '2026-08-06T15:00:00Z',
    updated_at: '2026-08-06T15:00:00Z'
  };
  assert.deepEqual(checkSourceReview(review, [...documents, review]), []);
});

test('AI actor cannot submit a source review decision', async () => {
  const { reviews, documents } = await fixture();
  const review = {
    ...reviews[0],
    reviewer_actor_id: 'agent-creator',
    review_status: 'submitted',
    decision: 'accept-value',
    selected_value_ref: reviews[0].candidate_value_refs[0],
    rationale: 'Synthetic decision used only to test rejection.',
    supporting_refs: ['synthetic:test'],
    decided_at: '2026-08-06T15:00:00Z'
  };
  assert.ok(checkSourceReview(review, [...documents, review]).includes(
    `${review.review_id}: reviewer_actor_id must reference a human actor`
  ));
});

test('pending source review rejects prefilled decision fields', async () => {
  const { reviews, documents } = await fixture();
  const review = {
    ...reviews[1],
    decision: 'unresolved',
    rationale: 'This must not be prefilled by the system.',
    decided_at: '2026-08-06T15:00:00Z'
  };
  const errors = checkSourceReview(review, [...documents, review]);
  assert.ok(errors.includes(`${review.review_id}: pending review must not contain a decision`));
  assert.ok(errors.includes(`${review.review_id}: pending review must not contain rationale`));
  assert.ok(errors.includes(`${review.review_id}: pending review must not contain decided_at`));
});

test('source review must cover every candidate value', async () => {
  const { reviews, documents } = await fixture();
  const review = { ...reviews[2], candidate_value_refs: [reviews[2].candidate_value_refs[0]] };
  assert.ok(checkSourceReview(review, [...documents, review]).includes(
    `${review.review_id}: candidate_value_refs must exactly cover conflict values`
  ));
});

test('source-review scaffold writes only pending requests', async () => {
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-source-review-'));
  const relative = path.relative(process.cwd(), temp);
  try {
    const result = await scaffoldSourceReviews(unifiedConfig, relative, {
      spaceId: 'mingos-project',
      createdByActorId: 'agent-continuity',
      reviewerActorId: 'human-yueming',
      createdAt: '2026-08-06T14:50:00Z'
    });
    assert.equal(result.reviews.length, 3);
    assert.ok(result.reviews.every((review) => review.decision === null));
    const written = JSON.parse(await readFile(path.join(temp, 'reviews', `${result.reviews[0].review_id}.json`), 'utf8'));
    assert.equal(written.review_status, 'pending');
    assert.equal(written.decision, null);
    const instructions = await readFile(path.join(temp, 'REVIEW_REQUIRED.md'), 'utf8');
    assert.match(instructions, /did not choose a value or submit a decision/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('source-review CLI reports pending requests without a decision', async () => {
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-source-review-cli-'));
  const relative = path.relative(process.cwd(), temp);
  try {
    const { stdout } = await execFileAsync(process.execPath, [
      'packages/cli/bin/ming.mjs',
      'source-review',
      'scaffold',
      unifiedConfig,
      '--out', relative,
      '--space', 'mingos-project',
      '--created-by', 'agent-continuity',
      '--reviewer', 'human-yueming',
      '--created-at', '2026-08-06T14:50:00Z'
    ]);
    assert.match(stdout, /Conflict candidates: 3/);
    assert.match(stdout, /Pending human reviews: 3/);
    assert.match(stdout, /No review decision was generated/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

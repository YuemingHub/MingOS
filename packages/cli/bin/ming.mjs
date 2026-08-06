#!/usr/bin/env node
import process from 'node:process';
import { inspectBundle, validateBundle } from '../src/bundle.mjs';
import { scaffoldSourceReviews } from '../src/source-review.mjs';
import { analyzeSnapshot, scaffoldSnapshot } from '../src/snapshot.mjs';

function usage() {
  console.error(`Usage:
  ming bundle <validate|inspect> <bundle-file> [--json]
  ming snapshot analyze <config-file> [--json]
  ming snapshot scaffold <config-file> --out <directory> [--force] [--json]
  ming source-review scaffold <config-file> --out <directory> --space <space-id> --created-by <actor-id> --reviewer <human-actor-id> --created-at <timestamp> [--force] [--json]`);
}

function flagValue(flags, name) {
  const index = flags.indexOf(name);
  return index >= 0 ? flags[index + 1] : null;
}

const [group, command, target, ...flags] = process.argv.slice(2);

try {
  if (group === 'bundle' && ['validate', 'inspect'].includes(command) && target) {
    const result = await validateBundle(target);
    if (result.errors.length > 0) {
      console.error('MingOS bundle validation failed:');
      for (const error of result.errors) console.error(`- ${error}`);
      process.exit(1);
    }

    if (command === 'validate') {
      console.log(`MingOS bundle validation passed: ${result.bundle.bundle_id} (${result.documents.length} documents)`);
    } else {
      const summary = inspectBundle(result.bundle, result.documents);
      if (flags.includes('--json')) console.log(JSON.stringify(summary, null, 2));
      else {
        console.log(`Bundle: ${summary.bundle_id}`);
        console.log(`Revision: ${summary.source_revision}`);
        console.log(`Space: ${summary.space?.name ?? 'unknown'}`);
        console.log(`Intent: ${summary.intent?.understanding ?? 'unknown'}`);
        console.log(`Next actor: ${summary.next_actor_id}`);
        console.log(`Authorization: ${summary.authorization?.id ?? 'missing'} (${summary.authorization?.status ?? 'missing'})`);
        console.log(`Pending source reviews: ${summary.source_reviews.filter((review) => review.status === 'pending').length}`);
        console.log(`Blockers: ${summary.blockers.length}`);
        console.log('Next actions:');
        for (const action of summary.next_actions) console.log(`- ${action}`);
      }
    }
  } else if (group === 'snapshot' && command === 'analyze' && target) {
    const report = await analyzeSnapshot(target);
    if (flags.includes('--json')) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`Snapshot: ${report.snapshot_id}`);
      console.log(`Source: ${report.source.repository}@${report.source.revision}`);
      console.log(`Verified files: ${report.cost.source_files}`);
      console.log(`Existing artifacts: ${report.cost.generated_artifacts}`);
      console.log(`Mechanical artifacts: ${report.cost.mechanical_artifacts}`);
      console.log(`Extracted claims: ${report.semantic_coverage.extracted_markdown_claims}`);
      console.log(`Mapped claims: ${report.semantic_coverage.mapped_claims}`);
      console.log(`Coverage: ${(report.semantic_coverage.coverage_ratio * 100).toFixed(1)}%`);
      console.log(`Automate deterministic snapshot: ${report.decision.automate_deterministic_snapshot ? 'yes' : 'no'}`);
      console.log(`Automate semantic interpretation: ${report.decision.automate_semantic_interpretation ? 'yes' : 'no'}`);
    }
  } else if (group === 'snapshot' && command === 'scaffold' && target) {
    const outputDir = flagValue(flags, '--out');
    const result = await scaffoldSnapshot(target, outputDir, { force: flags.includes('--force') });
    if (flags.includes('--json')) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`MingOS snapshot scaffold created: ${result.outputDir}`);
      for (const file of result.files) console.log(`- ${file}`);
      console.log('Semantic interpretation and authorization still require review.');
    }
  } else if (group === 'source-review' && command === 'scaffold' && target) {
    const result = await scaffoldSourceReviews(target, flagValue(flags, '--out'), {
      spaceId: flagValue(flags, '--space'),
      createdByActorId: flagValue(flags, '--created-by'),
      reviewerActorId: flagValue(flags, '--reviewer'),
      createdAt: flagValue(flags, '--created-at'),
      force: flags.includes('--force')
    });
    if (flags.includes('--json')) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`MingOS source review scaffold created: ${result.outputDir}`);
      console.log(`Conflict candidates: ${result.conflictReport.candidates.length}`);
      console.log(`Pending human reviews: ${result.reviews.length}`);
      console.log('No review decision was generated.');
    }
  } else {
    usage();
    process.exit(2);
  }
} catch (error) {
  console.error(`MingOS CLI failed: ${error.message}`);
  process.exit(1);
}

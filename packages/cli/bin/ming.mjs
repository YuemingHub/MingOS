#!/usr/bin/env node
import process from 'node:process';
import { inspectBundle, validateBundle } from '../src/bundle.mjs';

function usage() {
  console.error('Usage: ming bundle <validate|inspect> <bundle-file> [--json]');
}

const [group, command, bundleFile, ...flags] = process.argv.slice(2);
if (group !== 'bundle' || !['validate', 'inspect'].includes(command) || !bundleFile) {
  usage();
  process.exit(2);
}

try {
  const result = await validateBundle(bundleFile);
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
      console.log(`Blockers: ${summary.blockers.length}`);
      console.log('Next actions:');
      for (const action of summary.next_actions) console.log(`- ${action}`);
    }
  }
} catch (error) {
  console.error(`MingOS CLI failed: ${error.message}`);
  process.exit(1);
}

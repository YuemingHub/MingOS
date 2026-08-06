import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { checkContextLedger, checkSpaceReferences, checkTaskCompletion } from './invariants.mjs';
import { validateSchema } from './schema-validator.mjs';

const root = path.resolve(process.cwd());
const target = path.resolve(root, process.argv[2] ?? 'examples');
const schemaDir = path.join(root, 'schemas');

const schemaFiles = {
  space: 'space.schema.json',
  actor: 'actor.schema.json',
  'context-ledger': 'context-ledger.schema.json',
  'intent-contract': 'intent-contract.schema.json',
  task: 'task.schema.json',
  evidence: 'evidence.schema.json',
  handoff: 'handoff.schema.json'
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
  documents.push(document);
}

const evidenceById = new Map(documents.filter((d) => d.kind === 'evidence').map((d) => [d.evidence_id, d]));
for (const task of documents.filter((d) => d.kind === 'task')) failures.push(...checkTaskCompletion(task, evidenceById));
for (const ledger of documents.filter((d) => d.kind === 'context-ledger')) failures.push(...checkContextLedger(ledger));
failures.push(...checkSpaceReferences(documents));

if (failures.length > 0) {
  console.error('MingOS validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`MingOS validation passed: ${documents.length} documents`);

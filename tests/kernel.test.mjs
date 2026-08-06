import test from 'node:test';
import assert from 'node:assert/strict';
import { checkContextLedger, checkTaskCompletion } from '../packages/kernel/src/index.mjs';

test('completed task requires evidence', () => {
  const task = {
    task_id: 'TASK-1',
    status: 'completed',
    evidence_refs: [],
    requires_human_approval: false
  };
  assert.deepEqual(checkTaskCompletion(task, new Map()), [
    'TASK-1: completed task must reference evidence'
  ]);
});

test('completed task accepts passed evidence', () => {
  const task = {
    task_id: 'TASK-1',
    status: 'completed',
    evidence_refs: ['E-1'],
    requires_human_approval: false
  };
  const evidence = new Map([['E-1', {
    evidence_id: 'E-1',
    task_id: 'TASK-1',
    verification_status: 'passed'
  }]]);
  assert.deepEqual(checkTaskCompletion(task, evidence), []);
});

test('context ledger rejects missing derivation target', () => {
  const ledger = {
    records: [{
      record_id: 'R-2',
      record_type: 'inference',
      status: 'pending',
      derived_from: 'R-1'
    }]
  };
  assert.deepEqual(checkContextLedger(ledger), [
    'R-2: derived_from references missing record R-1'
  ]);
});

import { validateSchema } from '../packages/kernel/src/schema-validator.mjs';

test('schema validator rejects additional properties', () => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['name'],
    properties: { name: { type: 'string', minLength: 1 } }
  };
  assert.deepEqual(validateSchema(schema, { name: 'MingOS', extra: true }), [
    '$.extra: additional property is not allowed'
  ]);
});

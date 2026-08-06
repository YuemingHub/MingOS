import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkActorReferences,
  checkAuthorization,
  checkContextLedger,
  checkTaskAuthorization,
  checkTaskCompletion
} from '../packages/kernel/src/index.mjs';
import { validateSchema } from '../packages/kernel/src/schema-validator.mjs';

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

test('task actions must stay within authorization', () => {
  const task = {
    task_id: 'TASK-1',
    space_id: 'space-1',
    assigned_actor_id: 'agent-1',
    authorization_ref: 'AUTH-1',
    allowed_actions: ['deploy']
  };
  const authorizations = new Map([['AUTH-1', {
    authorization_id: 'AUTH-1',
    space_id: 'space-1',
    granted_to_actor_id: 'agent-1',
    allowed_actions: ['read'],
    status: 'active'
  }]]);
  assert.deepEqual(checkTaskAuthorization(task, authorizations), [
    'TASK-1: action deploy is outside authorization'
  ]);
});

test('irreversible authorization requires step approval', () => {
  assert.deepEqual(checkAuthorization({
    authorization_id: 'AUTH-1',
    irreversible_actions_allowed: true,
    requires_step_approval: false,
    status: 'active'
  }), ['AUTH-1: irreversible actions require step approval']);
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

test('actor references must resolve', () => {
  const documents = [{
    kind: 'space',
    space_id: 'space-1',
    owner_actor_id: 'human-1',
    member_actor_ids: ['agent-1']
  }, {
    kind: 'actor',
    actor_id: 'human-1'
  }];
  assert.deepEqual(checkActorReferences(documents), [
    'space-1.member_actor_ids: unknown actor_id agent-1'
  ]);
});

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

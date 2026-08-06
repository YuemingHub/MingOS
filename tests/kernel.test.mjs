import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkActorReferences,
  checkAuthorization,
  checkContextLedger,
  checkContinuityBundle,
  checkHandoffReferences,
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

test('handoff dependency references must resolve', () => {
  const handoff = {
    handoff_id: 'H-1',
    actor_refs: ['agent-missing'],
    authorization_refs: ['AUTH-missing'],
    task_refs: ['TASK-missing'],
    evidence_refs: ['E-missing']
  };
  assert.deepEqual(checkHandoffReferences(handoff, []), [
    'H-1: actor_ref agent-missing not found',
    'H-1: authorization_ref AUTH-missing not found',
    'H-1: task_ref TASK-missing not found',
    'H-1: evidence_ref E-missing not found'
  ]);
});

test('continuity bundle requires actor and authorization coverage', () => {
  const bundle = {
    bundle_id: 'B-1',
    space_id: 'space-1',
    source_revision: 'abcdef1',
    next_actor_id: 'agent-1',
    artifacts: [
      { path: 'space.json', artifact_kind: 'space', artifact_ids: ['space-1'] },
      { path: 'intent.json', artifact_kind: 'intent-contract', artifact_ids: ['INTENT-1'] },
      { path: 'context.json', artifact_kind: 'context-ledger', artifact_ids: ['CTX-1'] },
      { path: 'task.json', artifact_kind: 'task', artifact_ids: ['TASK-1'] },
      { path: 'evidence.json', artifact_kind: 'evidence', artifact_ids: ['E-1'] },
      { path: 'handoff.json', artifact_kind: 'handoff', artifact_ids: ['H-1'] }
    ]
  };
  const errors = checkContinuityBundle(bundle, []);
  assert.ok(errors.includes('B-1: missing required artifact kind actor'));
  assert.ok(errors.includes('B-1: missing required artifact kind authorization'));
  assert.ok(errors.includes('B-1: next_actor_id agent-1 not found'));
  assert.ok(errors.includes('B-1: next actor lacks bundled active authorization'));
});

test('continuity bundle accepts complete authorized handoff', () => {
  const paths = ['space.json', 'actor.json', 'authorization.json', 'intent.json', 'context.json', 'task.json', 'evidence.json', 'handoff.json'];
  const documents = [
    { kind: 'space', space_id: 'space-1' },
    { kind: 'actor', actor_id: 'agent-1', active: true },
    { kind: 'authorization', authorization_id: 'AUTH-1', space_id: 'space-1', granted_to_actor_id: 'agent-1', status: 'active' },
    { kind: 'intent-contract', intent_id: 'INTENT-1' },
    { kind: 'context-ledger', records: [{ record_id: 'CTX-1' }] },
    { kind: 'task', task_id: 'TASK-1' },
    { kind: 'evidence', evidence_id: 'E-1' },
    { kind: 'handoff', handoff_id: 'H-1', source_revision: 'abcdef1', required_reads: paths }
  ];
  documents.forEach((document, index) => Object.defineProperty(document, '__file', { value: paths[index], enumerable: false }));
  const bundle = {
    bundle_id: 'B-1',
    space_id: 'space-1',
    source_revision: 'abcdef1',
    next_actor_id: 'agent-1',
    artifacts: [
      { path: 'space.json', artifact_kind: 'space', artifact_ids: ['space-1'] },
      { path: 'actor.json', artifact_kind: 'actor', artifact_ids: ['agent-1'] },
      { path: 'authorization.json', artifact_kind: 'authorization', artifact_ids: ['AUTH-1'] },
      { path: 'intent.json', artifact_kind: 'intent-contract', artifact_ids: ['INTENT-1'] },
      { path: 'context.json', artifact_kind: 'context-ledger', artifact_ids: ['CTX-1'] },
      { path: 'task.json', artifact_kind: 'task', artifact_ids: ['TASK-1'] },
      { path: 'evidence.json', artifact_kind: 'evidence', artifact_ids: ['E-1'] },
      { path: 'handoff.json', artifact_kind: 'handoff', artifact_ids: ['H-1'] }
    ]
  };
  assert.deepEqual(checkContinuityBundle(bundle, documents), []);
});

export function checkTaskCompletion(task, evidenceById) {
  const errors = [];
  if (task.status !== 'completed') return errors;

  if (!Array.isArray(task.evidence_refs) || task.evidence_refs.length === 0) {
    errors.push(`${task.task_id}: completed task must reference evidence`);
    return errors;
  }

  for (const evidenceId of task.evidence_refs) {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) {
      errors.push(`${task.task_id}: evidence ${evidenceId} not found`);
      continue;
    }
    if (!['passed', 'accepted'].includes(evidence.verification_status)) {
      errors.push(`${task.task_id}: evidence ${evidenceId} is not passed or accepted`);
    }
    if (evidence.task_id !== task.task_id) {
      errors.push(`${task.task_id}: evidence ${evidenceId} belongs to ${evidence.task_id}`);
    }
  }

  if (task.requires_human_approval && !task.human_approval_ref) {
    errors.push(`${task.task_id}: human approval is required but missing`);
  }

  return errors;
}

export function checkTaskAuthorization(task, authorizationById) {
  const errors = [];
  const authorization = authorizationById.get(task.authorization_ref);
  if (!authorization) return [`${task.task_id}: authorization ${task.authorization_ref} not found`];
  if (authorization.status !== 'active') errors.push(`${task.task_id}: authorization ${task.authorization_ref} is not active`);
  if (authorization.space_id !== task.space_id) errors.push(`${task.task_id}: authorization belongs to another space`);
  if (authorization.granted_to_actor_id !== task.assigned_actor_id) {
    errors.push(`${task.task_id}: authorization is not granted to assigned actor`);
  }
  for (const action of task.allowed_actions ?? []) {
    if (!authorization.allowed_actions.includes(action)) {
      errors.push(`${task.task_id}: action ${action} is outside authorization`);
    }
  }
  return errors;
}

export function checkAuthorization(authorization) {
  const errors = [];
  if (authorization.irreversible_actions_allowed && !authorization.requires_step_approval) {
    errors.push(`${authorization.authorization_id}: irreversible actions require step approval`);
  }
  if (authorization.status === 'revoked' && !authorization.revoked_at) {
    errors.push(`${authorization.authorization_id}: revoked authorization requires revoked_at`);
  }
  return errors;
}

export function checkContextLedger(ledger) {
  const errors = [];
  const byId = new Map();
  for (const record of ledger.records) {
    if (byId.has(record.record_id)) errors.push(`duplicate context record: ${record.record_id}`);
    byId.set(record.record_id, record);
    if (record.record_type === 'inference' && record.status === 'confirmed' && !record.confidence_basis) {
      errors.push(`${record.record_id}: confirmed inference requires confidence_basis`);
    }
  }

  for (const record of ledger.records) {
    for (const relation of ['supersedes', 'derived_from']) {
      if (record[relation] && !byId.has(record[relation])) {
        errors.push(`${record.record_id}: ${relation} references missing record ${record[relation]}`);
      }
    }
  }
  return errors;
}

export function checkSpaceReferences(documents) {
  const errors = [];
  const spaces = new Set(documents.filter((d) => d.kind === 'space').map((d) => d.space_id));
  for (const doc of documents) {
    if (doc.kind !== 'space' && doc.space_id && !spaces.has(doc.space_id)) {
      errors.push(`${doc.kind}: unknown space_id ${doc.space_id}`);
    }
  }
  return errors;
}

export function checkActorReferences(documents) {
  const errors = [];
  const actors = new Set(documents.filter((d) => d.kind === 'actor').map((d) => d.actor_id));
  const requireActor = (id, label) => {
    if (id && !actors.has(id)) errors.push(`${label}: unknown actor_id ${id}`);
  };

  for (const doc of documents) {
    if (doc.kind === 'space') {
      requireActor(doc.owner_actor_id, `${doc.space_id}.owner_actor_id`);
      for (const actorId of doc.member_actor_ids ?? []) requireActor(actorId, `${doc.space_id}.member_actor_ids`);
    } else if (doc.kind === 'authorization') {
      requireActor(doc.granted_by_actor_id, `${doc.authorization_id}.granted_by_actor_id`);
      requireActor(doc.granted_to_actor_id, `${doc.authorization_id}.granted_to_actor_id`);
    } else if (doc.kind === 'task') {
      requireActor(doc.assigned_actor_id, `${doc.task_id}.assigned_actor_id`);
    } else if (doc.kind === 'evidence') {
      requireActor(doc.produced_by_actor_id, `${doc.evidence_id}.produced_by_actor_id`);
      requireActor(doc.verified_by_actor_id, `${doc.evidence_id}.verified_by_actor_id`);
    } else if (doc.kind === 'handoff') {
      requireActor(doc.from_actor_id, `${doc.handoff_id}.from_actor_id`);
      requireActor(doc.to_actor_id, `${doc.handoff_id}.to_actor_id`);
    }
  }
  return errors;
}

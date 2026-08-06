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

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

function equalSets(left, right) {
  if (left.size !== right.size) return false;
  for (const value of left) if (!right.has(value)) return false;
  return true;
}

export function checkSourceReview(review, documents) {
  const errors = [];
  const report = documents.find((document) =>
    document.kind === 'source-conflict-report' && document.conflict_report_id === review.conflict_report_id
  );
  const actors = new Map(documents.filter((document) => document.kind === 'actor').map((actor) => [actor.actor_id, actor]));
  const reviewer = actors.get(review.reviewer_actor_id);

  if (!report) {
    errors.push(`${review.review_id}: conflict report ${review.conflict_report_id} not found`);
  } else {
    const conflict = report.candidates.find((candidate) => candidate.conflict_id === review.conflict_id);
    if (!conflict) {
      errors.push(`${review.review_id}: conflict ${review.conflict_id} not found in ${review.conflict_report_id}`);
    } else {
      const expected = new Set(conflict.values.map((value) => value.value_id));
      const supplied = new Set(review.candidate_value_refs ?? []);
      if (!equalSets(expected, supplied)) {
        errors.push(`${review.review_id}: candidate_value_refs must exactly cover conflict values`);
      }
      if (review.selected_value_ref && !expected.has(review.selected_value_ref)) {
        errors.push(`${review.review_id}: selected_value_ref ${review.selected_value_ref} is not a conflict value`);
      }
    }
  }

  if (reviewer && reviewer.actor_type !== 'human') {
    errors.push(`${review.review_id}: reviewer_actor_id must reference a human actor`);
  }
  if (reviewer && reviewer.active === false) {
    errors.push(`${review.review_id}: reviewer actor is inactive`);
  }
  if (review.revocable !== true) {
    errors.push(`${review.review_id}: source review must remain revocable`);
  }

  const supportingRefs = review.supporting_refs ?? [];
  const requestedEvidence = review.requested_evidence ?? [];
  const requiresSelectedValue = ['accept-value', 'preserve-history'].includes(review.decision);
  const forbidsSelectedValue = ['unresolved', 'request-evidence'].includes(review.decision);

  if (review.review_status === 'pending') {
    if (review.decision !== null) errors.push(`${review.review_id}: pending review must not contain a decision`);
    if (review.selected_value_ref !== null) errors.push(`${review.review_id}: pending review must not select a value`);
    if (review.rationale !== null) errors.push(`${review.review_id}: pending review must not contain rationale`);
    if (review.decided_at !== null) errors.push(`${review.review_id}: pending review must not contain decided_at`);
    if (supportingRefs.length > 0) errors.push(`${review.review_id}: pending review must not contain supporting_refs`);
    if (requestedEvidence.length > 0) errors.push(`${review.review_id}: pending review must not request evidence before a human decision`);
    if (review.revoked_at !== null || review.revocation_reason !== null) {
      errors.push(`${review.review_id}: pending review must not contain revocation fields`);
    }
    if (review.supersedes_review_id !== null) errors.push(`${review.review_id}: pending review must not supersede another review`);
    return errors;
  }

  if (review.decision === null) errors.push(`${review.review_id}: ${review.review_status} review requires a decision`);
  if (!review.decided_at) errors.push(`${review.review_id}: ${review.review_status} review requires decided_at`);
  if (!review.rationale || review.rationale.trim() === '') {
    errors.push(`${review.review_id}: ${review.review_status} review requires rationale`);
  }
  if (requiresSelectedValue && !review.selected_value_ref) {
    errors.push(`${review.review_id}: decision ${review.decision} requires selected_value_ref`);
  }
  if (forbidsSelectedValue && review.selected_value_ref !== null) {
    errors.push(`${review.review_id}: decision ${review.decision} must not select a value`);
  }
  if (review.decision === 'accept-value' && supportingRefs.length === 0) {
    errors.push(`${review.review_id}: accept-value requires supporting_refs`);
  }
  if (review.decision === 'request-evidence' && requestedEvidence.length === 0) {
    errors.push(`${review.review_id}: request-evidence requires requested_evidence`);
  }
  if (review.decision !== 'request-evidence' && requestedEvidence.length > 0) {
    errors.push(`${review.review_id}: requested_evidence is only valid for request-evidence`);
  }

  if (review.review_status === 'submitted') {
    if (review.revoked_at !== null || review.revocation_reason !== null) {
      errors.push(`${review.review_id}: submitted review must not contain revocation fields`);
    }
  } else if (review.review_status === 'revoked') {
    if (!review.revoked_at) errors.push(`${review.review_id}: revoked review requires revoked_at`);
    if (!review.revocation_reason || review.revocation_reason.trim() === '') {
      errors.push(`${review.review_id}: revoked review requires revocation_reason`);
    }
  }

  if (review.supersedes_review_id) {
    if (review.supersedes_review_id === review.review_id) {
      errors.push(`${review.review_id}: review cannot supersede itself`);
    } else {
      const previous = documents.find((document) =>
        document.kind === 'source-review' && document.review_id === review.supersedes_review_id
      );
      if (!previous) {
        errors.push(`${review.review_id}: superseded review ${review.supersedes_review_id} not found`);
      } else if (previous.conflict_report_id !== review.conflict_report_id || previous.conflict_id !== review.conflict_id) {
        errors.push(`${review.review_id}: superseded review belongs to another conflict`);
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
    } else if (doc.kind === 'source-review') {
      requireActor(doc.created_by_actor_id, `${doc.review_id}.created_by_actor_id`);
      requireActor(doc.reviewer_actor_id, `${doc.review_id}.reviewer_actor_id`);
    }
  }
  return errors;
}

function documentIdentifiers(document) {
  const ids = [];
  const primaryKeys = {
    space: 'space_id',
    actor: 'actor_id',
    authorization: 'authorization_id',
    'intent-contract': 'intent_id',
    task: 'task_id',
    evidence: 'evidence_id',
    handoff: 'handoff_id',
    'continuity-bundle': 'bundle_id',
    'source-conflict-report': 'conflict_report_id',
    'source-review': 'review_id'
  };
  const primaryKey = primaryKeys[document.kind];
  if (primaryKey && document[primaryKey]) ids.push(document[primaryKey]);
  if (document.kind === 'context-ledger') {
    for (const record of document.records ?? []) ids.push(record.record_id);
  }
  if (document.kind === 'source-conflict-report') {
    for (const candidate of document.candidates ?? []) {
      ids.push(candidate.conflict_id);
      for (const value of candidate.values ?? []) ids.push(value.value_id);
    }
  }
  return ids;
}

export function checkHandoffReferences(handoff, documents) {
  const errors = [];
  const actors = new Set(documents.filter((d) => d.kind === 'actor').map((d) => d.actor_id));
  const authorizations = new Set(documents.filter((d) => d.kind === 'authorization').map((d) => d.authorization_id));
  const tasks = new Set(documents.filter((d) => d.kind === 'task').map((d) => d.task_id));
  const evidence = new Set(documents.filter((d) => d.kind === 'evidence').map((d) => d.evidence_id));
  const conflictReports = new Set(documents.filter((d) => d.kind === 'source-conflict-report').map((d) => d.conflict_report_id));
  const sourceReviews = new Set(documents.filter((d) => d.kind === 'source-review').map((d) => d.review_id));

  for (const actorId of handoff.actor_refs ?? []) {
    if (!actors.has(actorId)) errors.push(`${handoff.handoff_id}: actor_ref ${actorId} not found`);
  }
  for (const authorizationId of handoff.authorization_refs ?? []) {
    if (!authorizations.has(authorizationId)) errors.push(`${handoff.handoff_id}: authorization_ref ${authorizationId} not found`);
  }
  for (const taskId of handoff.task_refs ?? []) {
    if (!tasks.has(taskId)) errors.push(`${handoff.handoff_id}: task_ref ${taskId} not found`);
  }
  for (const evidenceId of handoff.evidence_refs ?? []) {
    if (!evidence.has(evidenceId)) errors.push(`${handoff.handoff_id}: evidence_ref ${evidenceId} not found`);
  }
  for (const reportId of handoff.source_conflict_report_refs ?? []) {
    if (!conflictReports.has(reportId)) errors.push(`${handoff.handoff_id}: source_conflict_report_ref ${reportId} not found`);
  }
  for (const reviewId of handoff.source_review_refs ?? []) {
    if (!sourceReviews.has(reviewId)) errors.push(`${handoff.handoff_id}: source_review_ref ${reviewId} not found`);
  }
  return errors;
}

export function checkContinuityBundle(bundle, documents) {
  const errors = [];
  const requiredKinds = ['space', 'actor', 'authorization', 'intent-contract', 'context-ledger', 'task', 'evidence', 'handoff'];
  const artifactKinds = new Set(bundle.artifacts.map((artifact) => artifact.artifact_kind));
  for (const kind of requiredKinds) {
    if (!artifactKinds.has(kind)) errors.push(`${bundle.bundle_id}: missing required artifact kind ${kind}`);
  }

  const paths = bundle.artifacts.map((artifact) => artifact.path);
  if (new Set(paths).size !== paths.length) errors.push(`${bundle.bundle_id}: artifact paths must be unique`);

  const idIndex = new Map();
  for (const document of documents) {
    for (const id of documentIdentifiers(document)) idIndex.set(id, document);
  }

  for (const artifact of bundle.artifacts) {
    for (const id of artifact.artifact_ids ?? []) {
      const document = idIndex.get(id);
      if (!document) {
        errors.push(`${bundle.bundle_id}: artifact id ${id} not found`);
        continue;
      }
      if (document.__file && document.__file !== artifact.path) {
        errors.push(`${bundle.bundle_id}: artifact id ${id} is stored in ${document.__file}, not ${artifact.path}`);
      }
    }
  }

  const nextActor = documents.find((d) => d.kind === 'actor' && d.actor_id === bundle.next_actor_id);
  if (!nextActor) errors.push(`${bundle.bundle_id}: next_actor_id ${bundle.next_actor_id} not found`);
  else if (nextActor.active === false) errors.push(`${bundle.bundle_id}: next actor ${bundle.next_actor_id} is inactive`);

  const bundledAuthorizationIds = new Set(
    bundle.artifacts
      .filter((artifact) => artifact.artifact_kind === 'authorization')
      .flatMap((artifact) => artifact.artifact_ids ?? [])
  );
  const activeAuthorization = documents.find((d) =>
    d.kind === 'authorization' &&
    bundledAuthorizationIds.has(d.authorization_id) &&
    d.space_id === bundle.space_id &&
    d.granted_to_actor_id === bundle.next_actor_id &&
    d.status === 'active'
  );
  if (!activeAuthorization) errors.push(`${bundle.bundle_id}: next actor lacks bundled active authorization`);

  const handoffIds = bundle.artifacts
    .filter((artifact) => artifact.artifact_kind === 'handoff')
    .flatMap((artifact) => artifact.artifact_ids ?? []);
  for (const handoffId of handoffIds) {
    const handoff = documents.find((d) => d.kind === 'handoff' && d.handoff_id === handoffId);
    if (!handoff) continue;
    if (handoff.source_revision !== bundle.source_revision) {
      errors.push(`${bundle.bundle_id}: source_revision differs from ${handoffId}`);
    }
    for (const path of paths) {
      if (!handoff.required_reads.includes(path)) {
        errors.push(`${bundle.bundle_id}: ${handoffId} required_reads omits ${path}`);
      }
    }
  }
  return errors;
}

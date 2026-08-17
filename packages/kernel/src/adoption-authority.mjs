export function resolveAdoptionItem(contract, semanticKey) {
  if (!contract || !Array.isArray(contract.items)) return null;
  return contract.items.find((item) => item.semantic_key === semanticKey) ?? null;
}

export function resolveByClass(contract, authorityClass) {
  return (contract?.items ?? []).filter((item) => item.authority_class === authorityClass);
}

function byOwner(contract, owner) {
  return (contract?.items ?? []).filter((item) => item.authority_owner === owner);
}

export function classifySemantic(contract, semanticKey) {
  const item = resolveAdoptionItem(contract, semanticKey);
  if (!item) return { known: false, semantic_key: semanticKey };
  return {
    known: true,
    semantic_key: semanticKey,
    authority_class: item.authority_class,
    authority_owner: item.authority_owner,
    adoption_status: item.adoption_status,
    foundation_conformance: item.foundation_conformance,
    trigger_evidence: item.trigger_evidence,
    permitted_downstream_effect: item.permitted_downstream_effect,
    forbidden_authority_upgrade: item.forbidden_authority_upgrade
  };
}

function noActionItem(contract) {
  return resolveAdoptionItem(contract, 'AD-NO-ACTION-IS-VALID');
}

function optionalActionItem(contract) {
  return resolveAdoptionItem(contract, 'AD-OPTIONAL-ACTION');
}

function safetyItem(contract) {
  return resolveAdoptionItem(contract, 'HI-LIFE-SAFETY');
}

function evidenceIntegrityItem(contract) {
  return resolveAdoptionItem(contract, 'HI-EVIDENCE-INTEGRITY');
}

function noCategoryItem(contract) {
  return resolveAdoptionItem(contract, 'HI-NO-CATEGORY-PRESCRIPTION');
}

export function evaluateNoAction(contract, { request = 'none', independentSafety = false } = {}) {
  const item = noActionItem(contract);
  if (!item) return { applicable: false, reason: 'AD-NO-ACTION-IS-VALID not adopted' };
  if (independentSafety) {
    return {
      applicable: false,
      outcome: 'protected_action',
      reason: 'independent Safety authority owns a protective requirement; no-action does not apply'
    };
  }
  if (request !== 'none') {
    return {
      applicable: true,
      outcome: 'clarify_or_optional_action',
      reason: 'a person requested direction; no-action remains possible but product may clarify or offer a rejectable candidate'
    };
  }
  return {
    applicable: true,
    outcome: 'no_action',
    reason: 'ordinary interaction may legitimately end with no action'
  };
}

export function evaluateOptionalAction(contract, {
  request = 'none',
  candidate = null,
  explicitChoice = false,
  independentSafety = false
} = {}) {
  const item = optionalActionItem(contract);
  if (!item) return { applicable: false, reason: 'AD-OPTIONAL-ACTION not adopted' };
  if (independentSafety) {
    return {
      applicable: true,
      outcome: 'protected_action',
      rejectable: false,
      reason: 'independent Safety authority exception; protective action may be required'
    };
  }
  const hasRequest = request === 'help' || request === 'action' || request === 'method';
  const hasSupportingCandidate = candidate?.optional === true;
  const canOffer = hasRequest || hasSupportingCandidate;
  if (!canOffer) {
    return {
      applicable: true,
      outcome: 'no_candidate',
      rejectable: true,
      reason: 'no explicit request and no supported candidate; nothing must be forced'
    };
  }
  if (candidate?.rendered_mandatory) {
    return {
      applicable: true,
      outcome: 'blocked',
      rejectable: false,
      reason: 'internally optional candidate must not be rendered as a mandatory command'
    };
  }
  if (!explicitChoice && candidate?.enters_action_memory) {
    return {
      applicable: true,
      outcome: 'blocked',
      rejectable: false,
      reason: 'candidate may enter reviewable action memory only after explicit human choice'
    };
  }
  return {
    applicable: true,
    outcome: 'optional_action',
    rejectable: true,
    reason: 'explicit request or supported candidate yields a rejectable product-owned action candidate'
  };
}

export function evaluateSafety(contract, {
  directSafetyEvidence = false,
  proposedEffect = 'maximum_intervention',
  minimumNecessary = false
} = {}) {
  const item = safetyItem(contract);
  if (!item) return { applicable: false, reason: 'HI-LIFE-SAFETY not adopted' };
  if (!directSafetyEvidence) {
    return {
      applicable: true,
      outcome: 'no_safety_trigger',
      reason: 'no current independent evidence trigger; guard stays inactive'
    };
  }
  if (minimumNecessary) {
    return {
      applicable: true,
      outcome: 'protected_action',
      scope: 'minimum_necessary',
      reason: 'Safety evidence is present; minimum necessary protective action is allowed'
    };
  }
  return {
    applicable: true,
    outcome: 'blocked',
    scope: 'overreach',
    reason: 'Safety permits proportionate minimum-necessary protective handling, not maximum intervention'
  };
}

export function evaluateKnowledgeStatus(contract, {
  incomingStatus = 'UNKNOWN',
  upgradeTo = null,
  source = 'person'
} = {}) {
  const item = evidenceIntegrityItem(contract);
  if (!item) return { applicable: false, reason: 'HI-EVIDENCE-INTEGRITY not adopted' };
  const upgradable = ['REPORT', 'INTERPRETATION', 'INFERENCE', 'UNKNOWN', 'CORRECTION'];
  if (incomingStatus === 'REPORT' && source === 'third_party' && upgradeTo === 'FACT') {
    return {
      applicable: true,
      outcome: 'blocked',
      reason: 'third-party REPORT cannot become that person\u2019s FACT or identity'
    };
  }
  if (upgradable.includes(incomingStatus) && upgradeTo === 'FACT') {
    return {
      applicable: true,
      outcome: 'blocked',
      reason: `${incomingStatus} must not be silently upgraded to FACT`
    };
  }
  if (incomingStatus === 'REPORT' && source === 'third_party' && upgradeTo === 'FACT') {
    return {
      applicable: true,
      outcome: 'blocked',
      reason: 'third-party REPORT cannot become that person\u2019s FACT or identity'
    };
  }
  if (incomingStatus === 'UNKNOWN' && upgradeTo) {
    return {
      applicable: true,
      outcome: 'blocked',
      reason: 'UNKNOWN must be preserved rather than upgraded into certainty'
    };
  }
  return {
    applicable: true,
    outcome: 'preserved',
    knowledge_status: incomingStatus,
    reason: 'knowledge status is preserved as declared'
  };
}

export function evaluateCorrection(contract, {
  hasNewEvidence = false,
  hasCorrection = false,
  priorStatus = null
} = {}) {
  const item = resolveAdoptionItem(contract, 'AD-REVISION-BY-NEW-EVIDENCE');
  if (!item) return { applicable: false, reason: 'AD-REVISION-BY-NEW-EVIDENCE not adopted' };
  if (!hasNewEvidence && !hasCorrection) {
    return { applicable: true, outcome: 'retain_prior', reason: 'no new evidence or correction; prior understanding is retained' };
  }
  return {
    applicable: true,
    outcome: 'supersede_or_retire',
    prior_status: priorStatus,
    reason: 'new evidence or correction may retire or supersede older understanding while retaining traceability'
  };
}

export function evaluateCategoryAuthority(contract, {
  sourceKind = 'legacy',
  attempts = 'prescribe',
  independentEvidenceOwner = false
} = {}) {
  const item = noCategoryItem(contract);
  if (!item) return { applicable: false, reason: 'HI-NO-CATEGORY-PRESCRIPTION not adopted' };
  const categorySources = ['legacy', 'stage', 'layer', 'v2', 'model', 'profile', 'classifier', 'navigation'];
  if (!categorySources.includes(sourceKind)) {
    return { applicable: true, outcome: 'not_category_output', reason: 'source is not a category output' };
  }
  if (attempts === 'organize_evidence' || attempts === 'hypothesis') {
    return {
      applicable: true,
      outcome: 'allowed_hypothesis',
      reason: 'navigation/knowledge may organize evidence or propose hypotheses'
    };
  }
  if (attempts === 'prescribe' || attempts === 'prohibit' || attempts === 'guard_trigger') {
    if (attempts === 'guard_trigger' && independentEvidenceOwner) {
      return {
        applicable: true,
        outcome: 'allowed_independent_trigger',
        reason: 'a current independent evidence owner may activate protection'
      };
    }
    return {
      applicable: true,
      outcome: 'blocked',
      reason: `legacy/${sourceKind} category output cannot ${attempts} by itself`
    };
  }
  return { applicable: true, outcome: 'unclassified', reason: `unsupported attempt ${attempts}` };
}

export function evaluateContinuity(contract, {
  newFact = false,
  priorInterpretation = false,
  handoffPresent = false,
  agentChanged = false,
  pastInferenceAsFact = false
} = {}) {
  const revision = resolveAdoptionItem(contract, 'AD-REVISION-BY-NEW-EVIDENCE');
  if (newFact && priorInterpretation) {
    return {
      applicable: true,
      outcome: 'demote_prior',
      reason: 'new fact appears in long-term continuity; older interpretation is demoted or superseded'
    };
  }
  if (agentChanged && pastInferenceAsFact) {
    return {
      applicable: true,
      outcome: 'blocked',
      reason: 'a replaced Agent must not treat past inference as a new fact'
    };
  }
  if (handoffPresent) {
    return {
      applicable: true,
      outcome: 'preserve_provenance',
      reason: 'handoff must preserve source, UNKNOWN, and unfinished items'
    };
  }
  if (revision) return { applicable: true, outcome: 'retain', reason: 'continuity preserved without silent upgrade' };
  return { applicable: false, reason: 'no continuity item adopted' };
}

export function collectAuthorityOwners(contract) {
  const owners = new Set((contract?.items ?? []).map((item) => item.authority_owner));
  return [...owners];
}

export function verifyContract(contract) {
  const errors = [];
  if (!contract || contract.kind !== 'adoption-authority') {
    errors.push('contract must have kind adoption-authority');
    return errors;
  }
  const classes = new Set(['hard_invariant', 'adaptive_default', 'product_owned_choice']);
  const ownerMap = new Map();
  for (const item of contract.items ?? []) {
    if (!classes.has(item.authority_class)) errors.push(`${item.semantic_key}: unknown authority_class`);
    if (item.authority_class === 'hard_invariant' && item.authority_owner !== 'Foundation') {
      errors.push(`${item.semantic_key}: hard_invariant must be Foundation-owned`);
    }
    if (item.authority_class === 'product_owned_choice' && item.authority_owner === 'Foundation') {
      errors.push(`${item.semantic_key}: product_owned_choice cannot be Foundation-owned`);
    }
    if (item.adoption_status === 'full' && item.foundation_conformance !== false) {
      errors.push(`${item.semantic_key}: full adoption still requires foundation_conformance=false until source is Accepted`);
    }
    if (ownerMap.has(item.semantic_key)) errors.push(`${item.semantic_key}: duplicate semantic_key`);
    ownerMap.set(item.semantic_key, true);
  }
  const foundationItems = byOwner(contract, 'Foundation');
  if (foundationItems.length === 0) errors.push('contract must consume at least one Foundation-owned item');
  return errors;
}

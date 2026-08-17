import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  classifySemantic,
  collectAuthorityOwners,
  evaluateCategoryAuthority,
  evaluateContinuity,
  evaluateCorrection,
  evaluateKnowledgeStatus,
  evaluateNoAction,
  evaluateOptionalAction,
  evaluateSafety,
  resolveAdoptionItem,
  verifyContract
} from '../packages/kernel/src/index.mjs';
import { validateSchema } from '../packages/kernel/src/schema-validator.mjs';

const contractPath = new URL('../examples/adoption-authority/adoption-authority.json', import.meta.url);
const schemaPath = new URL('../schemas/adoption-authority.schema.json', import.meta.url);

const contract = JSON.parse(await readFile(contractPath, 'utf8'));
const schema = JSON.parse(await readFile(schemaPath, 'utf8'));

function scenario(label) {
  return { label };
}

test('adoption contract parses against its own schema', () => {
  assert.deepEqual(validateSchema(schema, contract), []);
});

test('adoption contract consumes Foundation Proposed sources without conformance', () => {
  assert.equal(contract.adopted_foundation.source_status, 'Proposed');
  assert.equal(contract.adoption_status, 'provisional');
  assert.equal(contract.foundation_conformance, false);
  assert.equal(contract.adopted_foundation.source_revision.length >= 7, true);
});

test('adoption contract covers all three authority classes', () => {
  const classes = new Set(contract.items.map((item) => item.authority_class));
  assert.deepEqual([...classes].sort(), ['adaptive_default', 'hard_invariant', 'product_owned_choice']);
});

test('contract invariant audit passes', () => {
  assert.deepEqual(verifyContract(contract), []);
});

test('hard_invariant items are all Foundation-owned and provisional', () => {
  for (const item of contract.items.filter((item) => item.authority_class === 'hard_invariant')) {
    assert.equal(item.authority_owner, 'Foundation');
    assert.equal(item.adoption_status, 'provisional');
    assert.equal(item.foundation_conformance, false);
  }
});

test('SCENARIO 1: ordinary conversation may legitimately end with no action', () => {
  const result = evaluateNoAction(contract, scenario('ordinary conversation with no request'));
  assert.equal(result.outcome, 'no_action');
  assert.equal(result.applicable, true);
});

test('SCENARIO 2: explicit method request yields an optional, rejectable candidate', () => {
  const result = evaluateOptionalAction(contract, {
    request: 'method',
    candidate: { optional: true, rendered_mandatory: false },
    explicitChoice: false
  });
  assert.equal(result.outcome, 'optional_action');
  assert.equal(result.rejectable, true);
});

test('SCENARIO 3: internally optional candidate must not be rendered as a mandatory command', () => {
  const result = evaluateOptionalAction(contract, {
    request: 'action',
    candidate: { optional: true, rendered_mandatory: true },
    explicitChoice: false
  });
  assert.equal(result.outcome, 'blocked');
  assert.match(result.reason, /mandatory command/);
});

test('SCENARIO 4: candidate enters reviewable action semantics only after explicit human choice', () => {
  const result = evaluateOptionalAction(contract, {
    request: 'action',
    candidate: { optional: true, rendered_mandatory: false, enters_action_memory: true },
    explicitChoice: false
  });
  assert.equal(result.outcome, 'blocked');
  assert.match(result.reason, /explicit human choice/);
});

test('SCENARIO 5: direct Safety evidence permits minimum necessary protective action', () => {
  const result = evaluateSafety(contract, {
    directSafetyEvidence: true,
    minimumNecessary: true
  });
  assert.equal(result.outcome, 'protected_action');
  assert.equal(result.scope, 'minimum_necessary');
});

test('SCENARIO 6: Safety plus ordinary action conflict keeps Safety at minimum necessary scope', () => {
  const safety = evaluateSafety(contract, {
    directSafetyEvidence: true,
    proposedEffect: 'maximum_intervention',
    minimumNecessary: true
  });
  const ordinary = evaluateOptionalAction(contract, {
    request: 'action',
    candidate: { optional: true, rendered_mandatory: false },
    independentSafety: true
  });
  assert.equal(safety.outcome, 'protected_action');
  assert.equal(ordinary.outcome, 'protected_action');
  assert.equal(ordinary.rejectable, false);
});

test('SCENARIO 7: UNKNOWN must be preserved rather than upgraded into certainty', () => {
  const result = evaluateKnowledgeStatus(contract, {
    incomingStatus: 'UNKNOWN',
    upgradeTo: 'FACT'
  });
  assert.equal(result.outcome, 'blocked');
  assert.match(result.reason, /UNKNOWN/);
});

test('SCENARIO 8: CORRECTION and new evidence may retire older understanding', () => {
  const result = evaluateCorrection(contract, {
    hasNewEvidence: true,
    hasCorrection: true,
    priorStatus: 'confirmed'
  });
  assert.equal(result.outcome, 'supersede_or_retire');
});

test('SCENARIO 9: third-party REPORT cannot become that person\u2019s FACT or identity', () => {
  const result = evaluateKnowledgeStatus(contract, {
    incomingStatus: 'REPORT',
    source: 'third_party',
    upgradeTo: 'FACT'
  });
  assert.equal(result.outcome, 'blocked');
  assert.match(result.reason, /third-party REPORT/);
});

test('SCENARIO 10: model confidence cannot become FACT', () => {
  const result = evaluateKnowledgeStatus(contract, {
    incomingStatus: 'INFERENCE',
    upgradeTo: 'FACT'
  });
  assert.equal(result.outcome, 'blocked');
  assert.match(result.reason, /must not be silently upgraded to FACT/);
});

test('SCENARIO 11: legacy stage/category attempting to prescribe is rejected', () => {
  const result = evaluateCategoryAuthority(contract, {
    sourceKind: 'stage',
    attempts: 'prescribe'
  });
  assert.equal(result.outcome, 'blocked');
});

test('SCENARIO 12: legacy stage/category attempting to prohibit is rejected', () => {
  const result = evaluateCategoryAuthority(contract, {
    sourceKind: 'layer',
    attempts: 'prohibit'
  });
  assert.equal(result.outcome, 'blocked');
});

test('SCENARIO 13: navigation/knowledge may organize evidence or propose hypotheses but nothing more', () => {
  const organize = evaluateCategoryAuthority(contract, {
    sourceKind: 'navigation',
    attempts: 'organize_evidence'
  });
  const hypothesis = evaluateCategoryAuthority(contract, {
    sourceKind: 'navigation',
    attempts: 'hypothesis'
  });
  const prescribe = evaluateCategoryAuthority(contract, {
    sourceKind: 'navigation',
    attempts: 'prescribe'
  });
  assert.equal(organize.outcome, 'allowed_hypothesis');
  assert.equal(hypothesis.outcome, 'allowed_hypothesis');
  assert.equal(prescribe.outcome, 'blocked');
});

test('SCENARIO 14: privacy/consent/coercion boundary cannot be bypassed as product convenience', () => {
  const consent = resolveAdoptionItem(contract, 'HI-CONSENT-PRIVACY-COERCION');
  assert.ok(consent);
  assert.match(consent.forbidden_authority_upgrade.join(' '), /product convenience/);
  assert.match(consent.forbidden_authority_upgrade.join(' '), /unlimited consent/);
});

test('SCENARIO 15: Family-specific UI/profile/navigation stays product-owned, not a Core primitive', () => {
  const productItems = contract.items.filter((item) => item.authority_class === 'product_owned_choice');
  assert.ok(productItems.length > 0);
  for (const item of productItems) {
    assert.equal(item.authority_owner, 'downstream product');
    assert.notEqual(item.authority_owner, 'Foundation');
  }
  const coreKinds = new Set(['stage', 'layer', 'navigation', 'profile', 'family']);
  const coreLike = contract.items.filter((item) => coreKinds.has(item.semantic_key.toLowerCase()));
  assert.deepEqual(coreLike, []);
});

test('SCENARIO 16: new fact in long-term continuity demotes or supersedes older interpretation', () => {
  const result = evaluateContinuity(contract, {
    newFact: true,
    priorInterpretation: true
  });
  assert.equal(result.outcome, 'demote_prior');
});

test('SCENARIO 17: handoff preserves source, UNKNOWN, and unfinished items', () => {
  const result = evaluateContinuity(contract, { handoffPresent: true });
  assert.equal(result.outcome, 'preserve_provenance');
});

test('SCENARIO 18: a replaced Agent must not treat past inference as a new fact', () => {
  const result = evaluateContinuity(contract, {
    agentChanged: true,
    pastInferenceAsFact: true
  });
  assert.equal(result.outcome, 'blocked');
  assert.match(result.reason, /past inference as a new fact/);
});

test('SCENARIO A: major setback does not require manufactured meaning, explanation, or action', () => {
  const noAction = evaluateNoAction(contract, scenario('major setback, person just present'));
  assert.equal(noAction.outcome, 'no_action');
  const unknown = evaluateKnowledgeStatus(contract, {
    incomingStatus: 'UNKNOWN',
    upgradeTo: null
  });
  assert.equal(unknown.outcome, 'preserved');
  assert.equal(unknown.knowledge_status, 'UNKNOWN');
});

test('SCENARIO B: repeated pain must not auto-diagnose or create a pathology classifier', () => {
  const diagnostic = evaluateCategoryAuthority(contract, {
    sourceKind: 'model',
    attempts: 'prescribe'
  });
  assert.equal(diagnostic.outcome, 'blocked');
  const evidence = evaluateContinuity(contract, {
    newFact: true,
    priorInterpretation: true
  });
  assert.equal(evidence.outcome, 'demote_prior');
  const noPathology = contract.items.find((item) => /pathology|pain.level|painclassifier/i.test(item.semantic_key));
  assert.equal(noPathology, undefined);
});

test('SCENARIO C: professional reality support preserves continuity without a product script', () => {
  const handoff = evaluateContinuity(contract, { handoffPresent: true });
  assert.equal(handoff.outcome, 'preserve_provenance');
  const productWording = resolveAdoptionItem(contract, 'PO-RESPONSE-EXPERIENCE');
  assert.ok(productWording);
  assert.match(productWording.forbidden_authority_upgrade.join(' '), /must not become a MingOS or Foundation requirement/);
});

test('consumer chain: no new Core primitive is added by this adoption contract', () => {
  const coreKeys = contract.items.map((item) => item.semantic_key);
  const forbiddenPrimitives = ['FamilyStage', 'FamilyLayer', 'PainClassifier', 'SupportExpansionState'];
  for (const key of coreKeys) {
    assert.equal(forbiddenPrimitives.includes(key), false, `forbidden primitive ${key} must not be adopted`);
  }
});

test('classifySemantic answers the authority questions deterministically', () => {
  const safety = classifySemantic(contract, 'HI-LIFE-SAFETY');
  assert.equal(safety.authority_class, 'hard_invariant');
  assert.equal(safety.authority_owner, 'Foundation');
  const noAction = classifySemantic(contract, 'AD-NO-ACTION-IS-VALID');
  assert.equal(noAction.authority_class, 'adaptive_default');
  assert.equal(noAction.authority_owner, 'MingOS');
  const response = classifySemantic(contract, 'PO-RESPONSE-EXPERIENCE');
  assert.equal(response.authority_class, 'product_owned_choice');
  assert.equal(response.authority_owner, 'downstream product');
  assert.equal(classifySemantic(contract, 'NONEXISTENT').known, false);
});

test('authority owners are exactly Foundation, MingOS and downstream product', () => {
  assert.deepEqual(collectAuthorityOwners(contract).sort(), ['Foundation', 'MingOS', 'downstream product']);
});

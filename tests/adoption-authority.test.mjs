import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifestUrl = new URL('../docs/protocols/adoption-authority.manifest.json', import.meta.url);
const docUrl = new URL('../docs/protocols/ADOPTION_AUTHORITY.md', import.meta.url);

const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
const doc = await readFile(docUrl, 'utf8');

function semantic(key) {
  const item = manifest.semantics.find(entry => entry.key === key);
  assert(item, `missing adoption semantic: ${key}`);
  return item;
}

function includesAny(items = [], value) {
  return items.some(item => item === value);
}

test('adoption manifest has only the three bounded authority classes', () => {
  assert.deepEqual(
    Object.keys(manifest.classes).sort(),
    ['adaptive_default', 'hard_invariant', 'product_owned_choice'].sort(),
  );
  assert.equal(manifest.classes.hard_invariant.owner, 'Foundation');
  assert.equal(manifest.classes.adaptive_default.owner, 'MingOS');
  assert.equal(manifest.classes.product_owned_choice.owner, 'DownstreamProduct');
  assert.equal(manifest.classes.adaptive_default.mayRequireAction, false);
  assert.equal(manifest.classes.product_owned_choice.mayRequireAction, false);
});

test('guard activation requires current independent evidence and legacy categories cannot prescribe or prohibit', () => {
  assert.equal(
    manifest.canonicalRules.guardActivation,
    'only_current_independent_evidence_authority_may_activate_protection',
  );
  assert.equal(
    manifest.canonicalRules.legacyClassification,
    'may_offer_hypothesis_but_cannot_prescribe_or_prohibit',
  );

  const legacy = semantic('legacy_model_boundary');
  assert.equal(legacy.class, 'hard_invariant');
  assert(includesAny(legacy.forbiddenUpgrade, 'legacy_category_to_prescription'));
  assert(includesAny(legacy.forbiddenUpgrade, 'legacy_category_to_prohibition'));
  assert(includesAny(legacy.validation, 'authority_removed_before_consumer_decision'));
});

test('ordinary interaction may legitimately end with no action', () => {
  assert.equal(
    manifest.canonicalRules.ordinaryAction,
    'no_action_is_valid_without_current_action_authority',
  );
  const noAction = semantic('ordinary_no_action');
  assert.equal(noAction.class, 'adaptive_default');
  assert(includesAny(noAction.permittedEffect, 'no_action'));
  assert(includesAny(noAction.forbiddenUpgrade, 'ordinary_turn_to_mandatory_next_step'));
  assert.match(doc, /ordinary interaction does not require an action/i);
  assert.match(doc, /no action/i);
});

test('ordinary action requires current human intent, visible rejectability and explicit durable promotion', () => {
  const action = semantic('ordinary_optional_action');
  assert.equal(action.class, 'product_owned_choice');
  assert.equal(action.authorityOwner, 'DownstreamProductWithExplicitHumanIntent');
  assert(includesAny(action.permittedEffect, 'bounded_optional_candidate'));
  assert(includesAny(action.forbiddenUpgrade, 'optional_metadata_to_mandatory_visible_command'));
  assert(includesAny(action.forbiddenUpgrade, 'unaccepted_candidate_to_action_memory'));
  assert(includesAny(action.validation, 'visible_rejectability'));
  assert(includesAny(action.validation, 'explicit_human_choice_before_durable_promotion'));
  assert.equal(manifest.canonicalRules.durableActionPromotion, 'explicit_human_choice_required');
});

test('Safety remains the independent exception for required protective action', () => {
  const safety = semantic('life_safety_protection');
  assert.equal(safety.class, 'hard_invariant');
  assert(includesAny(safety.permittedEffect, 'minimum_necessary_protective_action'));
  assert.equal(
    manifest.canonicalRules.safetyAction,
    'minimum_necessary_protective_action_may_be_required_when_safety_owned',
  );
  assert(includesAny(safety.forbiddenUpgrade, 'legacy_category_to_safety'));
});

test('source, uncertainty and correction remain separate from fact authority', () => {
  const provenance = semantic('epistemic_provenance');
  assert(includesAny(provenance.forbiddenUpgrade, 'report_to_fact_without_evidence'));
  assert(includesAny(provenance.forbiddenUpgrade, 'inference_to_identity'));
  assert(includesAny(provenance.forbiddenUpgrade, 'knowledge_to_evidence'));

  const uncertainty = semantic('uncertainty_and_hypothesis');
  assert(includesAny(uncertainty.permittedEffect, 'unknown'));
  assert(includesAny(uncertainty.forbiddenUpgrade, 'unknown_to_default_stage'));

  const correction = semantic('correction_reversibility');
  assert(includesAny(correction.permittedEffect, 'retire_old_interpretation'));
  assert.equal(
    manifest.canonicalRules.correction,
    'new_evidence_or_correction_may_retire_older_interpretation',
  );
});

test('professional-support intent is not severity and third-party reports stay reports', () => {
  const support = semantic('professional_support_information');
  assert(includesAny(support.forbiddenUpgrade, 'third_party_report_to_user_intent'));
  assert(includesAny(support.forbiddenUpgrade, 'support_inquiry_to_severity'));
  assert(includesAny(support.forbiddenUpgrade, 'support_inquiry_to_mandatory_referral'));
});

test('derived navigation remains recomputable and cannot self-promote into truth or action', () => {
  const navigation = semantic('derived_navigation');
  assert(includesAny(navigation.permittedEffect, 'recomputable_navigation'));
  assert(includesAny(navigation.forbiddenUpgrade, 'navigation_to_canonical_fact'));
  assert(includesAny(navigation.forbiddenUpgrade, 'navigation_to_prescription'));
  assert(includesAny(navigation.forbiddenUpgrade, 'navigation_to_prohibition'));
  assert(includesAny(navigation.forbiddenUpgrade, 'navigation_feedback_to_self_confirmed_truth'));
  assert(includesAny(navigation.validation, 'derived_navigation_may_be_absent'));
});

test('product-specific implementation objects do not automatically become MingOS Core', () => {
  const product = semantic('product_expression_and_ui');
  assert.equal(product.class, 'product_owned_choice');
  assert(includesAny(product.forbiddenUpgrade, 'product_field_to_universal_core_primitive'));
  assert.match(doc, /not automatically a Core object/i);
});

test('manifest explicitly carries non-conformance / non-release claims', () => {
  for (const marker of [
    'not_foundation_conformance',
    'not_certification',
    'not_merge_approval',
    'not_production_authorization',
  ]) {
    assert(manifest.nonClaims.includes(marker), `missing non-claim: ${marker}`);
  }
});

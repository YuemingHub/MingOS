import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dependencyPath = new URL('../docs/FOUNDATION_DEPENDENCY.md', import.meta.url);
const dependency = await readFile(dependencyPath, 'utf8');

test('Foundation dependency pins the observed merged main baseline', () => {
  assert.match(dependency, /status: Proposed/);
  assert.match(dependency, /YuemingHub\/mingos-foundation/);
  assert.match(dependency, /4d50b9faeabe1e17c3bfc94e50f1c161375616f7/);
  assert.match(dependency, /1\.0\.0-alpha\.19/);
  assert.match(dependency, /PR #15, #12, #16 merged/);
});

test('merged Draft Kernel documents do not become silent MingOS authority', () => {
  assert.match(dependency, /KERNEL-0004/);
  assert.match(dependency, /KERNEL-0005/);
  assert.match(dependency, /remain `Draft`/);
  assert.match(dependency, /NoCurrentKernelConformanceClaim/);
  assert.match(dependency, /no conformance, certification or completeness claim/);
  assert.match(dependency, /A Draft document does not become binding/);
});

test('downstream adoption remains flexible and risk-proportionate', () => {
  assert.match(dependency, /flexibility in language, pacing, mode selection and family-context interpretation/);
  assert.match(dependency, /life-safety, violence, abuse, privacy, rights or professional-authority risks/);
  assert.match(dependency, /successful product behavior is evidence for review/);
});

test('downstream product evidence cannot promote Foundation or Kernel authority', () => {
  assert.match(dependency, /never silently promote product fields/);
  assert.match(dependency, /cannot directly rewrite/);
  assert.match(dependency, /remains Proposed and easy to revise/);
});

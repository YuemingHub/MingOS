import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dependencyPath = new URL('../docs/FOUNDATION_DEPENDENCY.md', import.meta.url);
const dependency = await readFile(dependencyPath, 'utf8');

test('Foundation dependency pins the observed main baseline', () => {
  assert.match(dependency, /status: Proposed/);
  assert.match(dependency, /YuemingHub\/mingos-foundation/);
  assert.match(dependency, /280a68705d13bbb5beed3a64713575fad7cba189/);
  assert.match(dependency, /1\.0\.0-alpha\.18/);
});

test('Foundation Drafts cannot become silent MingOS authority', () => {
  assert.match(dependency, /Foundation PR #15/);
  assert.match(dependency, /bc13ebb8dd7aa49b6b8fd9a394a6b073ef61f38a/);
  assert.match(dependency, /Foundation PR #12/);
  assert.match(dependency, /187c11b68b908e3e0baa0fd5a43371351aa2e84c/);
  assert.match(dependency, /NoCurrentKernelConformanceClaim/);
  assert.match(dependency, /Do not claim Kernel conformance/);
  assert.match(dependency, /not merged/);
});

test('downstream product evidence cannot promote Foundation or Kernel authority', () => {
  assert.match(dependency, /never silently promote product fields/);
  assert.match(dependency, /successful behavior is evidence for review/);
  assert.match(dependency, /must remain easy to revise/);
});

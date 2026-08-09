import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /defd45a31c0fb437ad4531a9aa79d750251339d3/);
  assert.match(coordination, /1e70c5933675db1591edb7dc3f3c63159e6240c5/);
  assert.match(coordination, /PR #164/);
  assert.match(coordination, /PR #165/);
  assert.match(coordination, /PR #158/);
  assert.match(coordination, /PR #159/);
  assert.match(coordination, /PR #160/);
  assert.match(coordination, /31262209996/);
});

test('coordination snapshot records the proven family-controlled revision journey without promotion', () => {
  assert.match(coordination, /PR #159锛欶amily-only memory clarification gate/);
  assert.match(coordination, /PR #160 灏?#158 涓?#159 涓叉垚璺ㄦā鍧楀洖褰?);
  assert.match(coordination, /clarification 闆跺啓鍏?);
  assert.match(coordination, /鏃х増鏈€€鍑?AI context/);
  assert.match(coordination, /涓嬩竴杞?AI 鍙湅鍒板闀夸慨姝ｅ悗鐨勫綋鍓嶇増鏈?);
  assert.match(coordination, /杩欎粛鐒舵槸 Family-Space 浜у搧瀹炵幇鍜岄獙璇佺粨鏋滐紝涓嶆槸 MingOS 鏂伴€氱敤瀵硅薄/);
});

test('coordination snapshot preserves repository responsibility boundaries', () => {
  assert.match(coordination, /MingOS 涓嶆嫢鏈?Family-Space 鐨勪骇鍝佸悎骞舵潈/);
  assert.match(coordination, /涓嶆妸 Family-specific profile銆乵emory revision UI銆乧larification gate銆丗amily rights editor 鎴栧搴樁娈靛瓧娈靛彉鎴愰€氱敤鍗忚/);
  assert.match(coordination, /revision facade銆乧larification gate銆乺ights editor 鍜屼竴娆℃湁鏁堝仛娉曚笉浼氬洜涓哄瓨鍦ㄦ垨閫氳繃娴嬭瘯灏辫嚜鍔ㄦ垚涓?MingOS 瀵硅薄鎴?Foundation 鍘熷垯/);
  assert.match(coordination, /Foundation 浠呭鏍哥湡姝ｄ笂鍗囧埌鍘熷垯銆佹潈鍒┿€佸畨鍏ㄦ垨娌荤悊灞傜殑闂/);
});

test('coordination snapshot rejects a second confirmation state machine', () => {
  assert.match(coordination, /涓嶉渶瑕佷负浜嗏€滄緞娓呬箣鍚庢€庝箞鍔炩€濆啀閫?pending clarification 琛ㄣ€佺浜屽 memory API 鎴栬嚜鍔ㄧ‘璁ょ姸鎬佹満/);
  assert.match(coordination, /鈥滄垜鐨?鈫?绯荤粺璁颁笅鐨勫唴瀹光€濊礋璐ｅ闀夸富鍔ㄤ慨姝?);
  assert.match(coordination, /鑻ョ湡瀹炲闀夸娇鐢ㄨ瘉鏄庝粠瀵硅瘽鍒扳€滄垜鐨勨€濆瓨鍦ㄦ槑鏄惧鎵炬垚鏈?);
  assert.match(coordination, /鍙兘瀵艰埅鍒版棦鏈夋潈鍒╁叆鍙?);

  const prohibitedSection = coordination.match(/### 褰撳墠绂佹[\s\S]*?### 褰撳墠椤哄簭/)?.[0] || '';
  assert.match(prohibitedSection, /璁?AI 鍦ㄦ病鏈夊闀跨‘璁ょ殑鎯呭喌涓嬭嚜鍔ㄥ悎骞躲€佽鐩栥€佸け鏁堟垨鍒ゅ畾浜掔浉鍐茬獊鐨勫搴悊瑙?);
  assert.match(prohibitedSection, /鍐嶉€犵浜屽 memory API銆乸ending clarification 琛ㄦ垨鑷姩纭鐘舵€佹満/);
  assert.match(prohibitedSection, /鎶婂綋鍓?synthetic journey 娴嬭瘯琛ㄨ堪涓虹湡瀹炲搴獙璇?);
});

test('coordination snapshot returns Family execution to the real parent journey', () => {
  assert.match(coordination, /Family 涓嬩竴浜у搧浼樺厛绾у洖鍒扳€滅涓€娆¤繘鍏?鈫?绗竴鍙ヨ瘽 鈫?鍓嶄笁杞?鈫?绗簩娆″洖鏉モ€?);
  assert.match(coordination, /璇勪及鈥滄垜鎯崇籂姝ｇ郴缁熺悊瑙ｂ€濇槸鍚﹁兘鑷劧璧板埌鈥滄垜鐨?鈫?绯荤粺璁颁笅鐨勫唴瀹光€?);
  assert.doesNotMatch(coordination, /涓嬩竴浜у搧姝ヤ紭鍏堣ˉ榻愨€滄緞娓呭悗鐨勬樉寮忕‘璁ゆˉ鈥?);
  assert.doesNotMatch(coordination, /鍦ㄦ渶鏂?`production` 涓婅璁℃渶灏忔樉寮忕‘璁ゆˉ/);
});


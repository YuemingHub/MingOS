# Ming Foundation 收割审计（Foundation Harvest Audit）

- 日期：2026-09-25
- 执行者：Window 1 / Lane A Primary Executor
- 任务真源：YuemingHub/MingOS Issue #43（Phase A）· YuemingHub/agent-workspace Issue #10 Lane A · agent-workspace `项目记录/REPO_REDUCTION_PASS_2.md` §2
- 审计对象（只读）：`YuemingHub/mingos-foundation` @ `main` `fc40f98`（2026-09-25 观测）
- 接收方基线：`YuemingHub/MingOS` @ `main` `43981fa`
- 只读对照：`Personal-Reality-Kernel`、`agent-workspace`、`Family-Space`、`World-Space`、`Self-Space`
- 本报告性质：**设计文档，不是迁移授权**。Issue #43 明确要求 "No copy until Commander review"。本报告不复制任何 Foundation 文件，不修改 `mingos-foundation`，不动 MingOS runtime/schema/kernel。

---

## 0. 一句话结论

Foundation 当前 main 的 448 个文件中，**只有 12 个仍拥有不可替代的当前权威**（宪章与原则本体、三个已接受的宪法级 ADR、机器可读权威清单、许可）。212 个只有历史出处价值，224 个属于已退役的治理机器、派生索引、脚手架或已被取代的移动事实。

判定依据不是"文件写得好不好"，而是两条硬证据：

1. **consumer-chain 检测**：六个活跃仓库里，**没有任何一处引用 Foundation 的文档级 ID**（MF-0004、MF-0003、PROJECT-MINGOS-0002、KERNEL-0001、RFC-0001、ADR-0029、AUTHORITY_MANIFEST、GOV-0114 全部 0 命中）。活跃仓库只以"角色"引用 Foundation——"原则 / 校准层"。
2. **接收方自指**：MingOS 自己的 `docs/END_STATE.md` 写着"Ming Foundation 是这些原则的规范性归宿"；`GOVERNANCE.md` 写着受 `mingos-foundation` 最高原则约束。仓库一旦退役，这些规范性引用必须有落点——这个落点就是 `MingOS/foundation/`，而不是把整仓搬过来。

因此对每个区域的最终建议是：

| 区域 | 建议 | 含义 |
|---|---|---|
| `foundation/` | **SHRINK** | 9 → 5 迁入，其余留档 |
| `projects/mingos/` | **SHRINK** | 7 → 2 迁入（MingOS 宪章中英） |
| `governance/` | **NONE** | 一个文件都不建立活跃权威；全量留档 |
| `standards/` | **NONE** | Draft/Proposed 的 Kernel/RFC/Profile 族不迁；留档 |
| `reference/` | **NONE** | 历史出处价值最高（history/、charter/），但均非当前权威；不迁 |
| `scripts/` `.github/` `architecture/` `docs/` `infrastructure/` `research/` | **NONE** | 仓库脚手架与已退役机器；不迁 |
| 根目录 | **SHRINK** | `LICENSE.md` 迁入；COMPASS / ROADMAP 留档；其余不迁 |
| **Foundation 仓库整体** | **SHRINK 至 0 个活跃权威 → ARCHIVE_READY** | 等 Commander 批准 Phase A 执行后再动 |

---

## 1. 审计方法与判定标准

### 1.1 唯一判定标准

> **今天它是否仍拥有不可替代的当前权威。**

不因为"写得很好""看起来很完整""删了可惜"而保留。

### 1.2 三个分类

| 分类 | 定义 | 处置 |
|---|---|---|
| `KEEP_CURRENT` | 今天仍是活的原则 / 边界 / 决策权威，且其他体系没有等价物覆盖 | 建议迁入 `MingOS/foundation/`（保持原状态，不提升） |
| `KEEP_PROVENANCE_ONLY` | 不再有当前权威，但对理解决策史 / 出处有价值 | 留在归档仓；不迁入；不做活跃引用 |
| `DROP_FROM_ACTIVE` | 已过时 / 已被取代 / 重复到连出处价值都不足以进入目标树 | 明确不迁；活跃系统不得再引用（归档仓 Git 历史仍然保留，不删除任何东西） |

**注意**：三个分类都不涉及删除。`mingos-foundation` 仓库整体按 Issue #43 Phase D 转为 archive/provenance；`DROP_FROM_ACTIVE` 只表示"不应进入活跃面、不应被当成当前规范"。

### 1.3 执行步骤

1. 全量文件清单（`git ls-files`，448 个）；
2. 提取每份文档的 YAML `status` 字段与体量，形成状态地图；
3. 逐区内容判读（宪章、原则、ADR、蓝图、Kernel、RFC、Profile、roadmap、registry、review 机器）；
4. 跨仓重叠检测：在 PRK / agent-workspace / Family-Space / World-Space / Self-Space 搜索关键语义词（`hard_invariant`、`adaptive_default`、`Charter of Life`、`生命宪章`、`understanding before advice`、`human agency`）；
5. consumer-chain 检测：在六个活跃仓 grep Foundation 仓库名与文档级 ID；
6. 逐文件分类（结果见附录 A–D）；
7. 生成最小目标树与不迁清单。

### 1.4 关键事实

- Foundation 状态地图：`Candidate` 4 份（生命宪章中/英、MingOS 宪章中/英）；`Proposed` RFC 5 份、Profile 4 份、ADR-0029；`Draft` KERNEL-0000–0005、蓝图、MF-0001/0002/0003/0005、MOS-0000、大部分 reference 导引；其余 185 个 governance 文档绝大多数是 `Accepted` 的**流程记录**（审计 / 评审 / 修复 / 模板 / 试点操作），少数 `Superseded`（ADR-0008）。
- 没有任何活跃仓引用 Foundation 的**文档级 ID**；只引用**仓库角色**（"生命宪章、最高原则、伦理边界"）。
- MingOS 的 `COMPASS.md` 已完整承载 `THREE_REPO_COMPASS_V1` 共享契约（三仓宪法图、三权威类、约束下行/证据上行、反漂移、共享契约变更协议）；`Family-Space/COMPASS.md` 同样继承（§3.1 "inherited from Foundation"）。**共享边界语义的操作层已被接收方覆盖**，不需要再复制第二份。
- MingOS `docs/FOUNDATION_DEPENDENCY.md` 已把 10 条规范依赖登记为下游采纳记录（life before system / understanding before advice / relationship before method / growth is not optimization / interpretations remain revisable / human agency cannot be delegated away / evidence-consent-correction-auditability / AI is replaceable / observation precedes advice / channels must not become incompatible sources of truth）。
- MingOS `docs/END_STATE.md`（"永远不变的底线" 8 条）与 `GOVERNANCE.md`（决策层级 + 人的最终权利）已表达 MingOS 层的操作约束。

---

## 2. 总体统计

| 分类 | 文件数 | 占比 |
|---|---|---|
| `KEEP_CURRENT` | **12** | 2.7% |
| `KEEP_PROVENANCE_ONLY` | **212** | 47.3% |
| `DROP_FROM_ACTIVE` | **224** | 50.0% |
| 合计 | **448** | 100% |

分类明细（区域 × 分类矩阵、以及逐文件路径）见文末附录 A–D。

---

## 3. KEEP_CURRENT —— 12 个文件，逐项理由与覆盖检查

判定每条时都做了"覆盖检查"：PRK / Agent Space（agent-workspace）/ Family-Space / Self-Space / World-Space / 当前 MingOS 里是否存在等价物。结论：**宪章与原则的"本体文本层"没有任何接收方覆盖**——接收方只有"角色引用"和"操作层摘要"，没有原文。这正是必须迁移的最小集合。

### 3.1 宪章栈（Layer 0 + MingOS 自我约束）

| # | 源路径（foundation） | 状态 | 建议目标路径 | 为什么仍不可替代 | 覆盖检查 |
|---|---|---|---|---|---|
| 1 | `foundation/charter/MF-0004-life-charter.md` | Candidate | `MingOS/foundation/charter/MF-0004-life-charter.md` | 生命宪章是 Foundation 存在的唯一理由（C01–C13 承诺 + 宪章测试 + 例外规则）。六个活跃仓里 `Charter of Life` 0 命中——它是"如何对待生命"的唯一最高文本。MingOS `END_STATE.md` 把它指为"规范性归宿"，退役后必须有落点。 | 无覆盖。Family-Space 只引用角色；MingOS `GOVERNANCE.md`/`END_STATE.md` 只有操作层摘要（8 条底线），不含 C01–C13 原文 |
| 2 | `foundation/charter/MF-0006-life-charter.zh-CN.md` | Candidate | `MingOS/foundation/charter/MF-0006-life-charter.zh-CN.md` | MF-0004 的配对中文本；ADR-0021 语言治理下二者是一对，拆开即丢一半权威。中文是运营与产品的主语言。 | 同上 |
| 3 | `projects/mingos/PROJECT-MINGOS-0002-mingos-charter.md` | Candidate | `MingOS/foundation/charter/PROJECT-MINGOS-0002-mingos-charter.md` | MingOS 自我约束（MC01–MC14 + 三条永久纪律 + 决策优先级）。它是唯一直接约束"本仓库自己"的宪章文本。 | 无覆盖。MingOS `AGENTS.md` 有硬约束清单，但没有 MC01–MC14 的承诺结构与"永久纪律" |
| 4 | `projects/mingos/PROJECT-MINGOS-0003-mingos-charter.zh-CN.md` | Candidate | `MingOS/foundation/charter/PROJECT-MINGOS-0003-mingos-charter.zh-CN.md` | PROJECT-MINGOS-0002 的配对中文本。 | 同上 |

### 3.2 原则与身份（Layer 0）

| # | 源路径 | 状态 | 建议目标路径 | 为什么仍不可替代 | 覆盖检查 |
|---|---|---|---|---|---|
| 5 | `foundation/principles/MF-0003-first-principles.md` | Draft | `MingOS/foundation/principles/MF-0003-first-principles.md` | P01–P12 是全部下游文档承认的最小原则清单（MingOS `FOUNDATION_DEPENDENCY.md` §3 的 10 条即其子集；Family-Space `COMPASS.md` 以北极为纲继承）。它是 90 行的压缩本，是"原则本体"最便宜、最完整的载体。 | `FOUNDATION_DEPENDENCY.md` 覆盖 10/12 条的操作表述，但没有原文（P08 同意连续性、P10 安全不支配、P11 能力优于依赖、P12 谦卑是系统要求 不在其中） |
| 6 | `foundation/charter/MF-0001-mission.md` | Draft | `MingOS/foundation/charter/MF-0001-mission.md` | Layer 0 使命声明；MF-0004 的 `depends_on` 引用它（依赖闭包）。合并后的 foundation 层需要有"这一层为什么存在"的表述，MingOS `END_STATE.md` 是产品/系统层表达、不是 foundation 层使命。 | 无等价物 |
| 7 | `foundation/charter/MF-0002-vision.md` | Draft | `MingOS/foundation/charter/MF-0002-vision.md` | Layer 0 愿景声明；同属 MF-0004 依赖闭包。 | 无等价物 |

> 判断说明（供 Commander 复核）：第 6、7 条是本次审计中**最容易被严格标准打掉的两条**（它们是身份文本、非边界规则）。保留理由为"依赖闭包 + Layer 0 完整性"；若 Commander 采用"只保留边界与原则"的最严标准，可把它们降为 `KEEP_PROVENANCE_ONLY`，影响很小（共 80 行）。

### 3.3 已接受的最小决策出处（"解释原则为什么存在"）

| # | 源路径 | 状态 | 建议目标路径 | 为什么仍不可替代 | 覆盖检查 |
|---|---|---|---|---|---|
| 8 | `governance/decisions/ADR-0001-ai-is-not-the-center.md` | Accepted | `MingOS/foundation/decisions/ADR-0001-ai-is-not-the-center.md` | 已接受决策：AI 是可替换组件、不是架构中心。MingOS `FOUNDATION_DEPENDENCY.md` §3 逐字采纳了这一条但未给出来源；保留原文保住溯源。 | 内容被采纳，出处无覆盖 |
| 9 | `governance/decisions/ADR-0002-observation-before-advice.md` | Accepted | `MingOS/foundation/decisions/ADR-0002-observation-before-advice.md` | 已接受决策：先观察后建议（含观察清单与参考回路）。MingOS `COMPASS.md` §3.2 有该 adaptive default，但没有"为什么"与观察结构。 | 内容被采纳，出处无覆盖 |
| 10 | `governance/decisions/ADR-0005-three-root-texts-and-boundaries.md` | Accepted | `MingOS/foundation/decisions/ADR-0005-three-root-texts-and-boundaries.md` | 已接受决策：三层根文本分离（生命宪章 → MingOS 宪章 → Kernel）与其变更阈值。不迁它，迁移后的宪章栈就失去"为什么分三层、谁不能改写谁"的权威解释。 | MingOS `COMPASS.md` §14 是另一张图（终局链路），不解释三层根文本分离 |

### 3.4 当前权威清单与许可

| # | 源路径 | 状态 | 建议目标路径 | 为什么仍不可替代 | 覆盖检查 |
|---|---|---|---|---|---|
| 11 | `governance/registries/AUTHORITY_MANIFEST.json` | Proposed operational registry | `MingOS/foundation/authority/AUTHORITY_MANIFEST.json` | 全部资产中**唯一机器可读**的权威清单：7 条 `hard_invariant`（含 trigger / forbidden upgrade / test expectation）+ 6 条 `adaptive_default` + 2 条 `product_owned_choice` + 语义兼容契约。MingOS `COMPASS.md` §3 只有举例式列表，没有逐条的触发条件与"禁止的升级"字段。它是把"什么不可牺牲"变成可校验事实的最小载体。 | 部分覆盖（COMPASS §3 的举例），粒度无覆盖 |
| 12 | `LICENSE.md` | — | `MingOS/foundation/LICENSE.md` | 迁移的宪章 / 原则文本携带许可义务：Foundation 文档为 **CC BY 4.0**、软件为 Apache 2.0。已核验：MingOS 仓库当前**没有根 LICENSE 文件**、`package.json` 也没有 license 字段（`git ls-files` 仅见 `website/FONT-LICENSE.txt`）。许可与归属必须随文本一起存在，否则迁移本身不合规。 | 无覆盖 |

> 关于 ADR-0029：`AUTHORITY_MANIFEST.json` 的 `governing_record` 指向 `ADR-0029-three-class-authority-model-and-canonical-bridge`（状态 Proposed）。ADR-0029 本身被判 `KEEP_PROVENANCE_ONLY`，理由：它的规范内容（三权威类 + 桥接规则 + 语义兼容契约）**已完整存在于接收方**（MingOS `COMPASS.md` §3/§15、Family-Space `COMPASS.md` §3），而它是"运营模型为什么变化"的组织史记录（CP2 冻结、Foundation 退出施工），不适合作为 foundation 层的常驻文本。**待 Commander 裁决的可选项**：把 ADR-0029 与 manifest 一起迁入（`foundation/decisions/`），使 manifest 的来源自洽。本报告默认不迁。

---

## 4. 分区域文件清单与分类

完整逐文件清单见 **附录 D（KEEP_CURRENT，12）**、**附录 B（KEEP_PROVENANCE_ONLY，212）**、**附录 C（DROP_FROM_ACTIVE，224）**。以下按区域给出结论与代表性路径。

### 4.1 `foundation/`（9 个文件）

| 路径 | 分类 | 理由 |
|---|---|---|
| `foundation/charter/MF-0001-mission.md` | KEEP_CURRENT | 见 §3.2 |
| `foundation/charter/MF-0002-vision.md` | KEEP_CURRENT | 见 §3.2 |
| `foundation/principles/MF-0003-first-principles.md` | KEEP_CURRENT | 见 §3.2 |
| `foundation/charter/MF-0004-life-charter.md` | KEEP_CURRENT | 见 §3.1 |
| `foundation/charter/MF-0006-life-charter.zh-CN.md` | KEEP_CURRENT | 见 §3.1 |
| `foundation/0000-architecture-blueprint.md` | KEEP_PROVENANCE_ONLY | Layer 0–5 架构蓝图 + 稳定核心/可替换组件 + 知识状态模型 + 参考回路。其"知识状态分离""稳定/可替换"已被 MingOS `COMPASS.md` §3.2/§5 与权威清单 AD-KNOWLEDGE-STATUS-SEPARATION 覆盖；蓝图整体描述的是一个**不再作为施工主线**的 Foundation 自建体系（ADR-0029 已宣布 Foundation 退回原则/校准层）。留档。 |
| `foundation/philosophy/MF-0005-mingos-core-thought-culture-philosophy.zh-CN.md` | KEEP_PROVENANCE_ONLY | 1768 行中文哲学/文化总纲（Draft，Layer 1）。内容厚重但无 consumer、无规范性引用；其规范内容由宪章与原则承载。**判断项**：若 Commander 认为 foundation 层需要一份文化/哲学文本可上调，见 §10。留档。 |
| `foundation/ethics/.gitkeep`、`foundation/philosophy/.gitkeep` | DROP_FROM_ACTIVE | 空占位；伦理内容实际在宪章（C01–C13）与原则（P01–P12）。 |

### 4.2 `projects/mingos/`（7 个文件）

| 路径 | 分类 | 理由 |
|---|---|---|
| `projects/mingos/PROJECT-MINGOS-0002-mingos-charter.md` | KEEP_CURRENT | 见 §3.1 |
| `projects/mingos/PROJECT-MINGOS-0003-mingos-charter.zh-CN.md` | KEEP_CURRENT | 见 §3.1 |
| `projects/mingos/PROJECT-MINGOS-0001-public-surfaces-and-authority-map.md` | DROP_FROM_ACTIVE | 状态 Accepted，但内容**已过时**：仍写 canonical public repository = `YuemingHub/Ming-Foundation`（旧路径）。它的存活原则（"公共界面不得成为隐藏的事实源"）已被 MingOS `docs/CROSS_REPOSITORY_COORDINATION.md` 与 COMPASS 反漂移规则覆盖；仓库表面地图本身被 Issue #43 合并方案取代。 |
| `projects/mingos/README.md` | DROP_FROM_ACTIVE | 已退役 projects 结构的索引。 |
| `projects/incubator/.gitkeep`、`projects/ming-education/.gitkeep`、`projects/ming-family/.gitkeep` | DROP_FROM_ACTIVE | 空占位；对应产品线从未建立，也不是当前权威。 |

### 4.3 `governance/`（185 个文件）

**结论：NONE —— 一个文件都不建立活跃权威。**

这一区是整个仓库的"治理官僚体系"：31 个 decisions（ADR + GOV-0109）、9 个 audits、43 个 reviews、24 个 validation、15 个 operations（CP2 / 受限提名）、13 个 remediation、4 个 evidence、3 个 workflows、1 个 status（GOV-0001 当前规范状态 495 行）、1 个 sources（GOV-0002 来源登记）、2 个 roadmap、35 个 templates、2 个 registries、3 个空 .gitkeep。

- **KEEP_CURRENT（3）**：`ADR-0001`、`ADR-0002`、`ADR-0005`（见 §3.3）+ `AUTHORITY_MANIFEST.json`（§3.4）。
- **KEEP_PROVENANCE_ONLY（140）**：全部历史记录类——audits / reviews / validation / operations / remediation / evidence / workflows / status / sources / roadmaps / ADR-0006–0029 / GOV-0109。其中价值最高的两块：`GOV-0114`（三仓现实重基座漂移审计，ADR-0029 的证据来源）与 `GOV-0115`（当前 Family-Space 重新审计），以及 `GOV-0002-source-registry.md`（来源登记）。它们解释"为什么是今天这个模型"，但**没有当前权威、也没有消费者**。
- **DROP_FROM_ACTIVE（41）**：`ADR-0003`（mingos.cn 为官网）、`ADR-0004`（mingos-foundation 为 canonical 仓，**已被合并方案取代**）、35 个 `GOV-TPL-*` 表单模板（只服务于已退役的评审机器）、`DOCUMENT_ID_RESERVATIONS.json`（已退役编号保留系统）、`DAY7_REMEDIATION_BACKLOG.json`、空 .gitkeep。
- **特别说明**：CP2 / 受限提名（Day 16–18）资产按 ADR-0029 D5 是"retained, inactive"的历史基础设施。它们的正确位置是归档仓（本报告全部归入 PROVENANCE_ONLY），**不迁入 MingOS**，也不复活任何流程。

### 4.4 `standards/`（75 个文件）

**结论：NONE —— 全部不迁。**

| 子区 | 数量 | 分类 | 理由 |
|---|---|---|---|
| `standards/kernel/KERNEL-0000`–`0005` + `README.md` | 7 | KEEP_PROVENANCE_ONLY | Kernel 规范族全部 Draft，ADR-0026 Proposed，`claim: NoCurrentKernelConformanceClaim`。它描述的是 Foundation 侧的 Kernel 对象/状态机族，**没有实现、没有 consumer**；MingOS 已按 reuse-before-build 建了自己的最小内核（`packages/kernel` + `schemas/*` + `docs/protocols/*`）。迁入会制造第二套内核权威 → 冻结期明确不迁。若未来出现跨空间真实缺口，可从归档仓按新证据重审。 |
| `standards/rfc/RFC-0001`–`0005` | 5 | KEEP_PROVENANCE_ONLY | Proposed 候选边界规范（主体/发言/可争辩性；同意与数据权生命周期；安全升级/移交/申诉/事故；案件与跨家庭证据治理；公共主张与宪章同步）。这是**质量最高的一批候选文本**，但仍是 Proposed、无 review 收尾、无实现。不迁；登记为未来按证据重审的第一候选。 |
| `standards/profiles/PROF-0001`–`0004` + `RESIDUAL_PROFILE_REGISTRY.json` + `archive/*.txt`（4） | 9 | KEEP_PROVENANCE_ONLY | Proposed 画像（参与/代表决策、代表权威证据、保留与备份完成、服务响应与资源新鲜度）。同上。 |
| `standards/mos/MOS-0000-standard-process.md` | 1 | KEEP_PROVENANCE_ONLY | 标准流程（Draft）。定义"标准如何产生"——该流程体系已随仓库退役；留档解释状态词汇。 |
| `standards/review/*.json`（45） | 45 | DROP_FROM_ACTIVE | 评审/试点机器数据（CP2、点名问责、Profile 评审、合成试点等）。只服务于已退役流程；派生数据，出处价值低。 |
| `standards/requirements/*.json`（5） | 5 | DROP_FROM_ACTIVE | RFC 需求与验收测试的机器索引（115 条）。`ADR-0010` 明确"机器可读需求是派生索引"；母文档不迁，索引无独立权威。 |
| `standards/conformance/FOUNDATION_CONFORMANCE_BASELINE.json` | 1 | DROP_FROM_ACTIVE | 非实现一致性基线，结果集**故意为空**，且引用旧仓名。 |
| `standards/protocols/.gitkeep`、`standards/rfc/.gitkeep` | 2 | DROP_FROM_ACTIVE | 空占位。 |

### 4.5 `reference/`（113 个文件）

**结论：NONE —— 全部不迁；其中 `reference/history/` 与 `reference/charter/` 是出处价值最高的历史块。**

| 子区 | 数量 | 分类 | 理由 |
|---|---|---|---|
| `reference/history/REF-0010`–`REF-0014` + `mingos-historical-concept-map.json` | 6 | KEEP_PROVENANCE_ONLY | 历史原则术语源汇编、原则交叉表、术语状态矩阵、来源-隐私登记、方法-内核边界图（中文，Draft）。**纯历史出处**——它的名字就是历史。 |
| `reference/charter/*`（REF-0015–0018、REF-0021–0025 + 2 个双语映射 JSON） | 11 | KEEP_PROVENANCE_ONLY | 宪章的文章级双语映射、规范力矩阵、歧义登记、评审协议。它们是宪章评审机器的产物；宪章原文迁移后，这些评审附录不需要跟着走（宪章自身已声明状态与验证要求）。 |
| `reference/kernel/*`（REF-0026–0051，26 个 md + 5 个 JSON） | 31 | KEEP_PROVENANCE_ONLY | Kernel 族的交叉表、歧义登记、测试目录等 Draft 派生文档。母族不迁，派生不迁。 |
| `reference/REF-0001`、`REF-0003`–`REF-0009`、`REF-0019`、`REF-0020`、`REF-0035` | 11 | DROP_FROM_ACTIVE | 评审/试点流程导引（RFC 评审、Profile 修订、CP2 准备等）。流程机器的操作手册。 |
| `reference/REF-0052-adoption-bridge-and-authority-guide.md` | 1 | KEEP_PROVENANCE_ONLY | **Adoption Bridge 导引**。Issue #43 与 Foundation README 均声明 Adoption Bridge（Foundation Issue #14 / PR #22）已关闭，仅存出处。不复活、不迁入。 |
| `reference/glossary/core-terms.md` | 1 | KEEP_PROVENANCE_ONLY | 核心术语表（Draft，96 行）。MingOS 已有自己的词汇体系（COMPASS/协议），不复制。 |
| `reference/schemas/*.json`（52） | 52 | DROP_FROM_ACTIVE | 评审/试点机器的 JSON Schema。无母流程即无消费者。 |
| `reference/examples/*.json`（2）、`reference/diagrams/.gitkeep`、`reference/ontology/.gitkeep`、`reference/examples/.gitkeep` | 4 | DROP_FROM_ACTIVE | 示例与空占位。 |

### 4.6 根目录与其它区（13 + 6 + 1 + 4 + 5 + 5 + 25 = 59 个文件）

| 路径 / 区 | 分类 | 理由 |
|---|---|---|
| `LICENSE.md` | **KEEP_CURRENT** | 见 §3.4（许可义务随文本迁移） |
| `COMPASS.md` | KEEP_PROVENANCE_ONLY | 共享契约 `THREE_REPO_COMPASS_V1` 的 Foundation 侧副本。**接收方已有等价且更贴合角色的版本**（MingOS `COMPASS.md`），复制会造成双份契约；其独有的 §9（本仓该维护什么）与 §11（运营姿态）属组织史。留档。 |
| `ROADMAP.md` | KEEP_PROVENANCE_ONLY | 含"证据导向演化"模型说明（与 ADR-0029 重复）+ 被声明为 superseded 的历史阶段计划。旧路线图按 Issue #43 明确不迁。 |
| `README.md`、`AGENTS.md`、`CHANGELOG.md`、`REPOSITORY_INDEX.md`、`VERSION.md`、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`.editorconfig`、`.gitattributes`、`.gitignore` | DROP_FROM_ACTIVE | 已退役仓库的门面、索引、版本号、贡献流程与脚手架；内容或已过时（README 顶部自带"吸收中"横幅）、或被 MingOS 自身约定取代。 |
| `.github/*`（6） | DROP_FROM_ACTIVE | 旧仓 CI / CODEOWNERS / issue 模板 / PR 模板。 |
| `architecture/system-map.mmd` | DROP_FROM_ACTIVE | Layer 0–5 与渠道-核心关系图，配套已退役蓝图。 |
| `docs/DAY1-COMMIT.md`、`docs/templates/*`（3） | DROP_FROM_ACTIVE | 建仓指南与模板。 |
| `infrastructure/*`（5）、`research/*`（5） | DROP_FROM_ACTIVE | 全部为空 .gitkeep 的规划目录。 |
| `scripts/*`（25） | DROP_FROM_ACTIVE | 治理机器验证脚本（validate_kernel_family、validate_cp2_preauthorization、validate_authority_manifest 等）。它们校验的是不迁移的文档族；**若 Commander 决定迁移 AUTHORITY_MANIFEST.json，注意其校验脚本 `validate_authority_manifest.py` 不随之迁移**（MingOS 若要校验，应作为新工作单独评估，本报告不建议在冻结期新增）。 |

---

## 5. 重复性对照结论（PRK / Agent Space / Family-Space / Self-Space / World-Space / 当前 MingOS）

| 体系 | 与 Foundation 的重叠检测结果 | 结论 |
|---|---|---|
| **PRK**（Personal-Reality-Kernel） | `hard_invariant`/`adaptive_default`/`Charter of Life`/`human agency`/`生命宪章` 全部 **0 命中**；其 `REAL_LIFE_CONTINUITY_MISSION.md` 明确把 mingos-foundation 列在"Do not touch"清单。 | **无重叠**。PRK 是独立的真实生命连续性任务线，不覆盖也不依赖 Foundation 的规范文本。 |
| **Agent Space**（agent-workspace） | 只有**角色引用**：`00_索引/产品线地图.md`（"原则 / 校准"层）、`00_索引/全网可借索引.md`（"基座：生命宪章、伦理边界、治理框架"）、`项目总纲.md`、`REPO_REDUCTION_PASS_2.md`（明确 "ABSORB → MingOS/foundation, then ARCHIVE_READY"）。无文档级 ID 引用。 | **覆盖"角色与分工"，不覆盖宪章文本**。它的 `REPO_REDUCTION_PASS_2` §2 正是本任务的收割纪律来源。 |
| **Family-Space** | `COMPASS.md` §3.1 明确 `hard_invariant — inherited from Foundation`、§3.2 `adaptive_default — inherited from MingOS`；`README.md`、`space-manifest.json`（`foundation_repository` 字段）、`CURRENT_RUNBOOK.md` 以角色引用。`Charter of Life` 0 命中。 | **产品侧已继承边界语义，但不拥有定义权**（其 COMPASS 自述）。迁移后 Family-Space 的引用指向需要更新（见 §8）。 |
| **Self-Space / World-Space** | Self-Space：`CURRENT_STATE.md:250`、`docs/r0/R0_PRODUCT_CONTRACT.md:213` 角色引用（"principle/calibration layer"）；World-Space：0 命中。 | **角色引用，无文本依赖**。 |
| **当前 MingOS** | `COMPASS.md` §2/§3/§10/§15（三仓图、三权威类、反漂移、共享契约）、`GOVERNANCE.md`（决策层级 + 人的最终权利）、`docs/FOUNDATION_DEPENDENCY.md`（10 条规范依赖 + 状态区分规则）、`docs/END_STATE.md`（8 条底线 + "规范性归宿"声明）、`docs/CROSS_REPOSITORY_COORDINATION.md`、`docs/decisions/ADR-0001/0002`、`schemas/*`、`docs/protocols/*`。 | **操作层已被 MingOS 覆盖；本体文本层无覆盖** → 这就是 12 个 KEEP_CURRENT 的存在理由，也是唯一需要迁移的东西。 |

---

## 6. 推荐的最小 `MingOS/foundation/` 目标树

```text
MingOS/foundation/
├── README.md                                    # 新增（非迁移）：本层是什么、来源与状态保持规则、指向归档仓
├── LICENSE.md                                   # ← LICENSE.md（CC BY 4.0 文档许可 + 归属）
├── charter/
│   ├── MF-0001-mission.md                       # ← foundation/charter/MF-0001-mission.md (Draft)
│   ├── MF-0002-vision.md                        # ← foundation/charter/MF-0002-vision.md (Draft)
│   ├── MF-0003-first-principles.md              # ← foundation/principles/MF-0003-first-principles.md (Draft)
│   ├── MF-0004-life-charter.md                  # ← foundation/charter/MF-0004-life-charter.md (Candidate)
│   ├── MF-0006-life-charter.zh-CN.md            # ← foundation/charter/MF-0006-life-charter.zh-CN.md (Candidate)
│   ├── PROJECT-MINGOS-0002-mingos-charter.md    # ← projects/mingos/PROJECT-MINGOS-0002-...md (Candidate)
│   └── PROJECT-MINGOS-0003-mingos-charter.zh-CN.md  # ← projects/mingos/PROJECT-MINGOS-0003-...md (Candidate)
├── decisions/
│   ├── ADR-0001-ai-is-not-the-center.md         # ← governance/decisions/ADR-0001-...md (Accepted)
│   ├── ADR-0002-observation-before-advice.md    # ← governance/decisions/ADR-0002-...md (Accepted)
│   └── ADR-0005-three-root-texts-and-boundaries.md  # ← governance/decisions/ADR-0005-...md (Accepted)
└── authority/
    └── AUTHORITY_MANIFEST.json                  # ← governance/registries/AUTHORITY_MANIFEST.json (Proposed, 原样)
```

- 共 **13 个文件**（12 个迁移 + 1 个新增 README），约 2,400 行。
- 文件名与文档 ID（MF-xxxx / PROJECT-MINGOS-xxxx / ADR-xxxx）**原样保留**，便于溯源；不重编号。
- 所有迁移文档**保持原状态字段**（Candidate 仍是 Candidate，Draft 仍是 Draft）。迁移不是提升——这是 MingOS AGENTS.md 与 Foundation ADR-0006/0012/0015 的一贯规则。
- 建议 `foundation/README.md` 里写清三件事：①来源 commit（`fc40f98`）与迁移日期；②"这里的 Candidate/Draft 不因迁移获得新权威"；③完整历史仍在归档仓 `YuemingHub/mingos-foundation`。

---

## 7. 明确"不迁"的清单

**逐文件路径见附录 B（212）与附录 C（224）——两者合计 436 个文件，一个都不迁入 `MingOS/foundation/`。** 区别只在处置：

**不迁、留作历史出处（KEEP_PROVENANCE_ONLY，212 个）**，要点：

- `governance/` 全部历史记录（140 个）：audits、reviews、validation、operations（CP2/受限提名）、remediation、evidence、workflows、status、sources、roadmaps、ADR-0006–0029、GOV-0109；
- `standards/` 的 Kernel 族（7）、RFC（5）、Profile（9）、MOS（1）——Draft/Proposed 候选规范，按新证据才可重审；
- `reference/` 的 history（6）、charter 评审附录（11）、kernel 交叉表（26）、glossary（1）、REF-0035（1）、REF-0052 Adoption Bridge 导引（1）；
- `foundation/` 的蓝图（1）与哲学总纲（1）；
- 根目录 `COMPASS.md`、`ROADMAP.md`。

**不迁、且活跃系统不应再引用（DROP_FROM_ACTIVE，224 个）**，要点：

- 全部 35 个 `GOV-TPL-*` 表单模板；
- `standards/review/*.json`（45）、`standards/requirements/*.json`（5）、`reference/schemas/*.json`（52）——三套派生 JSON 机器（合计 102 个）；
- 全部 25 个 `scripts/` 验证脚本、全部 6 个 `.github/` 文件；
- 已过时 / 被取代的移动事实：`ADR-0003`、`ADR-0004`、`PROJECT-MINGOS-0001`、`README.md`、`VERSION.md`、`REPOSITORY_INDEX.md`、`CHANGELOG.md`、`COMPASS`/`ROADMAP` 之外的根文件；
- 空目录占位与脚手架：`infrastructure/*`、`research/*`、`foundation/{ethics,philosophy}/.gitkeep`、`docs/*`、`architecture/system-map.mmd`。

**特别点名（防止误复活）**：

1. **Adoption Bridge**（`reference/REF-0052`、ADR-0029 中引用的 Issue #14 / PR #22）——已关闭，仅存出处，不复活；
2. **CP2 / 受限提名与全部 Day 16–18 操作机器**——保留在归档仓，不迁入、不激活；ADR-0029 D5 的 "retained, inactive" 是它们的最终状态；
3. **KERNEL 族**——不迁入，避免出现"MingOS 第二套内核权威"。

---

## 8. 区域级 SHRINK / KEEP / NONE

| 区域 | 判定 | 依据（一句话） |
|---|---|---|
| `foundation/` | **SHRINK** | 5/9 迁入（宪章与原则），蓝图与哲学总纲留档，空占位丢弃 |
| `projects/` | **SHRINK** | 2/7 迁入（MingOS 宪章中英），其余留档/丢弃 |
| `governance/` | **NONE** | 只有 3 个 ADR + 1 个权威清单有当前权威；140 个历史记录留档、41 个机器/模板丢弃 |
| `standards/` | **NONE** | Kernel/RFC/Profile 全为 Draft/Proposed，无消费者；机器 JSON 丢弃 |
| `reference/` | **NONE** | 全部为评审/出处材料；history 与 charter 附录价值最高但非当前权威 |
| `scripts/` `.github/` `architecture/` `docs/` `infrastructure/` `research/` | **NONE** | 脚手架与已退役机器 |
| 根目录 | **SHRINK** | `LICENSE.md` 迁入；`COMPASS.md` `ROADMAP.md` 留档；其余丢弃 |
| **Foundation 仓库** | **SHRINK 至 0 个活跃权威 → ARCHIVE_READY** | 仓库级生命周期退役（README 横幅、ADR-0029、REPO_REDUCTION_PASS_2 均已如此声明） |

---

## 9. 迁移注意（供 Phase A 执行时使用；本报告不执行）

1. **状态保持**：4 份 Candidate、3 份 Draft、1 份 Proposed 的原始状态字段必须原样保留；不得在迁移说明里写成"已接受"。
2. **许可**：`LICENSE.md`（CC BY 4.0 / Apache 2.0）随文本迁移；MingOS 当前无根许可证（已核验），这是**迁移的前置合规项**。
3. **引用落点更新（下一阶段动作，本次只登记）**：迁移完成后，以下引用需要从"旧仓"改指向 `MingOS/foundation/`——MingOS：`docs/END_STATE.md`（"规范性归宿"）、`GOVERNANCE.md`、`README.md`、`docs/FOUNDATION_DEPENDENCY.md`、`docs/CROSS_REPOSITORY_COORDINATION.md`、`docs/architecture/REPOSITORY_RELATIONSHIP.md`；Family-Space：`COMPASS.md`、`README.md`、`space-manifest.json`、`CURRENT_RUNBOOK.md`；Self-Space：`CURRENT_STATE.md`、`docs/r0/R0_PRODUCT_CONTRACT.md`；agent-workspace：`00_索引/*`。
4. **不要复制共享契约**：MingOS `COMPASS.md` 已含 `THREE_REPO_COMPASS_V1`；不要第二次复制 Foundation 的 `COMPASS.md`。
5. **悬空引用**：`PROJECT-MINGOS-0000` 被多处 frontmatter 引用但仓内不存在（已核验：`projects/mingos/` 只有 0001/0002/0003 与 README）。迁移时不要伪造该文件；在迁移说明中如实登记。
6. **不要新开治理框架**：本报告不提议任何新 Gate/Router/Registry 流程；`AUTHORITY_MANIFEST.json` 的校验脚本不迁移、不新建。

---

## 10. UNKNOWN / 判断偏弱项 / Blockers

| 项 | 类型 | 说明 |
|---|---|---|
| `MF-0005`（1768 行哲学总纲） | 判断项 | 判为 PROVENANCE_ONLY。若 Commander 要求 foundation 层包含文化/哲学文本，可上调为 KEEP_CURRENT（它无 consumer、无规范引用，但内容与宪章高度互补）。 |
| `MF-0001` / `MF-0002`（使命/愿景） | 判断项 | 以"依赖闭包 + Layer 0 身份"保留；最严标准下可降为 PROVENANCE_ONLY（影响 80 行）。 |
| `ADR-0029` | 判断项 | 默认 PROVENANCE（其规范内容已被接收方承载）；备选：与 `AUTHORITY_MANIFEST.json` 一同迁入以使 manifest 来源自洽。 |
| `AUTHORITY_MANIFEST.json` 的长期校验 | UNKNOWN | 迁移后由谁校验、以何频率校验未定；本报告不建议在冻结期新增校验工作。 |
| governance 185 个文件的逐字全文审读 | UNKNOWN（方法边界） | 本审计按"状态 + 标题 + 抽样全文 + consumer-chain 证据 + 区域语义"分类；对被判 PROVENANCE 的文件未逐字通读。由于**文档级引用为 0**，逐字通读不会改变"不迁"的结论，但若 Commander 需要逐字确认，需第二轮抽检。 |
| Foundation 侧未决 Issue / PR | 未核验 | 按 README 横幅与 Issue #43 的声明，Issue #14 / PR #22 已关闭；本次未逐一核验 GitHub 上的全部 open 状态。 |
| `Family-Space/.worktrees/**` 中的 26+ 份 COMPASS 副本 | 范围外 | 属产品仓自身工作树事务，不在本次 Foundation 审计范围。 |

---

## 11. Handoff（给下一个 Agent）

- **如果下一步是 Phase A 执行**（复制 12 个文件到 `MingOS/foundation/`）：按 §6 目标树执行；先解决 §9.2 的许可前置项；复制后按 §9.3 更新引用落点；提交信息中记录来源 commit `fc40f98` 与状态保持声明。
- **如果 Commander 选择更小集合**：最小可行方案 = `MF-0004` + `MF-0006` + `PROJECT-MINGOS-0002` + `PROJECT-MINGOS-0003` + `MF-0003` + `AUTHORITY_MANIFEST.json` + `LICENSE.md`（7 个文件），其余按本报告降级。
- **本报告不构成迁移授权**：Issue #43 Phase A 要求 "No copy until Commander review"。

---

## 附录

- 附录 A：区域 × 分类矩阵（机器生成）
- 附录 B：KEEP_PROVENANCE_ONLY 完整路径清单（212 个）
- 附录 C：DROP_FROM_ACTIVE 完整路径清单（224 个）
- 附录 D：KEEP_CURRENT 完整路径清单（12 个）

---

## 附录 A：区域 × 分类矩阵

| 区域 | KEEP_CURRENT | PROVENANCE_ONLY | DROP_FROM_ACTIVE | 小计 |
|---|---|---|---|---|
| `(root)` | 1 | 2 | 10 | 13 |
| `.github/` | 0 | 0 | 6 | 6 |
| `architecture/` | 0 | 0 | 1 | 1 |
| `docs/` | 0 | 0 | 4 | 4 |
| `foundation/` | 5 | 2 | 2 | 9 |
| `governance/` | 4 | 140 | 41 | 185 |
| `infrastructure/` | 0 | 0 | 5 | 5 |
| `projects/` | 2 | 0 | 5 | 7 |
| `reference/` | 0 | 46 | 67 | 113 |
| `research/` | 0 | 0 | 5 | 5 |
| `scripts/` | 0 | 0 | 25 | 25 |
| `standards/` | 0 | 22 | 53 | 75 |
| **合计** | **12** | **212** | **224** | **448** |

---

## 附录 B：KEEP_PROVENANCE_ONLY 完整清单（212 个）

> 留作历史出处；不迁入 `MingOS/foundation/`；不做活跃引用。

```text
COMPASS.md
ROADMAP.md
foundation/0000-architecture-blueprint.md
foundation/philosophy/MF-0005-mingos-core-thought-culture-philosophy.zh-CN.md
governance/audits/GOV-0020-day7-direct-audit-and-backlog-record.md
governance/audits/GOV-0021-day7-audit-evidence-and-access-register.md
governance/audits/GOV-0022-day7-website-audit-matrix.md
governance/audits/GOV-0023-day7-family-os-audit-matrix.md
governance/audits/GOV-0024-day7-counterexample-readiness-matrix.md
governance/audits/GOV-0083-day16-concurrent-workstream-integration-audit.md
governance/audits/GOV-0093-day17-current-main-and-numbering-audit.md
governance/audits/GOV-0103-day18-current-main-and-numbering-audit.md
governance/audits/GOV-0114-three-repository-reality-rebase-drift-audit.md
governance/decisions/ADR-0006-retain-charters-at-candidate-after-day5.md
governance/decisions/ADR-0007-require-remediation-contracts-before-charter-acceptance.md
governance/decisions/ADR-0008-treat-day7-as-bounded-audit.md
governance/decisions/ADR-0009-canonical-repository-audit-scope.md
governance/decisions/ADR-0010-machine-readable-requirements-are-derived-indexes.md
governance/decisions/ADR-0011-separate-review-readiness-from-status-promotion.md
governance/decisions/ADR-0012-retain-rfcs-proposed-after-internal-review.md
governance/decisions/ADR-0013-r0-cross-rfc-revision-foundations.md
governance/decisions/ADR-0014-retain-r1-revised-rfcs-proposed.md
governance/decisions/ADR-0015-retain-rfcs-proposed-after-round2.md
governance/decisions/ADR-0016-adopt-current-requirement-baseline-and-proposed-profiles.md
governance/decisions/ADR-0017-canonical-text-integrity-across-platforms.md
governance/decisions/ADR-0018-retain-profiles-proposed-and-require-affected-person-review.md
governance/decisions/ADR-0019-adopt-revised-profile-sources-and-retain-proposed.md
governance/decisions/ADR-0020-separate-content-readiness-from-operational-authorization.md
governance/decisions/ADR-0021-canonical-language-and-translation-governance.md
governance/decisions/ADR-0022-separate-synthetic-rehearsal-from-human-review-activation.md
governance/decisions/ADR-0023-authorize-cp0-cp1-controlled-pilot-only.md
governance/decisions/ADR-0024-separate-public-accountability-from-restricted-identity.md
governance/decisions/ADR-0025-retain-cp2-cp3-blocked-until-named-accountability.md
governance/decisions/ADR-0026-define-mingos-kernel-specification-family.md
governance/decisions/ADR-0027-keep-restricted-nomination-records-outside-public-repository.md
governance/decisions/ADR-0028-record-conditional-cp2-preauthorization-without-activation.md
governance/decisions/ADR-0029-three-class-authority-model-and-canonical-bridge.md
governance/decisions/GOV-0109-cp2-conditional-preauthorization-decision.md
governance/evidence/GOV-0018-restricted-validation-evidence-handling.md
governance/evidence/GOV-0030-external-implementation-evidence-intake-protocol.md
governance/evidence/GOV-0069-affected-person-review-safeguards-and-evidence-boundary.md
governance/evidence/GOV-0089-synthetic-pilot-execution-record.md
governance/operations/GOV-0078-review-operational-activation-register.md
governance/operations/GOV-0084-review-operations-role-assignment-and-conflict-protocol.md
governance/operations/GOV-0085-review-protocol-approval-and-human-use-authorization-standard.md
governance/operations/GOV-0086-restricted-evidence-environment-control-specification.md
governance/operations/GOV-0087-controlled-pilot-classification-and-authorization-matrix.md
governance/operations/GOV-0094-named-accountability-and-public-identity-boundary.md
governance/operations/GOV-0095-small-team-accountability-and-separation-of-duties.md
governance/operations/GOV-0096-role-nomination-acceptance-and-verification-plan.md
governance/operations/GOV-0097-human-use-protocol-approval-readiness.md
governance/operations/GOV-0098-restricted-evidence-environment-deployment-plan.md
governance/operations/GOV-0104-restricted-nomination-workspace-and-confidentiality-boundary.md
governance/operations/GOV-0105-cp2-restricted-nomination-slot-plan.md
governance/operations/GOV-0106-restricted-nomination-intake-and-verification-protocol.md
governance/operations/GOV-0107-cp2-protocol-applicability-matrix.md
governance/operations/GOV-0108-cp2-minimum-evidence-environment-control-set.md
governance/remediation/GOV-0014-day6-remediation-and-external-review-preparation.md
governance/remediation/GOV-0015-charter-violation-reporting-and-remediation.md
governance/remediation/GOV-0019-day6-remediation-traceability-matrix.md
governance/remediation/GOV-0025-day7-remediation-implementation-backlog.md
governance/remediation/GOV-0031-foundation-remediation-architecture-plan.md
governance/remediation/GOV-0042-rfc-revision-plan.md
governance/remediation/GOV-0044-day11-r0-r1-source-revision-record.md
governance/remediation/GOV-0055-round2-residual-revision-and-review-plan.md
governance/remediation/GOV-0058-residual-profile-design-record.md
governance/remediation/GOV-0066-profile-revision-plan.md
governance/remediation/gov-0045-rfc-0001-draft-revision.md
governance/remediation/gov-0046-rfc-0002-draft-revision.md
governance/remediation/gov-0047-rfc-0003-draft-revision.md
governance/reviews/GOV-0004-day3-charter-consolidation-record.md
governance/reviews/GOV-0005-day4-charter-review-and-decision.md
governance/reviews/GOV-0013-day5-charter-status-recommendation.md
governance/reviews/GOV-0016-external-charter-review-protocol.md
governance/reviews/GOV-0017-affected-person-charter-review-instrument.md
governance/reviews/GOV-0026-day7-status-recommendation.md
governance/reviews/GOV-0027-day7-audit-scope-correction.md
governance/reviews/GOV-0034-rfc-ambiguity-and-revision-register.md
governance/reviews/GOV-0036-day10-internal-rfc-review-execution.md
governance/reviews/GOV-0037-rfc-0001-internal-review.md
governance/reviews/GOV-0038-rfc-0002-internal-review.md
governance/reviews/GOV-0039-rfc-0003-internal-review.md
governance/reviews/GOV-0040-rfc-0004-internal-review.md
governance/reviews/GOV-0041-rfc-0005-internal-review.md
governance/reviews/GOV-0043-rfc-dissent-and-unresolved-objections.md
governance/reviews/GOV-0048-r0-r1-ambiguity-source-disposition.md
governance/reviews/GOV-0049-day12-internal-architecture-review-round2.md
governance/reviews/GOV-0050-rfc-0001-round2.md
governance/reviews/GOV-0051-rfc-0002-round2.md
governance/reviews/GOV-0052-rfc-0003-round2.md
governance/reviews/GOV-0053-round2-ambiguity-and-dissent-disposition.md
governance/reviews/GOV-0060-day13-status-recommendation.md
governance/reviews/GOV-0061-day14-profile-internal-review-round1.md
governance/reviews/GOV-0067-affected-person-review-preparation-plan.md
governance/reviews/GOV-0068-affected-person-review-instrument-pack.md
governance/reviews/GOV-0070-day14-status-recommendation.md
governance/reviews/GOV-0072-prof-0001-source-revision-round2.md
governance/reviews/GOV-0073-prof-0002-source-revision-round2.md
governance/reviews/GOV-0074-prof-0003-source-revision-round2.md
governance/reviews/GOV-0075-prof-0004-source-revision-round2.md
governance/reviews/GOV-0076-profile-internal-review-round2.md
governance/reviews/GOV-0077-affected-person-review-readiness-gate.md
governance/reviews/GOV-0079-day15-status-recommendation.md
governance/reviews/GOV-0090-day16-operational-readiness-and-pilot-authorization-gate.md
governance/reviews/GOV-0091-day16-status-recommendation.md
governance/reviews/GOV-0100-day17-human-review-activation-readiness-gate.md
governance/reviews/GOV-0101-day17-status-recommendation.md
governance/reviews/GOV-0110-day18-restricted-nomination-and-cp2-preauthorization-gate.md
governance/reviews/GOV-0111-day18-status-recommendation.md
governance/reviews/gov-0062-prof-0001-internal-review.md
governance/reviews/gov-0063-prof-0002-internal-review.md
governance/reviews/gov-0064-prof-0003-internal-review.md
governance/reviews/gov-0065-prof-0004-internal-review.md
governance/roadmap/ROADMAP-1.0.md
governance/roadmaps/GOV-0082-core-text-consolidation-and-iteration-roadmap.md
governance/sources/GOV-0002-source-registry.md
governance/status/GOV-0001-current-canonical-state.md
governance/validation/GOV-0006-charter-candidate-validation-plan.md
governance/validation/GOV-0007-day5-validation-evidence-summary.md
governance/validation/GOV-0008-website-and-public-claims-audit.md
governance/validation/GOV-0009-family-os-implementation-mapping.md
governance/validation/GOV-0010-privacy-and-third-party-rights-gap-analysis.md
governance/validation/GOV-0011-safety-and-professional-boundary-gap-analysis.md
governance/validation/GOV-0012-counterexample-and-risk-register.md
governance/validation/GOV-0028-day8-validation-infrastructure-record.md
governance/validation/GOV-0029-rfc-requirement-and-conformance-infrastructure.md
governance/validation/GOV-0032-day9-requirement-fidelity-review.md
governance/validation/GOV-0033-day9-rfc-review-preparation.md
governance/validation/GOV-0035-canonical-conformance-baseline.md
governance/validation/GOV-0054-repository-source-review-test-execution.md
governance/validation/GOV-0056-day13-current-requirement-rebaseline.md
governance/validation/GOV-0057-legacy-to-current-requirement-mapping.md
governance/validation/GOV-0059-rebaseline-and-profile-validation-record.md
governance/validation/GOV-0071-day15-profile-source-revision-record.md
governance/validation/GOV-0080-day15-validation-record.md
governance/validation/GOV-0088-synthetic-pilot-scenario-and-test-plan.md
governance/validation/GOV-0092-day16-validation-record.md
governance/validation/GOV-0099-cp2-readiness-and-accountability-tabletop.md
governance/validation/GOV-0102-day17-validation-record.md
governance/validation/GOV-0112-day18-validation-record.md
governance/validation/GOV-0115-current-family-space-re-audit.md
governance/workflows/GOV-0003-conversation-to-repository.md
governance/workflows/GOV-0081-core-document-lifecycle-and-iteration-workflow.md
governance/workflows/GOV-0113-parallel-workstream-integration-and-document-id-reservation.md
reference/REF-0035-restricted-nomination-and-cp2-preauthorization-guide.md
reference/REF-0052-adoption-bridge-and-authority-guide.md
reference/charter/REF-0015-life-charter-bilingual-article-map.md
reference/charter/REF-0016-life-charter-normative-force-matrix.md
reference/charter/REF-0017-life-charter-ambiguity-review-register.md
reference/charter/REF-0018-life-charter-affected-person-review-protocol.md
reference/charter/REF-0021-mingos-charter-bilingual-article-map.md
reference/charter/REF-0022-mingos-charter-normative-force-matrix.md
reference/charter/REF-0023-mingos-charter-commitment-contract-map.md
reference/charter/REF-0024-mingos-charter-ambiguity-review-register.md
reference/charter/REF-0025-mingos-charter-review-protocol.md
reference/charter/life-charter-bilingual-map.json
reference/charter/mingos-charter-bilingual-contract-map.json
reference/glossary/core-terms.md
reference/history/REF-0010-historical-principles-terminology-source-compendium.zh-CN.md
reference/history/REF-0011-historical-principle-crosswalk.zh-CN.md
reference/history/REF-0012-terminology-status-matrix.zh-CN.md
reference/history/REF-0013-source-provenance-privacy-register.zh-CN.md
reference/history/REF-0014-method-kernel-boundary-map.zh-CN.md
reference/history/mingos-historical-concept-map.json
reference/kernel/REF-0026-kernel-family-and-id-allocation-map.md
reference/kernel/REF-0027-kernel-normative-authority-precedence-matrix.md
reference/kernel/REF-0028-kernel-conformance-replaceability-claim-boundary.md
reference/kernel/REF-0029-kernel-role-representation-map.md
reference/kernel/REF-0030-kernel-decision-traceability-open-questions.md
reference/kernel/REF-0031-kernel-core-requirement-source-crosswalk.md
reference/kernel/REF-0032-kernel-core-ambiguity-register.md
reference/kernel/REF-0033-kernel-core-review-protocol.md
reference/kernel/REF-0034-kernel-core-vocabulary-status-map.md
reference/kernel/REF-0040-kernel-object-catalog-crosswalk.md
reference/kernel/REF-0041-kernel-lifecycle-transition-invariant-matrix.md
reference/kernel/REF-0042-kernel-access-privacy-retention-audit-matrix.md
reference/kernel/REF-0043-kernel-object-lifecycle-ambiguity-register.md
reference/kernel/REF-0044-round08-object-lifecycle-review-protocol.md
reference/kernel/REF-0045-kernel-conformance-claim-applicability-matrix.md
reference/kernel/REF-0046-kernel-evidence-assurance-class-matrix.md
reference/kernel/REF-0047-kernel-requirement-test-catalog-crosswalk.md
reference/kernel/REF-0048-kernel-exception-suspension-expiry-revocation-matrix.md
reference/kernel/REF-0049-kernel-implementation-assessment-protocol.md
reference/kernel/REF-0050-kernel-conformance-test-ambiguity-register.md
reference/kernel/REF-0051-kernel-public-claim-mark-language-matrix.md
reference/kernel/mingos-kernel-conformance-model.json
reference/kernel/mingos-kernel-core-requirements.json
reference/kernel/mingos-kernel-object-lifecycle-model.json
reference/kernel/mingos-kernel-scope-authority-map.json
reference/kernel/mingos-kernel-test-specifications.json
standards/kernel/KERNEL-0000-specification-family-index.md
standards/kernel/KERNEL-0001-core-operational-contract.md
standards/kernel/KERNEL-0002-canonical-object-data-model.md
standards/kernel/KERNEL-0003-lifecycle-state-machines.md
standards/kernel/KERNEL-0004-conformance-requirements-evidence-model.md
standards/kernel/KERNEL-0005-test-specifications-derived-indexes.md
standards/kernel/README.md
standards/mos/MOS-0000-standard-process.md
standards/profiles/PROF-0001-participation-and-representative-decision-profile.md
standards/profiles/PROF-0002-representative-authority-evidence-profile.md
standards/profiles/PROF-0003-retention-and-backup-completion-profile.md
standards/profiles/PROF-0004-service-response-and-resource-freshness-profile.md
standards/profiles/RESIDUAL_PROFILE_REGISTRY.json
standards/profiles/archive/prof-0001-v0.1.0.txt
standards/profiles/archive/prof-0002-v0.1.0.txt
standards/profiles/archive/prof-0003-v0.1.0.txt
standards/profiles/archive/prof-0004-v0.1.0.txt
standards/rfc/RFC-0001-subject-speaker-and-contestability.md
standards/rfc/RFC-0002-consent-and-data-rights-lifecycle.md
standards/rfc/RFC-0003-safety-escalation-handoff-appeal-and-incident.md
standards/rfc/RFC-0004-case-and-cross-family-evidence-governance.md
standards/rfc/RFC-0005-public-claim-charter-sync-and-capability-status.md
```

---

## 附录 C：DROP_FROM_ACTIVE 完整清单（224 个）

> 不迁入；活跃系统不应再引用；归档仓 Git 历史仍然保留（不删除任何东西）。

```text
.editorconfig
.gitattributes
.github/CODEOWNERS
.github/ISSUE_TEMPLATE/implementation.yml
.github/ISSUE_TEMPLATE/rfc.yml
.github/PULL_REQUEST_TEMPLATE.md
.github/workflows/repository-validation.yml
.github/workflows/validate.yml
.gitignore
AGENTS.md
CHANGELOG.md
CODE_OF_CONDUCT.md
CONTRIBUTING.md
README.md
REPOSITORY_INDEX.md
VERSION.md
architecture/system-map.mmd
docs/DAY1-COMMIT.md
docs/templates/adr-template.md
docs/templates/rfc-template.md
docs/templates/standard-template.md
foundation/ethics/.gitkeep
foundation/philosophy/.gitkeep
governance/decisions/ADR-0003-mingos-cn-is-the-official-website.md
governance/decisions/ADR-0004-ming-foundation-is-the-canonical-public-repository.md
governance/meetings/.gitkeep
governance/registries/DOCUMENT_ID_RESERVATIONS.json
governance/releases/.gitkeep
governance/remediation/backlog/DAY7_REMEDIATION_BACKLOG.json
governance/templates/GOV-TPL-0001-external-charter-review-response.md
governance/templates/GOV-TPL-0002-affected-person-review-record.md
governance/templates/GOV-TPL-0003-charter-validation-finding-record.md
governance/templates/GOV-TPL-0004-external-implementation-evidence-intake.md
governance/templates/GOV-TPL-0010-child-friendly-profile-review-guide.md
governance/templates/GOV-TPL-0011-adolescent-profile-review-guide.md
governance/templates/GOV-TPL-0012-parent-caregiver-representative-review-guide.md
governance/templates/GOV-TPL-0013-practitioner-domain-review-guide.md
governance/templates/GOV-TPL-0014-privacy-safety-review-guide.md
governance/templates/GOV-TPL-0015-accessibility-language-review-guide.md
governance/templates/GOV-TPL-0016-jurisdiction-professional-duty-review-guide.md
governance/templates/GOV-TPL-0017-affected-person-review-session-record.md
governance/templates/GOV-TPL-0018-role-acceptance-and-conflict-declaration.md
governance/templates/GOV-TPL-0019-human-use-protocol-approval-record.md
governance/templates/GOV-TPL-0020-evidence-environment-control-verification-record.md
governance/templates/GOV-TPL-0021-controlled-pilot-authorization-decision-record.md
governance/templates/GOV-TPL-0022-incident-disclosure-and-stop-event-record.md
governance/templates/GOV-TPL-0023-role-nomination-record.md
governance/templates/GOV-TPL-0024-role-acceptance-qualification-conflict-record.md
governance/templates/GOV-TPL-0025-separation-of-duties-exception-record.md
governance/templates/GOV-TPL-0026-human-use-protocol-signoff.md
governance/templates/GOV-TPL-0027-evidence-environment-deployment-verification.md
governance/templates/GOV-TPL-0028-human-review-activation-decision.md
governance/templates/GOV-TPL-0029-restricted-nomination-slot-record.md
governance/templates/GOV-TPL-0030-restricted-accountability-index.md
governance/templates/GOV-TPL-0031-qualification-conflict-and-independence-decision.md
governance/templates/GOV-TPL-0032-cp2-protocol-applicability-signoff.md
governance/templates/GOV-TPL-0033-cp2-environment-control-verification.md
governance/templates/GOV-TPL-0034-cp2-conditional-preauthorization-record.md
governance/templates/GOV-TPL-0035-cp2-effective-activation-decision.md
governance/templates/gov-tpl-0005-rfc-0001-review-checklist.md
governance/templates/gov-tpl-0006-rfc-0002-review-checklist.md
governance/templates/gov-tpl-0007-rfc-0003-review-checklist.md
governance/templates/gov-tpl-0008-rfc-0004-review-checklist.md
governance/templates/gov-tpl-0009-rfc-0005-review-checklist.md
infrastructure/api/.gitkeep
infrastructure/core/.gitkeep
infrastructure/kernel/.gitkeep
infrastructure/runtime/.gitkeep
infrastructure/sdk/.gitkeep
projects/incubator/.gitkeep
projects/ming-education/.gitkeep
projects/ming-family/.gitkeep
projects/mingos/PROJECT-MINGOS-0001-public-surfaces-and-authority-map.md
projects/mingos/README.md
reference/REF-0001-rfc-requirement-registry-guide.md
reference/REF-0003-rfc-review-and-conformance-baseline-guide.md
reference/REF-0004-rfc-revision-planning-guide.md
reference/REF-0005-r0-r1-revision-foundations-guide.md
reference/REF-0006-round2-review-and-rebaseline-guide.md
reference/REF-0007-requirement-identity-and-profile-guide.md
reference/REF-0008-profile-review-and-affected-person-preparation-guide.md
reference/REF-0009-profile-revision-and-review-readiness-guide.md
reference/REF-0019-review-operations-and-controlled-pilot-guide.md
reference/REF-0020-named-accountability-and-human-activation-guide.md
reference/diagrams/.gitkeep
reference/examples/.gitkeep
reference/examples/conformance-matrix.example.json
reference/examples/external-implementation-evidence.example.json
reference/ontology/.gitkeep
reference/schemas/affected-person-review-instruments.schema.json
reference/schemas/affected-person-review-plan.schema.json
reference/schemas/affected-person-review-readiness-gate.schema.json
reference/schemas/affected-person-review-safeguards.schema.json
reference/schemas/conformance-matrix.schema.json
reference/schemas/controlled-pilot-authorization.schema.json
reference/schemas/cp2-minimum-environment-control-set.schema.json
reference/schemas/cp2-nomination-slot-plan.schema.json
reference/schemas/cp2-preauthorization-decision.schema.json
reference/schemas/cp2-preauthorization-tabletop-results.schema.json
reference/schemas/cp2-preauthorization-tabletop-scenarios.schema.json
reference/schemas/cp2-protocol-applicability-matrix.schema.json
reference/schemas/cp2-staff-rehearsal-readiness.schema.json
reference/schemas/day16-operational-readiness-gate.schema.json
reference/schemas/day17-human-activation-readiness-gate.schema.json
reference/schemas/day18-cp2-preauthorization-gate.schema.json
reference/schemas/document-id-reservations.schema.json
reference/schemas/evidence-environment-deployment-plan.schema.json
reference/schemas/external-implementation-evidence.schema.json
reference/schemas/human-use-protocol-approval-plan.schema.json
reference/schemas/named-accountability-public-register.schema.json
reference/schemas/named-accountability-tabletop-results.schema.json
reference/schemas/named-accountability-tabletop-scenarios.schema.json
reference/schemas/profile-internal-review-results.schema.json
reference/schemas/profile-internal-review-round2-results.schema.json
reference/schemas/profile-revision-plan.schema.json
reference/schemas/profile-source-revision-evidence.schema.json
reference/schemas/profile-source-revision-test-results.schema.json
reference/schemas/profile-source-revision-tests.schema.json
reference/schemas/residual-profile-registry.schema.json
reference/schemas/restricted-accountability-register.schema.json
reference/schemas/restricted-evidence-environment.schema.json
reference/schemas/restricted-nomination-workspace-manifest.schema.json
reference/schemas/review-operational-activation.schema.json
reference/schemas/review-protocol-approval-registry.schema.json
reference/schemas/review-role-assignment-registry.schema.json
reference/schemas/rfc-acceptance-test-registry.schema.json
reference/schemas/rfc-ambiguity-register.schema.json
reference/schemas/rfc-dissent-register.schema.json
reference/schemas/rfc-internal-review-results.schema.json
reference/schemas/rfc-requirement-id-map.schema.json
reference/schemas/rfc-requirement-registry.schema.json
reference/schemas/rfc-review-checklist-registry.schema.json
reference/schemas/rfc-revision-plan.schema.json
reference/schemas/rfc-round2-ambiguity-dispositions.schema.json
reference/schemas/rfc-round2-review-results.schema.json
reference/schemas/rfc-source-review-test-results.schema.json
reference/schemas/rfc-source-review-tests.schema.json
reference/schemas/role-nomination-and-acceptance-plan.schema.json
reference/schemas/small-team-accountability-topology.schema.json
reference/schemas/synthetic-pilot-results.schema.json
reference/schemas/synthetic-pilot-scenarios.schema.json
research/education/.gitkeep
research/neuroscience/.gitkeep
research/philosophy/.gitkeep
research/psychology/.gitkeep
research/systems/.gitkeep
scripts/init_restricted_nomination_workspace.py
scripts/validate_all.py
scripts/validate_audit_scope.py
scripts/validate_authority_manifest.py
scripts/validate_controlled_pilot.py
scripts/validate_cp2_preauthorization.py
scripts/validate_human_activation_readiness.py
scripts/validate_id_reservations.py
scripts/validate_kernel_family.py
scripts/validate_named_accountability.py
scripts/validate_profile_review_preparation.py
scripts/validate_profile_source_revision.py
scripts/validate_release_state.py
scripts/validate_repository.py
scripts/validate_requirement_rebaseline.py
scripts/validate_requirements.py
scripts/validate_restricted_nomination_infrastructure.py
scripts/validate_review_baseline.py
scripts/validate_review_execution.py
scripts/validate_review_operations_activation.py
scripts/validate_review_readiness_gate.py
scripts/validate_round2_review.py
scripts/validate_source_revision.py
scripts/validate_text_integrity.py
scripts/validation_utils.py
standards/conformance/FOUNDATION_CONFORMANCE_BASELINE.json
standards/protocols/.gitkeep
standards/requirements/RFC_ACCEPTANCE_TESTS.json
standards/requirements/RFC_REQUIREMENTS.json
standards/requirements/RFC_REQUIREMENT_ID_MAP.json
standards/requirements/archive/RFC_ACCEPTANCE_TESTS_DAY12_LEGACY.json
standards/requirements/archive/RFC_REQUIREMENTS_DAY12_LEGACY.json
standards/review/AFFECTED_PERSON_REVIEW_INSTRUMENTS.json
standards/review/AFFECTED_PERSON_REVIEW_PLAN.json
standards/review/AFFECTED_PERSON_REVIEW_READINESS_GATE.json
standards/review/AFFECTED_PERSON_REVIEW_SAFEGUARDS.json
standards/review/CONTROLLED_PILOT_AUTHORIZATION.json
standards/review/CP2_MINIMUM_ENVIRONMENT_CONTROL_SET.json
standards/review/CP2_NOMINATION_SLOT_PLAN.json
standards/review/CP2_PREAUTHORIZATION_DECISION.json
standards/review/CP2_PREAUTHORIZATION_TABLETOP_RESULTS.json
standards/review/CP2_PREAUTHORIZATION_TABLETOP_SCENARIOS.json
standards/review/CP2_PROTOCOL_APPLICABILITY_MATRIX.json
standards/review/CP2_STAFF_REHEARSAL_READINESS.json
standards/review/DAY16_OPERATIONAL_READINESS_GATE.json
standards/review/DAY17_HUMAN_ACTIVATION_READINESS_GATE.json
standards/review/DAY18_CP2_PREAUTHORIZATION_GATE.json
standards/review/EVIDENCE_ENVIRONMENT_DEPLOYMENT_PLAN.json
standards/review/HUMAN_USE_PROTOCOL_APPROVAL_PLAN.json
standards/review/NAMED_ACCOUNTABILITY_PUBLIC_REGISTER.json
standards/review/NAMED_ACCOUNTABILITY_TABLETOP_RESULTS.json
standards/review/NAMED_ACCOUNTABILITY_TABLETOP_SCENARIOS.json
standards/review/PROFILE_INTERNAL_REVIEW_RESULTS.json
standards/review/PROFILE_INTERNAL_REVIEW_ROUND2_RESULTS.json
standards/review/PROFILE_REVISION_PLAN.json
standards/review/PROFILE_SOURCE_REVISION_EVIDENCE.json
standards/review/PROFILE_SOURCE_REVISION_TESTS.json
standards/review/PROFILE_SOURCE_REVISION_TEST_RESULTS.json
standards/review/RESTRICTED_EVIDENCE_ENVIRONMENT.json
standards/review/RESTRICTED_NOMINATION_WORKSPACE_MANIFEST.json
standards/review/REVIEW_OPERATIONAL_ACTIVATION.json
standards/review/REVIEW_PROTOCOL_APPROVAL_REGISTRY.json
standards/review/REVIEW_ROLE_ASSIGNMENT_REGISTRY.json
standards/review/RFC_AMBIGUITIES.json
standards/review/RFC_DISSENT_REGISTER.json
standards/review/RFC_INTERNAL_REVIEW_RESULTS.json
standards/review/RFC_INTERNAL_REVIEW_ROUND2_RESULTS.json
standards/review/RFC_R2_RESIDUAL_PLAN.json
standards/review/RFC_REVIEW_CHECKLISTS.json
standards/review/RFC_REVISION_PLAN.json
standards/review/RFC_ROUND2_AMBIGUITY_DISPOSITIONS.json
standards/review/RFC_SOURCE_REVIEW_TESTS.json
standards/review/RFC_SOURCE_REVIEW_TEST_RESULTS.json
standards/review/ROLE_NOMINATION_AND_ACCEPTANCE_PLAN.json
standards/review/SMALL_TEAM_ACCOUNTABILITY_TOPOLOGY.json
standards/review/SYNTHETIC_PILOT_RESULTS.json
standards/review/SYNTHETIC_PILOT_SCENARIOS.json
standards/rfc/.gitkeep
```

---

## 附录 D：KEEP_CURRENT 完整清单（12 个）

```text
LICENSE.md
foundation/charter/MF-0001-mission.md
foundation/charter/MF-0002-vision.md
foundation/charter/MF-0004-life-charter.md
foundation/charter/MF-0006-life-charter.zh-CN.md
foundation/principles/MF-0003-first-principles.md
governance/decisions/ADR-0001-ai-is-not-the-center.md
governance/decisions/ADR-0002-observation-before-advice.md
governance/decisions/ADR-0005-three-root-texts-and-boundaries.md
governance/registries/AUTHORITY_MANIFEST.json
projects/mingos/PROJECT-MINGOS-0002-mingos-charter.md
projects/mingos/PROJECT-MINGOS-0003-mingos-charter.zh-CN.md
```

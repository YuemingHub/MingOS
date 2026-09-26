# Foundation · 存活的原则 / 校准层

> 来源仓库：`YuemingHub/mingos-foundation`
> 来源 commit：`fc40f9839118ca5938e506069d7af65b5c7b6edb`（`main`，2026-09-25 观测）
> 迁入日期：2026-09-26
> 迁入授权：`YuemingHub/MingOS` Issue #43 · Phase B（Commander FINAL HARVEST SET）

本目录是从 Foundation 仓收割进来的**存活原则文本**，共 6 个源文件。
这是一次**最小迁移**：只搬文本，不搬体系。

## 1. 这个目录是什么

它**只是原则 / 校准层**（principle / calibration layer），供人和其他 Agent 阅读、校准判断。

它**不是**：

- **不是 runtime。** 这里没有任何可执行代码、Schema、Validator、CLI 或服务；本目录不被 MingOS 运行时 import、依赖或加载。
- **不是 governance engine。** 这里没有治理机器：没有评审流程、没有状态机、没有自动化门禁、没有 conformance 判定。
- **不是项目的总真源。** 这里不定义任何产品的当前状态、进度、部署事实或待办。

本次**没有**迁入任何 Foundation 的 workflow、ADR、RFC、Kernel、conformance、registry、review infrastructure 或 scripts。
Foundation 的治理机器没有被搬过来，也不应该被搬过来。

## 2. 文本状态：保持原样，没有被提升

以下 5 份规范 / 候选文本**逐字节保留源状态**，迁移**不构成任何状态提升**：

| 文件 | 源 ID | 状态 | 版本 |
|---|---|---|---|
| `charter/MF-0004-life-charter.md` | MF-0004 | **Candidate** | 1.0.0-alpha.5 |
| `charter/MF-0006-life-charter.zh-CN.md` | MF-0006 | **Candidate**（draft-translation） | 1.0.0-alpha.6 |
| `principles/MF-0003-first-principles.md` | MF-0003 | **Draft** | 1.0.0-alpha.1 |
| `charter/PROJECT-MINGOS-0002-mingos-charter.md` | PROJECT-MINGOS-0002 | **Candidate** | 1.0.0-alpha.5 |
| `charter/PROJECT-MINGOS-0003-mingos-charter.zh-CN.md` | PROJECT-MINGOS-0003 | **Candidate**（draft-translation） | 1.0.0-alpha.5 |

必须说清楚的事实：

- **本目录中没有任何 Accepted 或 Stable 文本。**
- Candidate **不等于** Accepted；Draft **不等于** Stable。
- 文本落在本仓库，**不因位置改变而获得新权威**，也不因为被引用而变成规范。
- 文本内容**未被改写**。它们描述的是 2026-07 的原始主张，包括其中已与今日架构不同的部分；这些差异**故意保留**，并由本文件的 provenance 说明，而不是通过偷偷改写历史文本来抹平。

## 3. 这些文本可以被修正，也可以被现实推翻

这些文本是**可修正的主张**，不是不可违背的物理定律。

- **现实、证据和失败可以修正它们。** 当现实反复证明某条原则写错了、有害或不适用，它就应该被改掉。
- **受影响的人可以修正它们。** 被这些文本描述或约束的人，有权指出它不成立。
- 它们**不是**自动继承的 hard invariant。是否成为硬边界，需要**当前独立证据**支持，不能靠"它写在 Foundation 目录里"。

这些文本**不能覆盖**：

- **不能覆盖 PRK Personal Reality。** 个人现实、当下处境、人的实际感受优先。
- **不能覆盖 Project Repo 当前事实。** 产品当前在做什么、处于什么状态、部署了什么，以其**自己的仓库和事实源**为准。
- **不能覆盖人的主体性。** 人的理解、判断、拒绝、暂停、修正、撤回和最终决定权，高于这里任何一条文本。

## 4. 许可来源

`LICENSE.md` 是从源仓原样迁入的许可声明（文档与标准为 CC BY 4.0，软件为 Apache-2.0）。
本目录只包含文档文本，因此适用文档条款。源许可文本保存在 [`LICENSE.md`](LICENSE.md)。

## 5. 没有迁入什么

以下内容**留在源仓**，作为 provenance，**不进入本仓库活跃面**：

- MF-0001 mission、MF-0002 vision（身份 / 使命文本，非硬边界）
- ADR-0001、ADR-0002、ADR-0005（历史决策 provenance；其中 ADR-0005 编码了已被移除的自上而下治理结构）
- `AUTHORITY_MANIFEST.json`（Proposed 操作性 registry，无当前 consumer）
- 全部 RFC、Kernel、workflow、conformance、registry、review infrastructure、scripts、模板与编号保留系统
- 其余旧产品快照与已过时 roadmap

源仓 `YuemingHub/mingos-foundation` 在未来被 Archive 后，**上述全部内容仍完整保留在那里**，作为理解这 6 份文本的 provenance。
Archive **不删除**任何东西；它只表示"不再承载当前权威"。

## 6. 使用纪律

引用本目录时：

1. 说出**具体文件**和它的**源状态**（Candidate / Draft）。
2. 不要把这里的任何文本称为 Accepted、Stable 或 Foundation conformance。
3. 不要把这里的文本当作产品应该怎么做事的说明书。
4. 需要引用时，指向本目录路径与来源 commit `fc40f98`，而不是指向正在退役的源仓作为当前权威。

---

相关文档：[`../COMPASS.md`](../COMPASS.md)（MingOS 方向与防漂移入口） · [`../GOVERNANCE.md`](../GOVERNANCE.md)（决策层级与人的最终权利） · [`../docs/FOUNDATION_DEPENDENCY.md`](../docs/FOUNDATION_DEPENDENCY.md)（下游采用记录）

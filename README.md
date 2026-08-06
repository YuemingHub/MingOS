# MingOS

> 面向未来的数字生命空间操作系统。

MingOS 不是某一个聊天机器人、Agent、知识库或家庭教育产品。它定义一种可持续的空间运行方式：让个人、家庭、专业者和小团队能够保存自身脉络，形成真实意图，配置 AI 权限，推动行动，并用证据确认结果。

## 仓库关系

| 仓库 | 职责 |
|---|---|
| [`YuemingHub/mingos-foundation`](https://github.com/YuemingHub/mingos-foundation) | 生命宪章、最高原则、伦理与不可违背边界 |
| **本仓库 `YuemingHub/MingOS`** | 跨空间协议、Schema、内核与运行时 |
| `YuemingHub/Family-Space` | 第一个垂直空间：家庭空间；家庭业务不进入 MingOS 内核 |

## v0.1 范围

第一版只建立可验证的公共骨架：

1. Space：空间及其生命周期；
2. Actor：人、组织、AI Agent 与外部服务的主体边界；
3. Context Ledger：事实、陈述、推断、决定与撤回；
4. Intent Contract：意图、非目标、约束、完成标准与人工决策点；
5. Task / Authorization：执行与授权；
6. Evidence / Handoff：证据、连续性与跨 Agent 恢复；
7. Continuity Bundle：一次交接所需资产的完整、可验证闭包。

当前明确不做：通用聊天 UI、MCP 商店、多模型网关、Skill 市场、复杂工作流编辑器和家庭领域逻辑。

## 开始

```bash
npm ci
npm run check
```

查看第一个自举空间：

```text
examples/team-space/mingos-project/
```

## Continuity Bundle CLI

验证一个交接包是否完整、授权有效、任务与证据可追溯：

```bash
npm run ming -- bundle validate examples/team-space/mingos-project/continuity-bundle.json
```

只从 Bundle 指定资产恢复项目摘要：

```bash
npm run ming -- bundle inspect examples/team-space/mingos-project/continuity-bundle.json
npm run ming -- bundle inspect examples/team-space/mingos-project/continuity-bundle.json --json
```

CLI 只读取仓库资产，不调用模型、不连接外部工具、不执行不可逆操作。

## Snapshot CLI

量化一次外部空间快照中的重复劳动、字段损失与语义覆盖：

```bash
npm run ming -- snapshot analyze fixtures/family-space-snapshot-input/snapshot.config.json
npm run ming -- snapshot analyze fixtures/family-space-snapshot-input/snapshot.config.json --json
```

生成确定性的只读脚手架：

```bash
npm run ming -- snapshot scaffold \
  fixtures/family-space-snapshot-input/snapshot.config.json \
  --out .tmp/family-space-snapshot
```

脚手架会生成：

```text
source-snapshot.json
space.json
claims.json
coverage-report.json
authority-report.json
temporal-report.json
conflict-report.json
REVIEW_REQUIRED.md
```

它不会自动确认事实、推断意图、授予权限、创建任务、选择冲突赢家或声称完成。

外部仓库没有 `space-manifest.json` 时，可以在配置中显式提供 `space_seed`：

```json
{
  "space_seed": {
    "schema_version": "0.1.0",
    "kind": "space",
    "space_id": "example-archive",
    "space_type": "custom",
    "name": "Example Archive",
    "owner_actor_id": "human-owner",
    "member_actor_ids": [],
    "purpose": "待人工确认的空间用途",
    "lifecycle": "draft",
    "boundaries": ["来源只读", "旧主张不自动成为当前事实"],
    "created_at": "2026-08-06T00:00:00Z",
    "updated_at": "2026-08-06T00:00:00Z"
  }
}
```

`space_seed` 是显式、可审阅的身份声明，不是工具推断。配置不得同时提供来源 Manifest 和 Seed；Seed 模式永远要求人工复核。

### 来源权威与时效

每个来源文件可以显式声明：

```json
{
  "authority": "current-fact-source",
  "valid_as_of": "2026-08-06",
  "review_after": "2026-08-13",
  "current_fact_source_for": ["production-status"]
}
```

支持的权威角色为：

```text
current-fact-source
governance
reference
historical
unknown
```

只有 `current-fact-source` 可以声明 `current_fact_source_for`。工具会提示未知权威、缺少有效日期、到期复核、同一议题存在多个当前事实源，以及已经失效的参考断言。

### 冲突候选

工具不会从文本中自行判断两个句子是否矛盾。只有配置显式为主张声明同一 `topic` 与不同 `asserted_value`，或提供带来源的 `reference_assertions` 时，才生成冲突候选：

```json
{
  "claim_annotations": {
    "REPOSITORY-MAP.md:L12": {
      "topic": "family-space-product-repository",
      "asserted_value": "YuemingHub/Ming-os",
      "temporal_status": "historical",
      "valid_as_of": "2026-08-03"
    }
  },
  "reference_assertions": [
    {
      "assertion_id": "REF-CURRENT-FAMILY-REPO",
      "topic": "family-space-product-repository",
      "asserted_value": "YuemingHub/Family-Space",
      "source_ref": "github:YuemingHub/Family-Space@<commit>/CURRENT_PROJECT_STATUS.md",
      "authority": "current-fact-source",
      "valid_as_of": "2026-08-06"
    }
  ]
}
```

`conflict-report.json` 只并列不同值、来源、权威与时间状态；`automatic_resolution` 永远为 `false`。

## Source Review CLI

把显式冲突候选转成正式冲突报告和待人复核请求：

```bash
npm run ming -- source-review scaffold \
  fixtures/mingos-unified-snapshot-input/snapshot.config.json \
  --out .tmp/source-review \
  --space mingos-project \
  --created-by agent-continuity \
  --reviewer human-yueming \
  --created-at 2026-08-06T14:50:00Z
```

输出包括一份 `source-conflict-report` 和每个候选对应的 `source-review`。命令只创建 `pending` 请求：

```text
review_status = pending
decision = null
selected_value_ref = null
rationale = null
decided_at = null
```

这意味着 Agent 可以提出“需要谁复核什么”，但不能把继续推进项目的授权伪装成某个人已经选择了具体事实。

提交或撤回复核决定时，内核要求：

- `reviewer_actor_id` 必须是 active human Actor；
- 候选引用必须完整覆盖冲突报告中的全部值；
- `accept-value` 必须选择候选值并引用支持来源；
- `preserve-history` 必须明确选择要保留为历史的值；
- `unresolved` 不得暗中选择候选；
- `request-evidence` 必须列出需要补充的证据；
- 所有复核保持 `revocable: true`；
- 原始来源永远不被覆盖。

真实待复核样本位于：

```text
examples/source-review-pilot/
```

MingOS 将首先用自己的协议持续建设 MingOS 本身。

## 核心判定

> 没有证据支持的完成，不是完成。
>
> AI 可以执行，但不能静默取得人的最终决定权。
>
> 未经确认的理解，不得伪装成事实。

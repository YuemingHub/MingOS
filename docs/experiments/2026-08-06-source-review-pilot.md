# Source Review 复核协议实验

- 日期：2026-08-06
- 阶段：M5 candidate
- 真实人类决定：0
- 待复核请求：3
- 来源仓库写入：0
- 自动冲突消解：关闭

## 实验起点

M4 已经能够从固定来源生成权威、时效和冲突候选报告。`mingos-unified` 历史知识仓稳定产生三个候选议题：

1. MingOS 规范入口仓；
2. Family-Space 产品仓；
3. Foundation 仓库名称。

但“检测到候选”与“有人作出决定”是两件不同的事。用户说继续推进工程，不等于用户已经对三个具体候选逐项选择。

## 核心风险

如果 Agent 在创建复核流程时顺便填写决定，系统会把一般执行授权错误转译为具体事实授权。即使选择看起来明显，也会破坏以下边界：

- 人的最终决定权；
- 决定的具名责任；
- 决定理由和证据；
- 暂不决定的权利；
- 之后撤回或修正的能力。

## 协议对象

### source-conflict-report

正式冲突报告保存：

- 固定 `conflict_report_id`；
- 原快照 ID 和被描述空间；
- 每个冲突的稳定 `conflict_id`；
- 每个候选值的稳定 `value_id`；
- 支持该值的原始记录、来源、权威和时间状态；
- `automatic_resolution: false`。

它不保存赢家。

### source-review

复核对象同时记录两个主体：

- `created_by_actor_id`：谁创建复核请求；
- `reviewer_actor_id`：谁有权提交复核决定。

这样 Agent 可以创建请求并指派给人，但不能把自己的输出伪装成人的决定。

## 状态机

### pending

必须满足：

```text
decision = null
selected_value_ref = null
rationale = null
supporting_refs = []
requested_evidence = []
decided_at = null
```

pending 不得 supersede 其他复核，也不得带撤回字段。

### submitted

必须：

- reviewer 是 active human Actor；
- `decision` 非空；
- 写明 `rationale` 和 `decided_at`；
- `revocable` 为 true；
- 候选引用完整覆盖冲突报告中的全部值。

决定类型：

| 决定 | 额外约束 |
|---|---|
| `accept-value` | 必须选择一个候选值，并提供 supporting refs |
| `preserve-history` | 必须选择一个要明确保留为历史的值 |
| `unresolved` | 不得暗中选择候选值 |
| `request-evidence` | 不得选择候选值，必须列出 requested evidence |

### revoked

保留原决定、时间与理由，同时必须增加：

- `revoked_at`；
- `revocation_reason`。

撤回不删除原记录。新的复核可通过 `supersedes_review_id` 引用同一冲突的旧复核。

## 真实样本处理

本实验将三个真实候选写成 pending 请求：

```text
created_by_actor_id = agent-continuity
reviewer_actor_id = human-yueming
review_status = pending
```

所有决定字段为空。因此仓库只表达：

> 三个议题需要月明本人复核。

仓库没有表达：

> 月明已经接受了某个值。

## 自动生成命令

```bash
npm run ming -- source-review scaffold \
  fixtures/mingos-unified-snapshot-input/snapshot.config.json \
  --out .tmp/source-review \
  --space mingos-project \
  --created-by agent-continuity \
  --reviewer human-yueming \
  --created-at 2026-08-06T14:50:00Z
```

命令生成：

```text
conflict-report.json
reviews/SOURCE-REVIEW-*.json
REVIEW_REQUIRED.md
```

只生成 pending 请求，不生成决定。

## 验证矩阵

- 固定 Snapshot 必须生成稳定冲突、值和复核 ID；
- 生成报告必须与仓库中的固定真实报告逐字一致；
- pending 请求必须通过验证；
- pending 中预填决定、理由或时间必须失败；
- 候选引用不完整必须失败；
- active human Actor 的合成 `accept-value` 样本必须通过；
- AI Agent 冒充 reviewer 提交决定必须失败；
- CLI 必须明确输出“没有生成决定”；
- 所有现有 Kernel、Bundle、Snapshot 和外部空间回归必须继续通过。

## 不做什么

- 不替用户选择三个真实候选；
- 不把 GitHub 当前状态自动升级为用户决定；
- 不修改 `mingos-unified`、Family-Space 或 Foundation；
- 不创建真实生产数据；
- 不建设图形化复核 UI；
- 不建设联网导入器、模型网关或通用 Agent 平台。

GitHub Actions 全量通过且 PR 合并前，本能力不计入主干已完成状态。

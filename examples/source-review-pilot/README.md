# Source Review Pilot

本目录把 `mingos-unified` 历史知识仓中稳定复现的三个冲突候选转为机器可验证的待复核请求。

## 当前状态

- 冲突报告：1 份；
- 冲突候选：3 个；
- 待复核请求：3 份；
- 已提交的人类决定：0；
- 自动冲突消解：关闭；
- 来源仓库写入：0。

## 为什么全部是 pending

用户授权继续推进 MingOS 工程，不等于已经对每个仓库事实候选作出具体选择。因此 Agent 只创建复核请求：

- `created_by_actor_id` 是 `agent-continuity`；
- `reviewer_actor_id` 是 `human-yueming`；
- `review_status` 是 `pending`；
- `decision`、`rationale`、`decided_at` 和证据字段保持空值。

这使系统能够表达“需要这个人决定”，但不能伪造“这个人已经决定”。

## 可提交决定

| 决定 | 含义 |
|---|---|
| `accept-value` | 接受某个候选值，并提供支持来源 |
| `preserve-history` | 明确把某个值保留为历史表述 |
| `unresolved` | 当前证据不足，保持未决 |
| `request-evidence` | 列出继续判断所需的补充证据 |

任何 submitted 或 revoked 复核都必须：

1. 由 active human Actor 具名；
2. 覆盖冲突报告中的全部候选值；
3. 写明理由和决定时间；
4. 保持 `revocable: true`；
5. 不修改原始来源记录。

## 生成命令

```bash
npm run ming -- source-review scaffold \
  fixtures/mingos-unified-snapshot-input/snapshot.config.json \
  --out .tmp/source-review \
  --space mingos-project \
  --created-by agent-continuity \
  --reviewer human-yueming \
  --created-at 2026-08-06T14:50:00Z
```

命令只生成正式冲突报告和 pending 请求，不生成任何复核决定。

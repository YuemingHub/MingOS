# Context Ledger Protocol

上下文账本保存的是带状态的认知对象，不是无差别聊天历史。

## 记录类型

- `fact`：有可追溯依据、当前被系统接受的事实；
- `statement`：某个主体的原始陈述，不自动等于事实；
- `inference`：AI 或人的解释与推断；
- `decision`：有责任主体的明确决定；
- `assumption`：为推进工作暂时采用、尚未验证的前提；
- `correction`：对既有记录的修正；
- `revocation`：撤回或停止继续使用既有记录。

## 状态

`pending`、`confirmed`、`disputed`、`superseded`、`revoked`、`expired`。

未经确认的 inference 不得被提升为 fact。所有替代、纠正和撤回都保留关系链，不静默覆盖历史。

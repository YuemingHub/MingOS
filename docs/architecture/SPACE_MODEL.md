# Space Model

Space 是 MingOS 的基本运行边界，不是一个聊天窗口。

一个 Space 至少包含：

- 唯一身份与类型；
- 所有者和成员；
- 建立目的；
- 数据与行动边界；
- 当前生命周期；
- 适用政策；
- 上下文账本；
- 意图契约；
- 任务、证据和 handoff。

## 空间类型

v0.1 允许 `personal`、`family`、`professional`、`team` 和 `custom`。类型决定领域扩展，不改变内核对象的公共语义。

## 生命周期

```text
draft → active → paused → archived
```

- `draft`：尚未开始真实运行；
- `active`：允许在授权范围内执行；
- `paused`：保留资产但禁止自动执行；
- `archived`：只读保存，可导出和恢复副本。

任何不可逆删除都不属于 v0.1 默认行为。

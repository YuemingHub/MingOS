# ADR-0001：Foundation、MingOS 与 Spaces 分仓

- 状态：Accepted
- 日期：2026-08-06

## 决定

维持三个独立层级：`mingos-foundation`、`MingOS`、领域 Space 仓库。Family-Space 不再作为 MingOS 总仓。

## 原因

现有 Family-Space 已形成完整家庭业务、运行和安全边界。继续向上抽象会混淆通用内核与家庭领域，并增加重构风险。

## 后果

公共协议先在 MingOS 定义；领域仓通过 manifest 和 adapter 接入。只有经过两个以上空间或明确跨空间验证的机制，才考虑进入内核实现。

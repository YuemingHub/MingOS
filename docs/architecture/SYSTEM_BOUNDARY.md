# 系统边界

## MingOS 是什么

MingOS 是跨空间的公共操作底座。它处理：

- 谁在空间中行动；
- 什么信息被保存，以及其真实性状态；
- 人真正想完成什么；
- AI 被授权到哪里；
- 任务如何执行；
- 什么证据证明完成；
- 中断或更换 Agent 后如何继续。

## MingOS 不是什么

- 不是 Family-Space 的新名字；
- 不是通用大模型或聊天应用；
- 不是 MCP/Skill 安装器；
- 不是知识库产品；
- 不是替人做重大决定的自动化系统。

## 依赖方向

```text
mingos-foundation
       ↓
     MingOS
       ↓
Family / Personal / Professional / Team Space
       ↓
Model / Agent / MCP / API / Storage / UI adapters
```

只允许向下依赖。领域空间可实现 MingOS 协议；MingOS 不反向依赖某个领域空间。

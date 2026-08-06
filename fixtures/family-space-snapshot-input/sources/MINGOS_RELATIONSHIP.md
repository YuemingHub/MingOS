# Family-Space 与 MingOS 的关系

## 三层结构

```text
YuemingHub/mingos-foundation
        ↓ 最高原则、生命宪章、伦理与不可牺牲边界
YuemingHub/MingOS
        ↓ 跨空间协议、Schema、内核与运行时
YuemingHub/Family-Space
        ↓ 家庭领域产品、交互与专业逻辑
```

## 本仓库负责

- 家庭成员、家庭事件与家庭关系；
- 家长对话、回复链路与家庭画像；
- 家庭领域的风险识别、安全门和人工专业判断；
- 家长端、专业者端和家庭空间交互；
- 家庭领域训练集、评估集、案例和产品闭环。

## MingOS 负责

- Space 与 Actor 的公共身份模型；
- Context Ledger 中事实、陈述、推断、修正和撤回的通用语义；
- Intent Contract、授权、任务、证据和 Handoff；
- 跨 Agent 连续性、能力适配与运行时；
- 个人空间、家庭空间、专业者空间和小团队空间共同遵守的协议。

## 禁止的耦合

- 不把“家长、孩子、厌学、家庭画像”等字段提升为所有空间通用对象；
- 不把 MingOS 的通用协议重新复制一份后在本仓库独立演化；
- 不因历史仓库名称和部署文件，把 Family-Space 继续描述成 MingOS 总系统；
- 不在 MingOS 尚未稳定前大规模搬移现有家庭业务代码。

## 接入顺序

1. 先以 `space-manifest.json` 声明 Family-Space 的身份和边界；
2. MingOS M0 协议稳定后，仅接入 Context、Intent、Evidence 和 Handoff 的最小适配；
3. 通过真实开发过程验证跨 Agent 交接；
4. 只有产生明确收益后，才考虑提取公共运行时代码。

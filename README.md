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

脚手架只生成来源快照、Space 字段、主张清单、覆盖率报告和人工复核清单。它不会自动确认事实、推断意图、授予权限、创建任务或声称完成。

MingOS 将首先用自己的协议持续建设 MingOS 本身。

## 核心判定

> 没有证据支持的完成，不是完成。
>
> AI 可以执行，但不能静默取得人的最终决定权。
>
> 未经确认的理解，不得伪装成事实。

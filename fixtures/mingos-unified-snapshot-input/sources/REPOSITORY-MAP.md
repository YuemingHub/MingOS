# MingOS 仓库职责地图

## 一个项目，不等于把所有东西塞进一个代码仓

MingOS·生命空间只有一个母项目。多个仓库只是不同职责的容器，不能再被理解为并列项目。

## 主线仓库（日常打开）

| 仓库 | 唯一职责 | 状态 | 计划动作 |
|---|---|---|---|
| `YuemingHub/MingOS-Unified` | 唯一总入口、统一总纲、决策、对话融合、历史资产索引 | 总控知识仓 | 改名 → `mingos-unified` |
| `YuemingHub/Ming-os` | 月明 AI·家庭空间的产品代码、测试、运行与部署事实 | 当前唯一产品实现仓 | 改名 → `mingos`；默认分支改 `main` |
| `YuemingHub/Ming-Foundation` | 宪章、标准、治理、伦理、安全和证据校准 | 最高标准库 | 改名 → `mingos-foundation` |
| `YuemingHub/Family-Life-Space-Website` | ymai.love 官网（Next.js 静态站） | 当前产品官网 | 改名 → `ymai-website` |

## 能力资产库（被主线复用）

| 仓库 | 唯一职责 | 状态 | 计划动作 |
|---|---|---|---|
| `YuemingHub/mingos-workbench` | 三件套 Skill 唯一主场：ELL / parent-reply / 校准套件；七维理论透镜；工作流 | 资产库 | 改名 → `mingos-skills`；Genesis 中的资产副本改为链接 |
| `YuemingHub/MingOS-Genesis` | 设计原点与知识内核（HomeTeach / familyos-knowledge-base） | 知识仓 | 改名 → `mingos-genesis`；补根 README |

## 独立工具（与主线无关，各自演进）

| 仓库 | 唯一职责 | 状态 | 计划动作 |
|---|---|---|---|
| `YuemingHub/creating-forward` | AI Agent 工作协议 | 独立工具 | 保留 |
| `YuemingHub/solo-dev-autopilot` | 单人开发自动驾驶 Skill 集 | 独立工具 | 保留 |
| `YuemingHub/weblens` | AI 网页分析器（私有） | 独立实验 | 保留或归档，待定 |

## 归档区（只读保留）

| 仓库 | 唯一职责 | 状态 | 计划动作 |
|---|---|---|---|
| `YuemingHub/Ming-Venture-OS` | Agent 自主经营与开发 Loop 的未来能力实验 | PARK | 改名 → `mingos-venture` + 归档 |
| `YuemingHub/mingjing` | 明径·成长向导 MVP | 已收敛 | 归档 |
| `YuemingHub/FamilyCaseLoop` | 月明家庭教育系统（引擎 + 引导前端） | 已收敛 | 归档 |
| `YuemingHub/Gui` | 回到自己·个人本地工具 | 已停更 | 归档 |
| `YuemingHub/Our-life` | 家庭生活静态站（Cloudflare Pages） | 已停更 | 归档 |

## 待清理

| 仓库 | 状态 | 计划动作 |
|---|---|---|
| `YuemingHub/ymai-platform` | 空仓（0 提交） | 删除 |

## 不再使用的理解

- `Family-os` 是 `Ming-os` 的历史名称，不是另一个当前项目。
- `ymai.love` 是当前产品入口，不是独立母项目。
- `mingos.cn` 是品牌、宪章和公共表达入口，不是第二套产品。
- 个体成长空间、孩子端、专业者端、研究生态和 Ming Venture OS 都是未来停车场，不进入当前开发主线。
- mingjing、FamilyCaseLoop 曾是与主线共享方法论的产品实验；按「当前只验证一个闭环」原则归档，代码只读保留。

## 写入规则

- 总纲、决策、对话融合与跨仓导航：写入本仓。
- 产品代码、测试、部署与运行事实：写入 `Ming-os`。
- 最高原则、规范和治理要求：写入 `Ming-Foundation`。
- 三件套资产唯一主场：`mingos-workbench`（待改名 `mingos-skills`），其他仓库只放链接。
- 同一原文只保存一份；其他仓库只放链接和实现映射。
- 真实家庭资料、咨询原文、聊天截图、身份信息和密钥不得进入 GitHub。

## 2026-08-03 整理记录

账号现有 15 个仓库已全部纳入本地图。本次整理动作：统一命名、归档停更产品仓、删除空仓。仓库级操作（改名 / 归档 / 删除）执行完毕后，本地图将同步为实际状态。

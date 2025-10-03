# Nick Translator 产品需求文档（PRD）

## 1. 文档信息
- **版本**：v0.1（依据当前代码仓库）
- **更新时间**：2025-01-??（请在合并前更新为实际日期）
- **负责人**：待指派

## 2. 项目概述
Nick Translator 是一款基于 Expo + React Native 打造的实时语音翻译应用，提供多语言自动识别、对话分段展示以及 RRT（Real-time Responsive Translation）增强体验。目前 Demo 已支持语音输入模拟、即时翻译卡片展示、历史记录浏览、订阅方案展示与账户管理等核心流程。【F:app/(tabs)/index.tsx†L46-L371】【F:app/(tabs)/archive.tsx†L23-L220】【F:app/(tabs)/subscription.tsx†L29-L220】【F:app/(tabs)/settings.tsx†L25-L220】

## 3. 产品愿景与目标
- **愿景**：帮助跨语言沟通者在会议、出行、客户交流等场景中实现自然、流畅且可信赖的实时翻译体验。
- **阶段性目标**：
  1. 完成核心翻译能力（语音识别、RRT 翻译、语音播报）与基础账号体系的 MVP。
  2. 构建可扩展的订阅/计费能力，为高级功能提供商业化基础。
  3. 建立高可用的历史记录与多端同步机制，提升重复价值。

## 4. 用户画像与核心场景
- **商务人士**：跨国会议记录与沟通，即时了解对方意图。
- **旅行用户**：陌生环境下的求助、问路、购物对话。
- **语言学习者**：通过实时对话与历史归档积累表达方式。

### 核心场景流程（当前实现）
1. 用户打开 App，进入翻译页，查看在线状态并选择语言组合。【F:app/(tabs)/index.tsx†L236-L303】
2. 点击麦克风按钮触发监听，实时生成转写并调用 RRT 翻译，分段更新翻译卡片。【F:app/(tabs)/index.tsx†L198-L377】【F:services/translationService.ts†L7-L142】
3. 结束录音后当前会话保存到内存中的对话列表（未来需落地存储/归档）。【F:app/(tabs)/index.tsx†L209-L216】
4. 首次使用高级功能时弹出登录 / 邮箱验证模态，完成账户绑定后恢复流程。【F:app/(tabs)/index.tsx†L255-L281】【F:screens/AuthScreen.tsx†L22-L220】【F:screens/EmailVerificationScreen.tsx†L15-L116】
5. 用户可在“Archive”查看示例历史记录、筛选与播放；在“Plans”浏览订阅方案；在“Settings”调整偏好及账号操作。【F:app/(tabs)/archive.tsx†L27-L220】【F:app/(tabs)/subscription.tsx†L33-L206】【F:app/(tabs)/settings.tsx†L90-L220】

## 5. 功能规划
以下按模块区分当前“已实现”与“待实现/TODO”状态。

### 5.1 实时翻译体验
- **已实现**
  - 语音输入模拟：通过 `useSpeechRecognition` hook 模拟实时转写与置信度更新，为前端联调提供基础。【F:hooks/useSpeechRecognition.ts†L19-L121】
  - RRT 翻译流程：支持语言自动检测、上下文增强与分段展示，包含 TTS 播报入口。【F:app/(tabs)/index.tsx†L129-L233】【F:services/translationService.ts†L7-L176】
  - 多语言选择器与语言互换操作，覆盖 15+ 语言预设。【F:app/(tabs)/index.tsx†L73-L224】
- **待实现 / TODO**
  - 接入真实语音识别（iOS Speech、Android SpeechRecognizer、Web Speech API），替换当前模拟逻辑。【F:hooks/useSpeechRecognition.ts†L33-L81】
  - 联通真实翻译/LLM 服务，使用后端 API 与鉴权，替换 `translationService` 中的 mock 数据与本地延迟模拟。【F:services/translationService.ts†L33-L142】
  - 对话归档持久化（本地数据库/云端 Firestore）与离线缓存策略，避免当前仅存内存的丢失风险。【F:app/(tabs)/index.tsx†L212-L215】
  - TTS 集成平台原生能力，支持选择语音与语速（目前仅 console 输出）。【F:services/translationService.ts†L166-L176】

### 5.2 认证与账户体系
- **已实现**
  - Firebase Email/Password 注册登录、密码重置以及邮箱验证流程，结合 `AuthContext` 统一管理状态。【F:contexts/AuthContext.tsx†L41-L169】【F:screens/AuthScreen.tsx†L32-L220】【F:screens/EmailVerificationScreen.tsx†L15-L116】
  - Google 登录整合与凭证安全存储（SecureStore）。【F:contexts/AuthContext.tsx†L78-L125】
  - Auth Guard：在翻译页触发高级功能前检查登录与邮箱状态，自动弹出对应模态。【F:hooks/useAuthGuard.ts†L11-L31】【F:app/(tabs)/index.tsx†L198-L281】
- **待实现 / TODO**
  - Apple Sign-in 真正接入，当前仅在 iOS 上抛出“即将上线”错误。【F:contexts/AuthContext.tsx†L95-L115】
  - 邮箱验证状态自动刷新策略优化（后台轮询/深度链接），减少手动点击“我已验证”。【F:screens/EmailVerificationScreen.tsx†L37-L85】
  - 更细粒度的权限控制（例如订阅用户专属能力、免费次数限制）。

### 5.3 历史记录与知识库
- **已实现**
  - Archive 页提供筛选、分类、搜索、播放、分享、删除等交互雏形，配合示例数据展示能力。【F:app/(tabs)/archive.tsx†L27-L220】
- **待实现 / TODO**
  - 将实时翻译结果落地到历史记录（含标签、时间戳、用户 ID），支持分页加载与多端同步。
  - 分享/播放/删除按钮需绑定真实逻辑（如触发系统分享、文本转语音播放、软删除）。【F:app/(tabs)/archive.tsx†L157-L167】
  - 增加收藏/标注、导出等高阶功能，为订阅权益做铺垫。

### 5.4 订阅与商业化
- **已实现**
  - 多种套餐展示、权益清单、选中状态、成功/失败提示等 UI 体验已搭建。【F:app/(tabs)/subscription.tsx†L33-L206】
- **待实现 / TODO**
  - 集成 RevenueCat / App Store / Play Billing，完成真实购买与恢复流程（目前仅模拟延迟与弹窗）。【F:app/(tabs)/subscription.tsx†L113-L134】
  - 根据订阅状态控制功能访问（与 Auth Guard/Settings 联动）。
  - 设计订单/票据验证与退款处理机制。

### 5.5 设置与系统偏好
- **已实现**
  - 设置页包含账号信息、翻译偏好、音频语音、隐私安全、外观和支持等分区，支持多个开关状态管理及登出确认流程。【F:app/(tabs)/settings.tsx†L25-L220】
- **待实现 / TODO**
  - 将各开关与真实功能联动（如夜间模式、离线下载、隐私页导航）。【F:app/(tabs)/settings.tsx†L121-L220】
  - 支持多语言界面、辅助功能（字体放大、对比度）等体验优化。

## 6. 技术架构与依赖
- **前端框架**：Expo Router + React Native，使用 SafeAreaView、Animated 等构建移动体验。【F:app/(tabs)/index.tsx†L1-L377】
- **状态管理**：React Context 负责认证信息，局部 State 管理翻译会话与设置偏好。【F:contexts/AuthContext.tsx†L41-L170】【F:app/(tabs)/index.tsx†L55-L215】【F:app/(tabs)/settings.tsx†L25-L220】
- **第三方服务**：Firebase Auth、Google Sign-In（已接入）；RevenueCat、真实翻译 API、系统 TTS/Speech API（计划接入）。【F:contexts/AuthContext.tsx†L78-L125】【F:services/translationService.ts†L33-L176】【F:app/(tabs)/subscription.tsx†L113-L134】
- **类型与工具**：TypeScript、自定义 hooks（`useSpeechRecognition`、`useAuthGuard`）提升可维护性。【F:hooks/useSpeechRecognition.ts†L19-L121】【F:hooks/useAuthGuard.ts†L11-L31】

## 7. 数据与指标（建议）
- **核心体验指标**：实时翻译延迟、识别准确率、翻译满意度、TTS 播报完成率。
- **增长指标**：登录转化率、邮箱验证完成率、订阅转化率、留存率。
- **质量指标**：崩溃率、API 成功率、付费失败率。
（以上指标需在接入真实服务后结合埋点/监控方案落地。）

## 8. 里程碑规划（建议）
1. **M1 - MVP（语音翻译基础版）**
   - 接入真实语音识别与翻译 API。
   - 完成翻译结果持久化与历史页打通。
   - 上线基础账号/订阅门槛（仅前端拦截）。
2. **M2 - 商业化闭环**
   - 完成 RevenueCat 内购、订阅状态同步。
   - 落地高级功能权限控制与使用限制。
   - 优化邮箱验证流转与异常提示。
3. **M3 - 体验提升**
   - 上线离线模式、TTS 自定义、对话导出等高级功能。
   - 构建数据分析与 A/B 测试体系。
   - 深化多语言 UI 与可访问性支持。

## 9. 风险与依赖
- 语音/翻译 API 成本与稳定性、延迟风险。
- 各平台（iOS/Android/Web）的权限与审核要求（麦克风、订阅、隐私）。
- RevenueCat、Firebase、第三方 API 的账号配置、证书与合规流程。

---
本 PRD 将随迭代持续更新，具体开发排期与资源分配需结合团队计划确定。

# 游戏化训练营 MVP V1 真实数据架构设计

**日期：** 2026-06-28  
**状态：** 待最终审核  
**技术栈：** Next.js、TypeScript、Tailwind CSS、Supabase Auth、Supabase PostgreSQL、Supabase Storage

## 1. 目标

将当前页面骨架补齐为真实可用的 MVP V1，完成以下九项能力：

1. 登录
2. 课程学习
3. 签到
4. 作业提交
5. 积分
6. 等级
7. 徽章
8. 排行榜
9. 后台查看

Supabase 是 V1 的基础设施供应商，但不进入页面、组件、领域模型和业务用例。架构必须允许未来迁移到腾讯云 PostgreSQL，并允许认证和文件存储分别迁移。

## 2. 非目标

本轮不实现：

- AI 点评、AI 教练或 AI 报告
- 老师点评工作台
- 案例库
- 海报和证书
- 支付
- 微信小程序
- 课程后台编辑器
- 人工调整积分
- 补签
- 后台新增、编辑或删除业务数据

课程、作业、等级、积分和徽章规则在 V1 中通过数据库种子数据维护。

## 3. 设计原则

1. 页面和 React 组件不得直接访问 Supabase。
2. Route Handler 只负责 HTTP、输入校验、鉴权入口和响应转换。
3. Application Use Case 负责业务流程，不依赖具体数据库、认证或 Storage SDK。
4. 所有数据库访问必须通过面向业务的 Repository 接口。
5. 登录通过 `AuthProvider` 接口隔离。
6. 文件存储通过 `FileStorage` 接口隔离。
7. Repository、AuthProvider 和 FileStorage 由统一 Composition Root 装配。
8. 关键写入必须原子化并幂等。
9. 业务用户 ID 与外部认证 ID 分离。
10. 保留现有项目风格，渐进迁移，不做无关目录重构。

## 4. 总体架构

```text
Next.js 页面 / React 组件
            │
            ▼
Application Use Cases
            │
            ▼
领域端口 Ports
  ┌─────────┼──────────────┐
  ▼         ▼              ▼
AuthProvider Repositories  FileStorage
  │         │              │
  └─────────┼──────────────┘
            ▼
Supabase Infrastructure Adapters
```

依赖只能从外向内。领域层和应用层不得反向依赖 `@supabase/*`。

### 4.1 目标目录

保留现有 `app/`、`components/` 和 `lib/` 根目录，按职责渐进整理：

```text
app/
├── (auth)/
├── (student)/
├── admin/
└── api/

components/
├── student/
├── admin/
└── ui/

lib/
├── domain/
├── application/
│   ├── ports/
│   └── use-cases/
├── infrastructure/
│   └── supabase/
│       ├── auth/
│       ├── repositories/
│       └── storage/
├── composition/
└── presentation/
```

### 4.2 页面访问规则

- Server Component 可以调用由 Composition Root 提供的 Application Use Case。
- Client Component 的写操作调用 `/api` Route Handler。
- 页面、组件和 Route Handler 不写 `.from(...)` 数据库查询。
- Route Handler 不直接创建 Supabase Client。
- Composition Root 是创建和注入基础设施适配器的唯一入口。

## 5. 身份与用户模型

业务数据不直接引用 `auth.users.id`。

```text
Supabase Auth User
        │ provider + provider_subject
        ▼
auth_identities
        │ user_id
        ▼
app_users
        │
        ├── profiles
        ├── enrollments
        ├── point_ledger
        ├── badge_awards
        └── submissions
```

### 5.1 核心表

`app_users`

- `id uuid primary key`
- `email text`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

`auth_identities`

- `id uuid primary key`
- `user_id uuid references app_users(id)`
- `provider text`
- `provider_subject text`
- `created_at timestamptz`
- 唯一约束：`(provider, provider_subject)`

`profiles`

- `user_id uuid primary key references app_users(id)`
- `nickname text`
- `avatar_url text`
- `leaderboard_anonymous boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

其他业务表统一引用 `app_users.id`。核心业务 Schema 不使用 `auth.uid()`，也不外键到 Supabase `auth` Schema。

### 5.2 用户初始化

邮箱密码注册成功后：

1. `SupabaseAuthProvider` 返回认证主体。
2. `UserProvisioningUseCase` 通过身份映射查找内部用户。
3. 首次注册时创建 `app_users`、`auth_identities` 和 `profiles`。
4. 根据服务端 `DEFAULT_CAMP_SLUG` 找到 V1 默认训练营并创建报名。
5. 后续登录复用同一内部用户。

后台主理人权限通过一次性基础设施脚本设置，不在 V1 页面提供角色编辑功能。

测试版 Supabase Auth 关闭邮箱确认，使注册后可以立即登录。正式生产环境启用邮箱确认前，必须先配置并验证面向中国大陆用户的 SMTP 服务。代码同时处理“已建立会话”和“等待邮箱确认”两种注册结果。

## 6. 端口与适配器

### 6.1 数据库端口

接口按业务边界定义，不使用通用 `BaseRepository`：

- `UserRepository`
- `ProfileRepository`
- `EnrollmentRepository`
- `CourseRepository`
- `CheckInRepository`
- `AssignmentRepository`
- `GrowthRepository`
- `LeaderboardRepository`
- `AdminReadRepository`

接口参数和返回值只使用领域类型、标量和应用 DTO，不允许出现 `SupabaseClient`、PostgREST 响应或数据库行类型。

### 6.2 认证端口

`AuthProvider` 支持：

- `signUp(email, password)`
- `signIn(email, password)`
- `signOut()`
- `getCurrentPrincipal()`

认证主体包含：

- `provider`
- `subject`
- `email`

V1 实现为 `SupabaseAuthProvider`。未来可以替换认证适配器而不改变业务用户 ID。

### 6.3 Storage 端口

`FileStorage` 支持：

- 创建短期签名上传凭证
- 创建短期签名下载凭证

数据库只保存对象 Key、原文件名、MIME 类型和字节数，不保存供应商公网 URL。

V1 使用 `SupabaseStorage`，未来使用 `TencentCosStorage`。

## 7. 事务与幂等

以下动作必须作为完整业务事务执行：

- 每日签到、积分写入、徽章检查和徽章授予
- 完成课节、积分写入、徽章检查和徽章授予
- 正式提交作业、积分写入、徽章检查和徽章授予

Repository 暴露完整业务动作：

- `CheckInRepository.checkInToday(...)`
- `CourseRepository.completeLesson(...)`
- `AssignmentRepository.submit(...)`

Supabase Repository 通过 PostgreSQL 事务函数实现。事务函数属于基础设施实现，不进入页面和 Application Use Case。迁移到腾讯云 PostgreSQL 时，可以复用标准 PostgreSQL 函数，或在新的 Repository 内使用数据库事务实现相同接口。

幂等约束：

- 每日签到：`(enrollment_id, local_date)` 唯一
- 课程完成：`(enrollment_id, lesson_id)` 唯一
- 作业提交：`(enrollment_id, assignment_id)` 唯一
- 积分事件：`event_key` 唯一
- 徽章授予：`(user_id, camp_id, badge_id)` 唯一

重复请求返回成功结果，但积分和徽章不重复产生。

## 8. 登录与权限

### 8.1 API

```text
POST /api/auth/sign-up
POST /api/auth/sign-in
POST /api/auth/sign-out
GET  /api/auth/me
PUT  /api/profile
```

### 8.2 页面权限

- 已登录用户访问 `/login` 时进入 `/app/home`。
- 未登录用户访问 `/app/*` 或 `/admin/*` 时进入 `/login`。
- 普通学员访问 `/admin/*` 时进入 `/app/home`。
- `owner`、`admin` 和 `assistant` 可以访问后台只读页面。
- 后台 Route Handler 必须独立执行角色校验。

Supabase Service Role Key 只存在于服务端环境变量。浏览器不能读取或记录该密钥。

## 9. 作业附件 Storage

Bucket 使用私有访问：

```text
assignment-assets/
  {organizationId}/{campId}/{userId}/{submissionId}/{randomFileName}
```

上传过程：

1. 作业页向应用 API 请求上传凭证。
2. API 校验登录、报名、作业权限、文件类型和大小。
3. `FileStorage` 返回短期签名上传 URL。
4. 浏览器使用签名 URL 直接上传，不导入 Supabase SDK。
5. API 保存 `submission_assets` 元数据。
6. 正式提交时校验附件属于当前用户和当前作业。

下载过程使用短期签名下载 URL。Bucket 不开放公共读取。

V1 文件限制：

- 图片：10 MB
- PDF 和通用附件：20 MB
- 视频：100 MB
- 文件名只用于展示，存储 Key 使用服务端生成的随机名称

## 10. 九项 MVP 数据流与验收

### 10.1 登录

```text
LoginPage
→ AuthUseCase
→ AuthProvider
→ UserRepository
→ 登录 Cookie
→ /app/home
```

验收：

- 邮箱密码注册、登录和退出可用。
- 注册后自动创建 Profile 和默认训练营报名。
- 未登录用户不能访问学生端和后台。

### 10.2 课程学习

```text
CoursePage
→ GetCoursePathUseCase
→ CourseRepository
```

验收：

- 展示真实模块、课节、状态和内容。
- 支持图文、视频、音频、PDF、附件和 Prompt 资源。
- 同一课节只发放一次完成积分。
- 作业打卡入口位于课程学习内容下方。

### 10.3 签到

验收：

- 首页显示真实签到状态。
- 按训练营时区计算自然日。
- 同一天重复操作不重复加分。
- 满足累计签到条件时自动授予徽章。

### 10.4 作业提交

验收：

- 展示真实作业要求和允许类型。
- 支持文字、链接和文件。
- 支持保存草稿和正式提交。
- 刷新页面后恢复草稿。
- 重复正式提交不重复加分。
- 用户只能读取和修改自己的作业。

### 10.5 积分

验收：

- 所有积分通过流水生成。
- 流水可追踪业务事件。
- 积分页按时间倒序展示来源和分值。
- 页面和后台均不能直接修改总积分。

### 10.6 等级

验收：

- 根据总积分计算 Lv1 至 Lv7。
- 展示当前等级、下一等级和所需积分。
- 达到最高等级后不显示下一等级缺口。

### 10.7 徽章

验收：

- 展示全部徽章、获得状态和条件。
- 支持积分、签到天数、完课数和作业数四类条件。
- 同一训练营内同一徽章只授予一次。

### 10.8 排行榜

验收：

- 支持总榜和周榜。
- 依次按积分、作业数和签到天数排序。
- 学员可匿名展示，并能看到自己的名次。
- 后台仍能识别真实用户。

### 10.9 后台查看

只读路由：

```text
/admin/overview
/admin/students
/admin/students/[userId]
/admin/submissions
/admin/check-ins
/admin/leaderboard
```

验收：

- 展示真实训练营数据。
- 只有后台角色可以访问。
- 不提供新增、编辑、删除、点评或积分调整。

## 11. 错误处理

统一应用错误：

| 错误码 | HTTP 状态 | 说明 |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | 参数或表单校验失败 |
| `UNAUTHORIZED` | 401 | 未登录 |
| `FORBIDDEN` | 403 | 无权限 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `FILE_TOO_LARGE` | 413 | 文件超过限制 |
| `UNSUPPORTED_FILE_TYPE` | 415 | 不支持的文件类型 |
| `INTERNAL_ERROR` | 500 | 未预期内部错误 |

重复签到、重复完课和重复提交属于幂等成功，返回 HTTP 200。

基础设施错误统一映射为应用错误。数据库消息、Supabase 错误、堆栈、Token、密码和 Cookie 不得返回浏览器或写入普通日志。

## 12. 测试设计

### 12.1 单元测试

- 领域积分、等级和徽章规则
- Use Case 输入校验和业务分支
- 幂等结果处理
- 错误到 API 响应的映射

Use Case 测试使用 Fake Repository，不连接 Supabase。

### 12.2 架构约束测试

自动扫描以下目录：

- `app/`
- `components/`
- `lib/application/`
- `lib/domain/`

禁止导入：

- `@supabase/supabase-js`
- `@supabase/ssr`
- `lib/infrastructure/supabase`

允许 Supabase SDK 出现在基础设施适配器和 Composition Root。

### 12.3 集成测试

连接测试 Supabase 验证：

- Repository 映射
- 数据库事务函数
- 唯一约束和幂等
- 私有 Storage 签名上传
- 学员和后台权限

### 12.4 核心链路验证

```text
注册
→ 登录
→ 查看课程
→ 完成课节
→ 签到
→ 保存作业草稿
→ 上传附件
→ 正式提交
→ 查看积分、等级、徽章
→ 查看排行榜
→ 后台查看该学员数据
```

页面验证宽度：

- 375px
- 390px
- 430px
- 后台桌面布局

交付前必须通过单元测试、TypeScript 检查、生产构建和核心链路 Smoke Test。

## 13. 国内 PostgreSQL 迁移

迁移数据库时保持以下内容不变：

- 页面和 React 组件
- Application Use Case
- 领域规则
- API 请求和响应结构
- Repository 接口
- AuthProvider 接口
- FileStorage 接口

需要替换：

- Supabase Repository 实现
- Composition Root 中的数据库适配器选择
- 数据库连接环境变量

如果继续保留 Supabase Auth 和 Storage，认证与文件代码不变。后续迁移认证或腾讯 COS 时，分别替换 `AuthProvider` 或 `FileStorage` 适配器。

核心 Schema 仅使用标准 PostgreSQL 类型、约束、视图和事务函数，不依赖 Supabase `auth` Schema，便于直接导出和导入腾讯云 PostgreSQL。

## 14. 实施边界

本设计允许对现有未完成骨架做必要调整，包括：

- 将散落的 Supabase 调用迁移到基础设施适配器
- 将静态占位查询替换为真实 Repository
- 补齐邮箱密码认证
- 补齐私有文件上传
- 补齐学生端和后台权限
- 补齐九项冻结功能的真实数据闭环

不进行与上述目标无关的重构、视觉改版或新功能开发。现有移动端优先布局、配色和已经确认的作业入口位置保持不变。

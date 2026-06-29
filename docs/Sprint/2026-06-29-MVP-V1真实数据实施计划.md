# 游戏化训练营 MVP V1 真实数据 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有静态页面骨架补齐为真实可用的 MVP V1，并保证页面、业务用例与 Supabase 解耦。

**Architecture:** 使用轻量级 Ports and Adapters。Application Use Case 只依赖 Repository、AuthProvider 和 FileStorage 接口；Supabase Auth、PostgreSQL 和 Storage 位于基础设施适配器中，由 Composition Root 统一装配。关键写入通过 PostgreSQL 事务函数保证原子性和幂等性。

**Tech Stack:** Next.js 15、React 19、TypeScript、Tailwind CSS、Supabase Auth、PostgreSQL、Supabase Storage、Node.js Test Runner

## Global Constraints

- 只实现登录、课程学习、签到、作业提交、积分、等级、徽章、排行榜和后台查看。
- 不实现 AI、点评、案例库、海报、证书、支付、小程序、补签、人工积分调整或后台编辑功能。
- 页面、React 组件、领域代码和 Application Use Case 不得导入 Supabase SDK。
- 所有数据库操作必须通过 Repository。
- 登录、数据库和 Storage 必须使用独立端口。
- 保留现有移动端优先布局、颜色和课程页下方的作业打卡入口。
- 密钥只写入本机 `.env.local`，不得出现在源码、测试、日志和文档示例中。
- 当前设备没有可用 Git；计划中的提交检查点在 Git 可用后执行，不阻塞本地实现。

## File Structure

新增或迁移后的职责边界：

```text
lib/
├── domain/                         # 纯业务规则与类型
├── application/
│   ├── errors.ts                   # 应用错误
│   ├── ports/
│   │   ├── auth-provider.ts
│   │   ├── user-repository.ts
│   │   ├── profile-repository.ts
│   │   ├── enrollment-repository.ts
│   │   ├── course-repository.ts
│   │   ├── check-in-repository.ts
│   │   ├── assignment-repository.ts
│   │   ├── growth-repository.ts
│   │   ├── leaderboard-repository.ts
│   │   ├── admin-read-repository.ts
│   │   └── file-storage.ts
│   └── use-cases/
│       ├── auth.ts
│       ├── profile.ts
│       ├── student-home.ts
│       ├── course.ts
│       ├── check-in.ts
│       ├── assignment.ts
│       ├── growth.ts
│       ├── leaderboard.ts
│       └── admin.ts
├── infrastructure/
│   └── supabase/
│       ├── clients/
│       ├── auth/
│       ├── repositories/
│       └── storage/
├── composition/
│   ├── server.ts
│   └── request.ts
└── presentation/
    └── api-error-response.ts
```

---

### Task 1: 建立架构端口、应用错误和静态边界测试

**Files:**

- Create: `lib/application/errors.ts`
- Create: `lib/application/ports/auth-provider.ts`
- Create: `lib/application/ports/file-storage.ts`
- Create: `lib/application/ports/user-repository.ts`
- Create: `lib/application/ports/profile-repository.ts`
- Create: `lib/application/ports/enrollment-repository.ts`
- Create: `lib/application/ports/course-repository.ts`
- Create: `lib/application/ports/check-in-repository.ts`
- Create: `lib/application/ports/assignment-repository.ts`
- Create: `lib/application/ports/growth-repository.ts`
- Create: `lib/application/ports/leaderboard-repository.ts`
- Create: `lib/application/ports/admin-read-repository.ts`
- Create: `tests/architecture-boundaries.test.ts`
- Create: `tests/application-errors.test.ts`

**Interfaces:**

- Produces: `AppError`, `AuthProvider`, `FileStorage` 和九个 Repository 端口。
- Consumes: 现有 `lib/domain/*` 领域规则。

- [ ] **Step 1: 写架构边界失败测试**

测试递归扫描 `app/`、`components/`、`lib/application/` 和 `lib/domain/`。禁止这些目录直接导入 `@supabase/supabase-js`、`@supabase/ssr` 或 `lib/infrastructure/supabase`。允许 `app/` 导入 `@/lib/composition/*`。

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const roots = ["app", "components", "lib/application", "lib/domain"];
const forbidden = [
  /from ["']@supabase\/supabase-js["']/,
  /from ["']@supabase\/ssr["']/,
  /from ["']@\/lib\/infrastructure\/supabase/,
  /from ["']@\/lib\/supabase/,
  /from ["']@\/lib\/repositories\/.*\.supabase/
];

const legacyAllowlist = new Set([
  "app/api/check-ins/route.ts",
  "app/api/lessons/[lessonId]/complete/route.ts",
  "app/api/submissions/draft/route.ts",
  "app/api/submissions/submit/route.ts"
]);

function sourceFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : /\.(ts|tsx)$/.test(path)
        ? [path]
        : [];
  });
}

test("presentation and application layers do not import Supabase", () => {
  const violations = roots.flatMap((root) =>
    sourceFiles(root).flatMap((file) => {
      const source = readFileSync(file, "utf8");
      const normalized = file.replaceAll("\\", "/");
      return forbidden.some((pattern) => pattern.test(source))
        && !legacyAllowlist.has(normalized)
        ? [normalized]
        : [];
    })
  );

  assert.deepEqual(violations, []);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test tests/architecture-boundaries.test.ts`

Expected: PASS。测试中的 `legacyAllowlist` 只能列出审计时已经存在的四个 Route Handler，禁止新增越层文件；后续任务迁移一个就删除一个白名单项，Task 9 时白名单必须为空。

- [ ] **Step 3: 定义应用错误和基础端口**

`AppError` 必须携带稳定错误码和 HTTP 无关的业务信息：

```ts
export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

认证和 Storage 接口：

```ts
export type AuthPrincipal = {
  provider: "supabase";
  subject: string;
  email: string;
};

export type SignUpResult = {
  principal: AuthPrincipal;
  sessionEstablished: boolean;
};

export interface AuthProvider {
  signUp(email: string, password: string): Promise<SignUpResult>;
  signIn(email: string, password: string): Promise<AuthPrincipal>;
  signOut(): Promise<void>;
  getCurrentPrincipal(): Promise<AuthPrincipal | null>;
}
```

```ts
export type SignedUpload = {
  objectKey: string;
  uploadUrl: string;
  method: "PUT";
  headers: Record<string, string>;
  expiresAt: string;
};

export interface FileStorage {
  createSignedUpload(input: {
    objectKey: string;
    contentType: string;
  }): Promise<SignedUpload>;
  createSignedDownload(objectKey: string): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }>;
}
```

每个 Repository 端口只暴露该业务用例需要的方法，不创建通用 CRUD 基类。

- [ ] **Step 4: 测试应用错误**

```ts
test("AppError preserves stable code without exposing infrastructure details", () => {
  const error = new AppError("NOT_FOUND", "资源不存在", new Error("db detail"));
  assert.equal(error.code, "NOT_FOUND");
  assert.equal(error.message, "资源不存在");
});
```

Run: `node --test tests/application-errors.test.ts`

Expected: PASS.

- [ ] **Step 5: 运行现有测试**

Run: `npm.cmd test`

Expected: 全部 PASS。

### Task 2: 替换为可迁移的 PostgreSQL Schema、事务函数和 Seed

**Files:**

- Replace: `supabase/migrations/0001_mvp_v1_schema.sql`
- Replace: `supabase/seed.sql`
- Create: `supabase/bootstrap-owner.sql`
- Create: `tests/database-contract.test.ts`
- Modify: `.env.example`
- Modify: `docs/本地运行步骤.md`

**Interfaces:**

- Produces: 与 Supabase `auth` Schema 解耦的标准 PostgreSQL Schema。
- Produces: `provision_app_user`、`check_in_today`、`complete_lesson`、`submit_assignment` 四个事务函数。
- Consumes: Task 1 定义的领域端口契约。

- [ ] **Step 1: 写数据库合同失败测试**

测试读取 SQL 文本并断言：

```ts
test("business schema does not depend on Supabase auth schema", () => {
  const sql = readFileSync("supabase/migrations/0001_mvp_v1_schema.sql", "utf8");
  assert.doesNotMatch(sql, /references\s+auth\.users/i);
  assert.doesNotMatch(sql, /auth\.uid\(\)/i);
  assert.match(sql, /create table app_users/i);
  assert.match(sql, /create table auth_identities/i);
  assert.match(sql, /function provision_app_user/i);
});

test("critical commands are implemented as database transactions", () => {
  const sql = readFileSync("supabase/migrations/0001_mvp_v1_schema.sql", "utf8");
  assert.match(sql, /function check_in_today/i);
  assert.match(sql, /function complete_lesson/i);
  assert.match(sql, /function submit_assignment/i);
});
```

Run: `node --test tests/database-contract.test.ts`

Expected: FAIL，因为现有 Schema 仍依赖 `auth.users` 和 `auth.uid()`。

- [ ] **Step 2: 重建身份相关表和外键**

Schema 必须以以下关系为准：

```sql
create table app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index app_users_email_key on app_users (lower(email));

create table auth_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  provider text not null,
  provider_subject text not null,
  created_at timestamptz not null default now(),
  unique(provider, provider_subject)
);

create table profiles (
  user_id uuid primary key references app_users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  leaderboard_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

所有 `user_id` 外键改为引用 `app_users(id)`。业务表保留现有组织、课程、训练营、学习进度、积分、徽章和排行榜结构。

- [ ] **Step 3: 添加事务函数和唯一约束**

每个函数接收内部用户 ID、目标 ID 和当前时间；函数内部锁定报名记录、执行状态写入、写积分流水、计算徽章并返回统一 JSON/行结果。必须依赖以下唯一约束：

```sql
unique(enrollment_id, local_date)
unique(enrollment_id, lesson_id)
unique(enrollment_id, assignment_id)
unique(event_key)
unique(user_id, camp_id, badge_id)
```

函数不得调用 `auth.uid()`；Repository 负责传入已经鉴权和映射的内部用户 ID。

`provision_app_user` 接收认证提供方、认证主体、邮箱、默认昵称和默认训练营 slug，在一个事务内创建或复用 `app_users`、`auth_identities`、`profiles` 和 `enrollments`。

- [ ] **Step 4: 更新 Seed 和 Owner 引导脚本**

`seed.sql` 使用固定 slug 而非固定 UUID 识别默认对象：

```sql
insert into organizations (name, slug)
values ('Jenny 知识成长', 'jenny-growth')
on conflict (slug) do nothing;

insert into camps (organization_id, course_id, title, slug, timezone, status)
select o.id, c.id, 'AI人生操作系统创造营', 'ai-life-os-camp', 'Asia/Shanghai', 'published'
from organizations o
join courses c on c.organization_id = o.id
where o.slug = 'jenny-growth'
on conflict (organization_id, slug) do nothing;
```

`bootstrap-owner.sql` 使用 `<OWNER_INTERNAL_USER_ID>` 占位符并明确提示仅在用户首次注册后手工替换，不包含真实邮箱或密钥。

- [ ] **Step 5: 更新环境变量合同**

`.env.example`：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEFAULT_CAMP_SLUG=ai-life-os-camp
```

- [ ] **Step 6: 验证**

Run: `node --test tests/database-contract.test.ts`

Expected: PASS.

Run: `npm.cmd test`

Expected: 除仍在迁移中的架构边界测试外，其余测试 PASS。

### Task 3: 实现 Supabase Auth Adapter、用户初始化和邮箱密码登录

**Files:**

- Create: `lib/infrastructure/supabase/clients/server.ts`
- Create: `lib/infrastructure/supabase/clients/service.ts`
- Create: `lib/infrastructure/supabase/auth/supabase-auth-provider.ts`
- Create: `lib/infrastructure/supabase/auth/update-session.ts`
- Create: `middleware.ts`
- Create: `lib/infrastructure/supabase/repositories/user.supabase.ts`
- Create: `lib/infrastructure/supabase/repositories/profile.supabase.ts`
- Create: `lib/infrastructure/supabase/repositories/enrollment.supabase.ts`
- Create: `lib/application/use-cases/auth.ts`
- Create: `lib/application/use-cases/profile.ts`
- Create: `lib/composition/request.ts`
- Create: `lib/presentation/api-error-response.ts`
- Create: `app/api/auth/sign-up/route.ts`
- Create: `app/api/auth/sign-in/route.ts`
- Create: `app/api/auth/sign-out/route.ts`
- Modify: `app/api/me/route.ts`
- Modify: `app/api/auth/profile/route.ts`
- Modify: `app/(auth)/login/page.tsx`
- Create: `components/auth/AuthForm.tsx`
- Create: `components/student/ProfileForm.tsx`
- Modify: `app/(student)/app/profile/page.tsx`
- Modify: `app/(student)/app/layout.tsx`
- Modify: `app/admin/layout.tsx`
- Create: `tests/auth-use-cases.test.ts`
- Create: `tests/auth-form-validation.test.ts`

**Interfaces:**

- Consumes: `AuthProvider`, `UserRepository`, `ProfileRepository`, `EnrollmentRepository`.
- Produces: `signUp`, `signIn`, `signOut`, `requireCurrentUser`, `requireAdminUser`。

- [ ] **Step 1: 写认证 Use Case 失败测试**

覆盖：

```ts
test("sign up provisions one internal user and default enrollment", async () => {
  const result = await signUp({
    email: "jenny@example.com",
    password: "StrongPass123!",
    authProvider: fakeAuth,
    userRepository: fakeUsers,
    enrollmentRepository: fakeEnrollments,
    defaultCampSlug: "ai-life-os-camp"
  });

  assert.equal(result.sessionEstablished, true);
  assert.equal(fakeUsers.created.length, 1);
  assert.equal(fakeEnrollments.created.length, 1);
});

test("repeated sign in reuses the same internal user", async () => {
  const first = await resolveCurrentUser(dependencies);
  const second = await resolveCurrentUser(dependencies);
  assert.equal(first.id, second.id);
});
```

Run: `node --test tests/auth-use-cases.test.ts`

Expected: FAIL，因为 Use Case 尚不存在。

- [ ] **Step 2: 实现 SupabaseAuthProvider**

适配器内部调用 Supabase Auth，向外只返回 `AuthPrincipal`。任何 Supabase 错误映射为稳定 `AppError`，不向浏览器暴露原始消息。

- [ ] **Step 3: 实现用户初始化**

`signUp` 和首次 `signIn` 均调用内部用户解析逻辑：

```ts
const user = await userRepository.provision({
  provider: principal.provider,
  subject: principal.subject,
  email: principal.email,
  nickname: principal.email.split("@")[0],
  defaultCampSlug
});
```

Supabase UserRepository 通过 `provision_app_user` RPC 实现该原子操作。

- [ ] **Step 4: 实现 API 和登录表单**

登录页提供“登录”和“注册”两个状态，字段只有邮箱和密码。客户端只调用应用 API，不导入 Supabase SDK。成功后使用 `window.location.assign("/app/home")`。

表单校验：

- 邮箱必须有效。
- 密码至少 8 位。
- 提交中禁用按钮。
- 显示安全、可理解的错误消息。

- [ ] **Step 5: 接入页面权限**

学生和后台布局通过 Composition Root 调用 `requireCurrentUser` / `requireAdminUser`。禁止布局直接创建 Supabase Client。

根 `middleware.ts` 只委托给 `update-session.ts` 刷新 Supabase Auth Cookie，不执行数据库查询或业务授权。业务授权仍由布局和 Route Handler 执行。

- [ ] **Step 6: 验证**

Run: `node --test tests/auth-use-cases.test.ts tests/auth-form-validation.test.ts`

Expected: PASS.

Run: `npm.cmd test`

Expected: 新旧测试均通过，架构边界测试只剩尚未迁移的旧 Route Handler 违规。

### Task 4: 接通学生首页、课程路径和课节真实读取

**Files:**

- Create: `lib/infrastructure/supabase/repositories/course.supabase.ts`
- Create: `lib/application/use-cases/student-home.ts`
- Create: `lib/application/use-cases/course.ts`
- Modify: `lib/composition/request.ts`
- Modify: `app/api/student/home/route.ts`
- Modify: `app/api/camps/[campId]/course/route.ts`
- Modify: `app/api/lessons/[lessonId]/route.ts`
- Modify: `app/(student)/app/home/page.tsx`
- Modify: `app/(student)/app/course/page.tsx`
- Modify: `app/(student)/app/course/[lessonId]/page.tsx`
- Modify: `components/student/LessonContent.tsx`
- Modify: `components/student/CoursePath.tsx`
- Create: `tests/student-read-use-cases.test.ts`
- Modify: `tests/course-query.test.ts`
- Modify: `tests/student-home.test.ts`

**Interfaces:**

- Consumes: `CourseRepository`, `GrowthRepository`, `requireCurrentUser`。
- Produces: `getStudentHome`, `getCoursePath`, `getLesson`。

- [ ] **Step 1: 写真实读取失败测试**

测试必须覆盖：

- 无报名返回 `NOT_FOUND`。
- 首页主行动指向第一节未完成课节。
- 全部课节完成时显示课程完成状态。
- 课节读取只允许当前训练营报名用户。
- 课节资源按 position 排序。

Run: `node --test tests/student-read-use-cases.test.ts`

Expected: FAIL.

- [ ] **Step 2: 实现 CourseRepository**

Repository 查询必须显式接收 `userId`，并通过报名关系限制课程数据。返回领域 DTO：

```ts
export type LessonDetail = {
  id: string;
  title: string;
  summary: string | null;
  contentMd: string;
  status: "not_started" | "in_progress" | "completed";
  assets: LessonAsset[];
  assignment: { id: string; title: string } | null;
};
```

- [ ] **Step 3: 替换静态页面数据**

删除页面对以下占位对象的依赖：

- `studentHomePlaceholder`
- `coursePathPlaceholder`
- 课节页拼接标题和固定 `assignment-1`

课节页面只在真实课节存在作业时显示“作业打卡”，位置保持在课程学习内容下方。

- [ ] **Step 4: 实现空状态和错误状态**

- 无训练营报名：显示“暂未加入训练营”。
- 无课程：显示“课程正在准备中”。
- 课节不存在：调用 `notFound()`。
- 基础设施异常：显示通用错误，不展示数据库消息。

- [ ] **Step 5: 验证**

Run: `node --test tests/student-read-use-cases.test.ts tests/course-query.test.ts tests/student-home.test.ts`

Expected: PASS.

### Task 5: 接通课程完成和签到原子写入

**Files:**

- Create: `lib/infrastructure/supabase/repositories/check-in.supabase.ts`
- Extend: `lib/infrastructure/supabase/repositories/course.supabase.ts`
- Create: `lib/application/use-cases/check-in.ts`
- Extend: `lib/application/use-cases/course.ts`
- Modify: `app/api/check-ins/route.ts`
- Modify: `app/api/lessons/[lessonId]/complete/route.ts`
- Modify: `components/student/CheckInButton.tsx`
- Modify: `components/student/CompleteLessonButton.tsx`
- Create: `tests/check-in-use-case.test.ts`
- Create: `tests/complete-lesson-use-case.test.ts`
- Modify: `tests/architecture-boundaries.test.ts`
- Delete after migration: `lib/repositories/check-ins.supabase.ts`
- Delete after migration: `lib/repositories/lesson-completion.supabase.ts`
- Delete after migration: `lib/services/check-ins.ts`
- Delete after migration: `lib/services/lesson-completion.ts`

**Interfaces:**

- Consumes: `CheckInRepository.checkInToday`、`CourseRepository.completeLesson`。
- Produces: 幂等签到和完课结果。

- [ ] **Step 1: 写失败测试**

```ts
test("repeated check-in is a successful no-op", async () => {
  repository.result = {
    localDate: "2026-06-29",
    alreadyCheckedIn: true,
    pointsAdded: 0,
    checkInDays: 1,
    newBadges: []
  };
  const result = await checkInToday({ currentUser, repository, now });
  assert.equal(result.pointsAdded, 0);
});

test("repeated lesson completion does not add points", async () => {
  repository.result = {
    lessonId: "lesson-1",
    alreadyCompleted: true,
    pointsAdded: 0,
    completedLessons: 1,
    newBadges: []
  };
  const result = await completeLesson(input);
  assert.equal(result.pointsAdded, 0);
});
```

Run: `node --test tests/check-in-use-case.test.ts tests/complete-lesson-use-case.test.ts`

Expected: FAIL.

- [ ] **Step 2: 实现 Repository RPC Adapter**

每个 Adapter 只调用对应 PostgreSQL 事务函数并映射返回值：

```ts
const { data, error } = await client.rpc("check_in_today", {
  p_user_id: input.userId,
  p_now: input.now.toISOString(),
  p_note: input.note ?? null
});
```

Route Handler 和 Use Case 不得出现 `.rpc()`。

- [ ] **Step 3: 更新交互反馈**

成功消息区分首次成功和幂等成功；新徽章存在时显示徽章名称。写入成功后刷新当前页面真实数据。

- [ ] **Step 4: 删除旧实现**

确认所有导入已迁移后删除旧 `lib/services` 和 `lib/repositories/*.supabase.ts` 对应文件，避免两套写入路径并存。

同时从架构测试 `legacyAllowlist` 删除签到和完课两个 Route Handler。

- [ ] **Step 5: 验证**

Run: `node --test tests/check-in-use-case.test.ts tests/complete-lesson-use-case.test.ts`

Expected: PASS.

Run: `npm.cmd test`

Expected: PASS，或仅剩后续任务尚未迁移的架构边界违规。

### Task 6: 接通作业读取、草稿、文件上传和正式提交

**Files:**

- Create: `lib/infrastructure/supabase/repositories/assignment.supabase.ts`
- Create: `lib/infrastructure/supabase/storage/supabase-file-storage.ts`
- Create: `lib/application/use-cases/assignment.ts`
- Modify: `lib/composition/request.ts`
- Modify: `app/api/assignments/[assignmentId]/route.ts`
- Modify: `app/api/submissions/draft/route.ts`
- Modify: `app/api/submissions/submit/route.ts`
- Modify: `app/api/submission-assets/upload-url/route.ts`
- Create: `app/api/submission-assets/confirm/route.ts`
- Modify: `components/student/AssignmentForm.tsx`
- Modify: `app/(student)/app/assignments/[assignmentId]/page.tsx`
- Create: `tests/assignment-use-cases.test.ts`
- Create: `tests/file-policy.test.ts`
- Modify: `tests/architecture-boundaries.test.ts`
- Delete after migration: `lib/repositories/assignment-submission.supabase.ts`
- Delete after migration: `lib/services/assignment-submission.ts`

**Interfaces:**

- Consumes: `AssignmentRepository`、`FileStorage`。
- Produces: `getAssignment`、`saveAssignmentDraft`、`createAssignmentUpload`、`confirmAssignmentAsset`、`submitAssignment`。

- [ ] **Step 1: 写失败测试**

覆盖：

- 只有报名用户能读取作业。
- 草稿刷新后可恢复。
- 保存草稿不加积分。
- 正式提交调用一次原子 Repository 方法。
- 重复提交返回 `pointsAdded: 0`。
- 附件必须属于当前用户、作业和提交记录。
- 图片 10 MB、通用附件 20 MB、视频 100 MB。
- 不支持的 MIME 类型返回 `UNSUPPORTED_FILE_TYPE`。

Run: `node --test tests/assignment-use-cases.test.ts tests/file-policy.test.ts`

Expected: FAIL.

- [ ] **Step 2: 实现私有 Storage Adapter**

对象 Key 只能由服务端生成：

```ts
const objectKey = [
  organizationId,
  campId,
  userId,
  submissionId,
  `${crypto.randomUUID()}.${safeExtension}`
].join("/");
```

Bucket 固定为 `assignment-assets`，签名有效期不超过 10 分钟。Adapter 返回签名 URL，不返回 Service Role Key。

- [ ] **Step 3: 实现上传确认**

上传完成后，客户端调用 `/api/submission-assets/confirm`。Repository 验证对象 Key 前缀与当前用户上下文一致，再写入：

```ts
{
  submissionId,
  objectKey,
  originalName,
  mimeType,
  sizeBytes
}
```

- [ ] **Step 4: 更新作业页面**

页面加载真实要求和草稿；保留文字与链接字段，增加文件选择和上传进度。正式提交前必须至少存在一种允许的内容。

- [ ] **Step 5: 删除 501 占位接口和旧实现**

`submission-assets/upload-url` 不再返回 501。删除旧作业 Supabase Repository 和服务文件。

同时从架构测试 `legacyAllowlist` 删除草稿和正式提交两个 Route Handler；此时白名单必须为空。

- [ ] **Step 6: 验证**

Run: `node --test tests/assignment-use-cases.test.ts tests/file-policy.test.ts`

Expected: PASS.

### Task 7: 接通成长中心、积分、等级、徽章和排行榜

**Files:**

- Create: `lib/infrastructure/supabase/repositories/growth.supabase.ts`
- Create: `lib/infrastructure/supabase/repositories/leaderboard.supabase.ts`
- Create: `lib/application/use-cases/growth.ts`
- Create: `lib/application/use-cases/leaderboard.ts`
- Modify: `app/api/growth/summary/route.ts`
- Modify: `app/api/points/route.ts`
- Modify: `app/api/levels/route.ts`
- Modify: `app/api/badges/route.ts`
- Modify: `app/api/leaderboard/route.ts`
- Modify: `app/(student)/app/growth/page.tsx`
- Modify: `app/(student)/app/growth/points/page.tsx`
- Modify: `app/(student)/app/growth/levels/page.tsx`
- Modify: `app/(student)/app/growth/badges/page.tsx`
- Modify: `app/(student)/app/leaderboard/page.tsx`
- Modify: `components/student/GrowthSummaryClient.tsx`
- Modify: `components/student/PointsListClient.tsx`
- Modify: `components/student/BadgeWallClient.tsx`
- Modify: `components/student/LeaderboardClient.tsx`
- Create: `tests/growth-use-cases.test.ts`
- Create: `tests/leaderboard-use-case.test.ts`

**Interfaces:**

- Consumes: `GrowthRepository`、`LeaderboardRepository`。
- Produces: 真实成长摘要、积分流水、等级规则、徽章墙、总榜和周榜。

- [ ] **Step 1: 写失败测试**

测试：

- 总积分等于流水汇总。
- 当前等级由规则计算。
- 最高等级 `nextLevel` 为 null。
- 徽章墙包含已获得和未获得状态。
- 周榜只统计当前训练营时区本周积分。
- 排名依次按积分、作业数、签到天数排序。
- 匿名用户对学员显示匿名名，对后台显示真实名和匿名状态。

- [ ] **Step 2: 实现 GrowthRepository**

所有读取显式包含 `userId` 和 `campId`。Repository 返回已经归一化的 DTO，不返回 Supabase 行结构。

- [ ] **Step 3: 实现 LeaderboardRepository**

接口：

```ts
getLeaderboard(input: {
  campId: string;
  viewerUserId: string;
  period: "total" | "week";
  viewer: "student" | "admin";
}): Promise<LeaderboardView>;
```

- [ ] **Step 4: 替换占位数据**

删除：

- `growthPlaceholder`
- `leaderboardPlaceholder`
- 徽章 Route Handler 中硬编码数组
- `totalPoints = 0`

- [ ] **Step 5: 验证**

Run: `node --test tests/growth-use-cases.test.ts tests/leaderboard-use-case.test.ts`

Expected: PASS.

### Task 8: 接通后台只读数据和权限

**Files:**

- Create: `lib/infrastructure/supabase/repositories/admin-read.supabase.ts`
- Create: `lib/application/use-cases/admin.ts`
- Modify: `lib/composition/request.ts`
- Modify: `app/api/admin/overview/route.ts`
- Modify: `app/api/admin/students/route.ts`
- Modify: `app/api/admin/students/[userId]/route.ts`
- Modify: `app/api/admin/submissions/route.ts`
- Modify: `app/api/admin/check-ins/route.ts`
- Modify: `app/api/admin/leaderboard/route.ts`
- Modify: `components/admin/AdminOverviewClient.tsx`
- Modify: `components/admin/AdminStudentsClient.tsx`
- Modify: `components/admin/AdminSubmissionsClient.tsx`
- Modify: `components/admin/AdminCheckInsClient.tsx`
- Modify: `app/admin/leaderboard/page.tsx`
- Create: `tests/admin-use-cases.test.ts`
- Modify: `tests/admin-auth.test.ts`
- Modify: `tests/admin-read-models.test.ts`

**Interfaces:**

- Consumes: `AdminReadRepository`、`requireAdminUser`。
- Produces: 总览、学员、详情、作业、签到和后台排行榜只读 DTO。

- [ ] **Step 1: 写失败测试**

覆盖：

- 普通学员不能调用后台 Use Case。
- 助教、管理员和主理人可以读取所属组织。
- 后台不能跨组织读取数据。
- 学员筛选只支持关键词和等级。
- 作业和签到列表仅返回只读数据。
- 后台排行榜返回真实姓名及匿名状态。

- [ ] **Step 2: 实现后台 Repository**

每个查询必须接收 `organizationId` 或先由当前后台成员关系解析组织。不得使用不带组织范围的全表查询。

- [ ] **Step 3: 替换后台占位对象**

删除 `adminOverviewPlaceholder` 和所有空数组占位响应。页面保留现有只读布局，不增加编辑按钮。

- [ ] **Step 4: 验证**

Run: `node --test tests/admin-use-cases.test.ts tests/admin-auth.test.ts tests/admin-read-models.test.ts`

Expected: PASS.

### Task 9: 清理旧 Supabase 入口、完成安全检查与全链路验收

**Files:**

- Delete after all imports migrate: `lib/supabase/client.ts`
- Delete after all imports migrate: `lib/supabase/server.ts`
- Delete after all imports migrate: `lib/supabase/service.ts`
- Delete after all imports migrate: `lib/auth/require-user.ts`
- Delete after all imports migrate: `lib/auth/require-admin.ts`
- Modify: `README.md`
- Modify: `docs/本地运行步骤.md`
- Modify: `docs/部署方案.md`
- Create: `docs/Supabase初始化清单.md`
- Create: `tests/no-placeholder-routes.test.ts`

**Interfaces:**

- Consumes: Tasks 1–8 全部产物。
- Produces: 无静态业务占位、无 501 接口、无越层 Supabase 访问的可构建 MVP。

- [ ] **Step 1: 写占位清理测试**

扫描运行代码并拒绝：

```ts
const forbiddenRuntimeMarkers = [
  "NOT_IMPLEMENTED",
  "camp-placeholder",
  "studentHomePlaceholder",
  "coursePathPlaceholder",
  "leaderboardPlaceholder",
  "adminOverviewPlaceholder"
];
```

允许表单输入的 HTML `placeholder` 属性，不以单词 `placeholder` 做全局禁止。

Run: `node --test tests/no-placeholder-routes.test.ts`

Expected: FAIL，直到旧占位路由全部迁移。

- [ ] **Step 2: 删除旧基础设施入口**

Run: `rg -n "@/lib/supabase|@/lib/repositories|@/lib/auth/require" app components lib`

Expected: 无结果后才能删除旧文件。

- [ ] **Step 3: 运行完整静态验证**

Run: `npm.cmd test`

Expected: 全部 PASS，包括架构边界和占位清理测试。

Run: `npm.cmd exec -- tsc --noEmit`

Expected: exit 0.

Run: `npm.cmd run build`

Expected: exit 0，所有页面和 Route Handler 成功构建。

- [ ] **Step 4: 配置 Supabase 测试项目**

用户在 Supabase Dashboard 完成：

1. 创建项目。
2. 测试阶段关闭邮箱确认。
3. SQL Editor 依次执行 migration 和 seed。
4. 创建私有 Bucket `assignment-assets`。
5. 将真实密钥仅写入 `.env.local`。
6. 设置 `DEFAULT_CAMP_SLUG=ai-life-os-camp`。

任何验证输出只显示变量是否存在，不显示变量值。

- [ ] **Step 5: 执行真实核心链路 Smoke Test**

使用两个测试账号：

- 学员账号：注册、登录、课程、完课、签到、草稿、附件、提交、积分、等级、徽章、总榜、周榜、退出。
- 主理人账号：运行一次性 Owner 引导脚本后检查全部后台只读页面。

验证路由：

```text
/login
/app/home
/app/course
/app/course/{lessonId}
/app/assignments/{assignmentId}
/app/growth
/app/growth/points
/app/growth/levels
/app/growth/badges
/app/leaderboard
/app/profile
/admin/overview
/admin/students
/admin/students/{userId}
/admin/submissions
/admin/check-ins
/admin/leaderboard
```

- [ ] **Step 6: 验证移动端和后台布局**

浏览器宽度：

- 375px
- 390px
- 430px
- 1440px 后台

验收：

- 无横向滚动。
- 底部导航不遮挡主要按钮。
- 作业打卡入口仍在课程内容下方。
- 登录和作业表单可使用键盘完成。
- 后台表格在窄屏可滚动，在桌面完整展示。

- [ ] **Step 7: 更新文档**

`README.md` 和本地运行文档必须使用 UTF-8 中文，清楚说明：

- 安装依赖
- `.env.local` 变量名
- SQL 执行顺序
- Storage Bucket
- 启动命令
- 测试命令
- 不得在开发服务运行时执行生产构建
- GitHub 不是本地开发和 Supabase 联调的前置条件

- [ ] **Step 8: 最终验收**

只有以下条件全部成立才声明网站完成：

- `npm.cmd test` 通过。
- `npm.cmd exec -- tsc --noEmit` 通过。
- `npm.cmd run build` 通过。
- 真实 Supabase 核心链路通过。
- 学员和后台权限验证通过。
- 页面无 501、静态业务占位或敏感信息泄漏。
- 未新增冻结范围外功能。

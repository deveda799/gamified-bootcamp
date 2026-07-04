# SQLite 登录与数据闭环实施计划

**目标：** 使用 Node.js 24 内置 SQLite 完成昵称登录、服务器签到、作业、积分、排行榜和只读后台。

**架构：** Route Handlers 负责会话和数据写入，服务端 SQLite 模块负责建表与事务，HttpOnly Cookie 只保存随机会话令牌。学员页面通过一个服务端数据 Provider 读取和刷新进度；管理员使用独立密码 Cookie。

**技术栈：** Next.js 15、TypeScript、React 19、Tailwind、Node.js 24 `node:sqlite`、PM2、Nginx。

## 全局约束

- 不使用 Supabase、微信、短信、GitHub 或海外运行时服务。
- 昵称全局唯一，长度 2–20，首次登录创建账号。
- 签到每天只奖励一次 5 分；每课作业只奖励一次 20 分。
- SQLite 文件不进入 Git，生产路径为 `/opt/gamified-bootcamp/data/app.sqlite`。
- 第一版不实现真实图片上传。

---

### 任务 1：SQLite 数据库与会话仓库

**文件：**

- 新增：`lib/server/sqlite.ts`
- 新增：`lib/server/session.ts`
- 新增：`tests/sqlite-mvp.test.ts`
- 修改：`.gitignore`

**接口：**

```ts
export type StudentRecord = { id: string; nickname: string };
export type ProgressRecord = {
  points: number;
  checkedInToday: boolean;
  completedLessonIds: string[];
  submittedLessonIds: string[];
};

export function loginByNickname(nickname: string): {
  student: StudentRecord;
  token: string;
};
export function getStudentByToken(token: string): StudentRecord | null;
export function getProgress(studentId: string): ProgressRecord;
export function checkIn(studentId: string): ProgressRecord;
export function submitAssignment(input: {
  studentId: string;
  lessonId: string;
  text: string;
  link: string;
}): ProgressRecord;
export function getLeaderboard(): Array<{
  nickname: string;
  points: number;
}>;
```

- [ ] 编写失败测试：同一昵称返回同一学员、不同昵称返回不同学员。
- [ ] 编写失败测试：同日重复签到和同课重复提交不重复积分。
- [ ] 编写失败测试：排行榜按积分降序返回 SQLite 中的学员。
- [ ] 实现数据库初始化、唯一约束和事务。
- [ ] 忽略 `data/*.sqlite*`，运行测试并确认通过。

### 任务 2：昵称登录与 HttpOnly 会话

**文件：**

- 新增：`app/api/session/route.ts`
- 新增：`app/login/page.tsx`
- 新增：`components/auth/NicknameLoginForm.tsx`
- 新增：`lib/server/current-student.ts`
- 修改：`app/page.tsx`
- 修改：`app/(student)/app/layout.tsx`
- 修改：`tests/mvp-routes.test.ts`

**行为：**

- `POST /api/session` 接收 `{ nickname }`，成功后设置 `mvp_session`。
- `DELETE /api/session` 删除 Cookie。
- `/` 未登录时直接显示登录页并返回 200；已登录时显示学员首页。
- `/app/*` 未登录时跳转 `/login`。
- Cookie 为 HttpOnly、SameSite=Lax、30 天；当前使用 HTTP，因此不设置 Secure。

- [ ] 编写失败测试：昵称校验、首次创建和 Cookie 选项。
- [ ] 实现登录 API 与登录表单。
- [ ] 实现服务端当前学员解析与页面保护。
- [ ] 验证 `/` 未登录仍为 200，登录后进入 `/app/home`。

### 任务 3：服务器进度、签到和作业 API

**文件：**

- 新增：`app/api/progress/route.ts`
- 新增：`app/api/check-ins/route.ts`
- 新增：`app/api/submissions/route.ts`
- 新增：`components/student/ServerMvpProvider.tsx`
- 修改：`app/(student)/app/layout.tsx`
- 修改：`app/(student)/app/home/page.tsx`
- 修改：`app/(student)/app/course/page.tsx`
- 修改：`app/(student)/app/submit/[lessonId]/page.tsx`
- 删除：`components/student/MockMvpProvider.tsx`

**响应：**

```ts
type ProgressResponse = {
  progress: {
    points: number;
    checkedInToday: boolean;
    completedLessonIds: string[];
    submittedLessonIds: string[];
  };
};
```

- [ ] 编写失败测试：无会话返回 401，重复操作返回当前进度。
- [ ] 实现三个 API。
- [ ] Provider 初始值来自服务端，操作成功后用响应更新 React 状态。
- [ ] 作业提交保存文字和链接，刷新页面后仍显示已提交。
- [ ] 删除 localStorage 进度读写。

### 任务 4：服务器排行榜与成长页

**文件：**

- 新增：`app/api/leaderboard/route.ts`
- 修改：`app/(student)/app/growth/page.tsx`
- 新增：`tests/leaderboard-api.test.ts`

- [ ] 编写失败测试：排行榜从 SQLite 返回真实学员并按积分排序。
- [ ] 实现排行榜 API。
- [ ] 成长页从 Provider 获取当前积分，从 API 获取排行榜。
- [ ] 验证两个浏览器学员的数据会出现在同一排行榜。

### 任务 5：管理员密码与只读后台

**文件：**

- 新增：`app/api/admin/session/route.ts`
- 新增：`app/api/admin/overview/route.ts`
- 新增：`app/admin/login/page.tsx`
- 新增：`app/admin/page.tsx`
- 新增：`components/admin/AdminLoginForm.tsx`
- 修改：`app/admin/layout.tsx`
- 修改：`.env.example`
- 新增：`tests/admin-sqlite-auth.test.ts`

**行为：**

- `POST /api/admin/session` 比较 `ADMIN_PASSWORD`，成功设置 HttpOnly `mvp_admin` Cookie。
- `/admin` 显示学员昵称、积分、签到次数和作业次数。
- 未登录管理员只能访问 `/admin/login`。

- [ ] 编写失败测试：错误密码拒绝、正确密码创建管理员会话。
- [ ] 实现管理员 API、登录页和只读总览。
- [ ] 确保响应不返回管理员密码和 SQLite 文件路径。

### 任务 6：生产配置与完整验证

**文件：**

- 修改：`deploy/ecosystem.config.cjs`
- 修改：`tests/mvp-routes.test.ts`

**生产环境变量：**

```text
SQLITE_PATH=/opt/gamified-bootcamp/data/app.sqlite
ADMIN_PASSWORD 由服务器环境设置，仓库和部署包中不保存其值
```

- [ ] 为 PM2 增加 `SQLITE_PATH`，管理员密码由服务器环境注入，不写入仓库。
- [ ] 运行完整测试、类型检查和生产构建。
- [ ] 生产模式验证 `/`、`/app/home`、`/app/course`、`/app/growth`。
- [ ] 打包并部署到腾讯云，执行 `pm2 restart gamified-bootcamp --update-env`。
- [ ] 公网验证 `http://175.178.174.40/` 与 `http://175.178.174.40/app/home`。

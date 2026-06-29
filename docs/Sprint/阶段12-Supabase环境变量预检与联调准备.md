# 阶段 12：Supabase 环境变量预检与联调准备

## 本阶段目标

为 MVP V1 的 Supabase 真实联调做准备：在代码层增加环境变量预检，避免缺少 Supabase 配置时出现不清晰的运行时崩溃。

## 已完成内容

1. 新增 Supabase 环境变量预检 helper：
   - `lib/supabase/env.ts`

2. 新增测试：
   - `tests/supabase-env.test.ts`

3. 接入 Supabase client 创建处：
   - `lib/supabase/client.ts`
   - `lib/supabase/server.ts`
   - `lib/supabase/service.ts`

## 必需环境变量

请在项目根目录创建 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：浏览器端和服务端读取登录态使用
- `SUPABASE_SERVICE_ROLE_KEY`：仅服务端使用，用于签到、课程完成、作业提交等关键写入
- `NEXT_PUBLIC_SITE_URL`：本地默认为 `http://localhost:3000`

## 数据库初始化顺序

1. 在 Supabase SQL Editor 执行：

```text
supabase/migrations/0001_mvp_v1_schema.sql
```

2. 再执行种子数据：

```text
supabase/seed.sql
```

## 联调检查清单

完成 `.env.local` 和数据库初始化后，建议依次验证：

1. 登录页能正常加载
2. 当前用户接口 `/api/me` 能返回登录态
3. 签到接口 `/api/check-ins` 可写入当天签到
4. 课程完成接口 `/api/lessons/lesson-1/complete` 可写入学习进度
5. 作业草稿接口 `/api/submissions/draft` 可保存草稿
6. 作业提交接口 `/api/submissions/submit` 可提交作业
7. 积分流水 `/api/points` 后续接入真实数据后可展示动作积分
8. 徽章墙 `/api/badges` 后续接入真实数据后可展示已获得/未获得徽章

## V1 范围控制

本阶段只做 Supabase 环境预检与联调准备，不新增：

- AI 点评
- 海报
- 证书
- 案例库
- 支付
- 小程序
- 补签
- 人工调分


# 阶段 13：Supabase 写入接口环境错误友好化

## 本阶段目标

在真实 Supabase 联调前，先让 MVP V1 写入接口在缺少环境变量时返回清晰 API 错误，而不是隐性崩溃或进入 Next.js 错误页。

## 已完成内容

1. 新增 Supabase 环境错误 API 映射：
   - `lib/api/supabase-env-response.ts`

2. 新增测试：
   - `tests/supabase-env-response.test.ts`

3. 接入 V1 写入接口：
   - `app/api/check-ins/route.ts`
   - `app/api/lessons/[lessonId]/complete/route.ts`
   - `app/api/submissions/draft/route.ts`
   - `app/api/submissions/submit/route.ts`

## 错误返回

当 `.env.local` 缺少 Supabase 必需变量时，相关写入接口会返回：

```json
{
  "ok": false,
  "error": {
    "code": "SUPABASE_ENV_MISSING",
    "message": "Supabase 环境变量未配置完整，请先检查 .env.local"
  }
}
```

HTTP 状态码：

```text
503
```

## V1 范围控制

本阶段只优化 V1 写入接口的错误表达，不新增 AI、海报、证书、案例库、支付、小程序、补签、人工调分等 V1.1 功能。

## 验证

已执行：

```bash
npm.cmd test
npm.cmd run build
```

结果：

- Node 原生测试 45 / 45 通过
- Next.js production build 通过
- 代码区冻结范围扫描无命中


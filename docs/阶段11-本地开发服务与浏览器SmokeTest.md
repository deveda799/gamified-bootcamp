# 阶段 11：本地开发服务与浏览器 Smoke Test

## 本阶段目标

启动本地 Next.js 开发服务，并在移动端视口下检查 MVP V1 核心页面、后台只读页面和关键 API 是否可用。

## 本地服务

已启动：

```bash
npm.cmd run dev
```

本地地址：

```text
http://localhost:3000
```

## 页面 Smoke Test

已在移动端视口下检查以下页面：

### 学员端

- `/app/home`
- `/app/course`
- `/app/course/lesson-1`
- `/app/assignments/assignment-1`
- `/app/growth`
- `/app/growth/points`
- `/app/growth/badges`
- `/app/leaderboard`
- `/login`

### 后台端

- `/admin/overview`
- `/admin/students`
- `/admin/submissions`
- `/admin/check-ins`

## API Smoke Test

已检查以下 API 返回 200：

- `/api/growth/summary`
- `/api/points`
- `/api/badges`
- `/api/leaderboard`
- `/api/admin/overview`
- `/api/admin/students`
- `/api/admin/submissions`
- `/api/admin/check-ins`

## 观察结果

1. Next dev 首次访问页面时会触发按路由编译，首次页面打开会偏慢。
2. 成长页、积分页、徽章页在首次 dev 编译后短时间显示“加载中…”，等待客户端请求完成后可正常展示数据。
3. 页面未发现 Next runtime error。
4. 本阶段未新增 MVP V1 冻结范围之外功能。

## 建议

下一阶段可以进入 Supabase 本地/云端环境变量配置与真实数据库联调，重点验证：

- 登录状态
- 签到写入
- 课程完成写入
- 作业草稿与提交写入
- 积分和徽章自动发放


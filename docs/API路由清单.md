# MVP V1 API 路由清单

## 已建读取接口

- `GET /api/me`
- `GET /api/student/home`
- `GET /api/camps/[campId]/course`
- `GET /api/lessons/[lessonId]`
- `GET /api/growth/summary`
- `GET /api/points`
- `GET /api/levels`
- `GET /api/badges`
- `GET /api/leaderboard`
- `GET /api/check-ins`
- `GET /api/assignments/[assignmentId]`
- `GET /api/admin/overview`
- `GET /api/admin/students`
- `GET /api/admin/students/[userId]`
- `GET /api/admin/submissions`
- `GET /api/admin/check-ins`
- `GET /api/admin/leaderboard`

## 已建但暂不执行副作用的写入接口

这些接口已占位，返回 `501 NOT_IMPLEMENTED`，下一阶段接入 Supabase 真实写入、积分幂等和徽章授予。

- `POST /api/auth/profile`
- `POST /api/check-ins`
- `POST /api/lessons/[lessonId]/open`
- `POST /api/lessons/[lessonId]/complete`
- `POST /api/submissions/draft`
- `POST /api/submissions/submit`
- `POST /api/submission-assets/upload-url`

## 冻结边界

V1 不提供以下接口：

- AI 点评
- 海报/证书生成
- 案例库
- 支付
- 微信小程序专用接口
- 老师点评工作台
- 后台课程编辑


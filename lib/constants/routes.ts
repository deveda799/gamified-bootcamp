export const studentRoutes = [
  { href: "/app/home", label: "首页" },
  { href: "/app/course", label: "课程" },
  { href: "/app/growth", label: "成长" },
  { href: "/app/leaderboard", label: "排行" },
  { href: "/app/profile", label: "我的" }
] as const;

export const adminRoutes = [
  { href: "/admin/overview", label: "运营总览" },
  { href: "/admin/students", label: "学员查看" },
  { href: "/admin/submissions", label: "作业查看" },
  { href: "/admin/check-ins", label: "签到查看" },
  { href: "/admin/leaderboard", label: "排行榜" }
] as const;


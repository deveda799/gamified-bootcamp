import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { mapBadgeWall } from "@/lib/queries/growth-read-models";

export async function GET() {
  const badgeWall = mapBadgeWall(
    [
      { id: "badge-1", name: "觉醒者徽章", description: "完成首次课程学习", position: 1 },
      { id: "badge-2", name: "人生架构师", description: "累计完成 5 节课程", position: 2 },
      { id: "badge-3", name: "项目猎人", description: "累计提交 3 次作业", position: 3 },
      { id: "badge-4", name: "知识炼金师", description: "累计提交 5 次作业", position: 4 },
      { id: "badge-5", name: "数字分身创造者", description: "累计获得 700 积分", position: 5 },
      { id: "badge-6", name: "内容创造者", description: "累计获得 1000 积分", position: 6 },
      { id: "badge-7", name: "坚持王", description: "累计签到 7 天", position: 7 },
      { id: "badge-8", name: "超级个体", description: "累计获得 1500 积分", position: 8 }
    ],
    []
  );

  return NextResponse.json(
    apiSuccess(badgeWall)
  );
}

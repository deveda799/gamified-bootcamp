import { ADMIN_COOKIE, isAdminTokenValid } from "@/lib/server/auth";
import { getMvpStore } from "@/lib/server/sqlite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";

  if (!isAdminTokenValid(token, process.env.ADMIN_PASSWORD ?? "")) {
    redirect("/admin/login");
  }

  const students = getMvpStore().getAdminOverview();

  return (
    <div className="mx-auto max-w-5xl p-5">
      <header className="rounded-3xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-white/60">游戏化训练营</p>
        <h1 className="mt-2 text-2xl font-black">学员数据后台</h1>
        <p className="mt-2 text-sm text-white/70">共 {students.length} 名学员</p>
      </header>
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">昵称</th>
              <th className="p-4">积分</th>
              <th className="p-4">签到次数</th>
              <th className="p-4">作业数</th>
              <th className="p-4">加入时间</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr className="border-t border-slate-100" key={student.id}>
                <td className="p-4 font-bold">{student.nickname}</td>
                <td className="p-4 text-violet-600">{student.points}</td>
                <td className="p-4">{student.checkInCount}</td>
                <td className="p-4">{student.submissionCount}</td>
                <td className="p-4 text-slate-500">{student.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

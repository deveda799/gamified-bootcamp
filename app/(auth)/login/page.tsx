import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { getOptionalPageUser } from "@/lib/composition/request";

export default async function LoginPage() {
  const user = await getOptionalPageUser().catch(() => null);

  if (user) {
    redirect("/app/home");
  }

  return (
    <main className="min-h-screen bg-warm px-4 py-8">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <Card className="w-full">
          <p className="text-sm font-semibold text-action">游戏化训练营</p>
          <h1 className="mt-2 text-3xl font-bold text-forest">登录后开始今日行动</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            使用邮箱和密码登录，继续你的训练营成长路径。
          </p>
          <AuthForm />
        </Card>
      </div>
    </main>
  );
}

import { ProfileForm } from "@/components/student/ProfileForm";
import { Card } from "@/components/ui/Card";
import { getProfile } from "@/lib/application/use-cases/profile";
import {
  createAuthDependencies,
  requirePageUser
} from "@/lib/composition/request";

export default async function ProfilePage() {
  const user = await requirePageUser();
  const dependencies = await createAuthDependencies();
  const profile = await getProfile(user.id, dependencies.profileRepository);

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">我的</h1>
      <Card>
        <ProfileForm profile={profile} />
      </Card>
    </div>
  );
}

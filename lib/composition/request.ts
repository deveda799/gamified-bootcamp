import { redirect } from "next/navigation";
import type { AppUser } from "@/lib/application/ports/user-repository";
import {
  getCurrentUser,
  requireCurrentUser
} from "@/lib/application/use-cases/auth";
import { createSupabaseAuthProvider } from "@/lib/infrastructure/supabase/auth/supabase-auth-provider";
import { createSupabaseServerClient } from "@/lib/infrastructure/supabase/clients/server";
import { createSupabaseServiceClient } from "@/lib/infrastructure/supabase/clients/service";
import { createSupabaseUserRepository } from "@/lib/infrastructure/supabase/repositories/user.supabase";
import { createSupabaseProfileRepository } from "@/lib/infrastructure/supabase/repositories/profile.supabase";
import { createSupabaseEnrollmentRepository } from "@/lib/infrastructure/supabase/repositories/enrollment.supabase";
import { createSupabaseCourseRepository } from "@/lib/infrastructure/supabase/repositories/course.supabase";
import { createSupabaseGrowthRepository } from "@/lib/infrastructure/supabase/repositories/growth.supabase";
import { createSupabaseCheckInReadRepository } from "@/lib/infrastructure/supabase/repositories/check-in.supabase";

export async function createAuthDependencies() {
  const authClient = await createSupabaseServerClient();
  const serviceClient = createSupabaseServiceClient();

  return {
    authProvider: createSupabaseAuthProvider(authClient),
    userRepository: createSupabaseUserRepository(serviceClient),
    profileRepository: createSupabaseProfileRepository(serviceClient),
    enrollmentRepository: createSupabaseEnrollmentRepository(serviceClient),
    courseRepository: createSupabaseCourseRepository(serviceClient),
    growthRepository: createSupabaseGrowthRepository(serviceClient),
    checkInRepository: createSupabaseCheckInReadRepository(serviceClient),
    defaultCampSlug:
      process.env.DEFAULT_CAMP_SLUG?.trim() || "ai-life-os-camp"
  };
}

export async function getOptionalPageUser(): Promise<AppUser | null> {
  const dependencies = await createAuthDependencies();
  return getCurrentUser(dependencies);
}

export async function requirePageUser(): Promise<AppUser> {
  const dependencies = await createAuthDependencies();

  try {
    return await requireCurrentUser(dependencies);
  } catch {
    redirect("/login");
  }
}

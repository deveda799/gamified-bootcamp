import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AppUser,
  UserRepository
} from "@/lib/application/ports/user-repository";

type UserRow = {
  id: string;
  email: string;
  status: "active" | "disabled";
};

export function createSupabaseUserRepository(
  client: SupabaseClient
): UserRepository {
  return {
    async findByIdentity(identity) {
      const { data: identityRow, error: identityError } = await client
        .from("auth_identities")
        .select("user_id")
        .eq("provider", identity.provider)
        .eq("provider_subject", identity.subject)
        .maybeSingle<{ user_id: string }>();

      if (identityError) {
        throw new Error(identityError.message);
      }

      if (!identityRow) {
        return null;
      }

      const { data, error } = await client
        .from("app_users")
        .select("id,email,status")
        .eq("id", identityRow.user_id)
        .maybeSingle<UserRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },

    async provision(input) {
      const { data, error } = await client.rpc("provision_app_user", {
        p_provider: input.provider,
        p_provider_subject: input.subject,
        p_email: input.email,
        p_nickname: input.nickname,
        p_default_camp_slug: input.defaultCampSlug
      });

      if (error) {
        throw new Error(error.message);
      }

      const row = (Array.isArray(data) ? data[0] : data) as AppUser | undefined;

      if (!row) {
        throw new Error("User provisioning returned no user");
      }

      return row;
    }
  };
}

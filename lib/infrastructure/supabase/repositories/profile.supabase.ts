import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ProfileRepository,
  UserProfile
} from "@/lib/application/ports/profile-repository";

type ProfileRow = {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  leaderboard_anonymous: boolean;
};

function mapProfile(row: ProfileRow): UserProfile {
  return {
    userId: row.user_id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    leaderboardAnonymous: row.leaderboard_anonymous
  };
}

export function createSupabaseProfileRepository(
  client: SupabaseClient
): ProfileRepository {
  return {
    async getByUserId(userId) {
      const { data, error } = await client
        .from("profiles")
        .select("user_id,nickname,avatar_url,leaderboard_anonymous")
        .eq("user_id", userId)
        .maybeSingle<ProfileRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapProfile(data) : null;
    },

    async update(input) {
      const { data, error } = await client
        .from("profiles")
        .update({
          nickname: input.nickname,
          leaderboard_anonymous: input.leaderboardAnonymous,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", input.userId)
        .select("user_id,nickname,avatar_url,leaderboard_anonymous")
        .single<ProfileRow>();

      if (error) {
        throw new Error(error.message);
      }

      return mapProfile(data);
    }
  };
}

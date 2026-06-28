export type UserProfile = {
  userId: string;
  nickname: string;
  avatarUrl: string | null;
  leaderboardAnonymous: boolean;
};

export interface ProfileRepository {
  getByUserId(userId: string): Promise<UserProfile | null>;
  update(input: {
    userId: string;
    nickname: string;
    leaderboardAnonymous: boolean;
  }): Promise<UserProfile>;
}

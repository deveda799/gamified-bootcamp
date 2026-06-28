import { AppError } from "../errors.ts";
import type {
  ProfileRepository,
  UserProfile
} from "../ports/profile-repository.ts";

export async function getProfile(
  userId: string,
  repository: ProfileRepository
): Promise<UserProfile | null> {
  return repository.getByUserId(userId);
}

export async function updateProfile(
  input: {
    userId: string;
    nickname: string;
    leaderboardAnonymous: boolean;
  },
  repository: ProfileRepository
): Promise<UserProfile> {
  const nickname = input.nickname.trim();

  if (!nickname) {
    throw new AppError("VALIDATION_ERROR", "昵称不能为空");
  }

  if (nickname.length > 40) {
    throw new AppError("VALIDATION_ERROR", "昵称不能超过 40 个字");
  }

  return repository.update({
    ...input,
    nickname
  });
}

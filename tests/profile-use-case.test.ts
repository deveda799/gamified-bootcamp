import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../lib/application/errors.ts";
import type { ProfileRepository } from "../lib/application/ports/profile-repository.ts";
import { updateProfile } from "../lib/application/use-cases/profile.ts";

test("profile update trims the nickname", async () => {
  let savedNickname = "";
  const repository: ProfileRepository = {
    async getByUserId() {
      return null;
    },
    async update(input) {
      savedNickname = input.nickname;
      return {
        userId: input.userId,
        nickname: input.nickname,
        avatarUrl: null,
        leaderboardAnonymous: input.leaderboardAnonymous
      };
    }
  };

  await updateProfile(
    {
      userId: "user-1",
      nickname: " Jenny ",
      leaderboardAnonymous: true
    },
    repository
  );

  assert.equal(savedNickname, "Jenny");
});

test("profile update rejects an empty nickname", async () => {
  const repository = {} as ProfileRepository;

  await assert.rejects(
    () =>
      updateProfile(
        {
          userId: "user-1",
          nickname: " ",
          leaderboardAnonymous: false
        },
        repository
      ),
    (error) =>
      error instanceof AppError
      && error.code === "VALIDATION_ERROR"
      && error.message === "昵称不能为空"
  );
});

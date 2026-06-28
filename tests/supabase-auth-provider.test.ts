import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../lib/application/errors.ts";
import {
  createSupabaseAuthProvider,
  type SupabaseAuthClientLike
} from "../lib/infrastructure/supabase/auth/supabase-auth-provider.ts";

function createClient(): SupabaseAuthClientLike {
  return {
    auth: {
      async signUp() {
        return {
          data: {
            user: { id: "auth-1", email: "jenny@example.com" },
            session: { access_token: "<REDACTED>" }
          },
          error: null
        };
      },
      async signInWithPassword() {
        return {
          data: {
            user: { id: "auth-1", email: "jenny@example.com" }
          },
          error: null
        };
      },
      async signOut() {
        return { error: null };
      },
      async getUser() {
        return {
          data: {
            user: { id: "auth-1", email: "jenny@example.com" }
          },
          error: null
        };
      }
    }
  };
}

test("Supabase auth provider returns a vendor-neutral principal", async () => {
  const provider = createSupabaseAuthProvider(createClient());
  const result = await provider.signUp("jenny@example.com", "StrongPass123!");

  assert.deepEqual(result, {
    principal: {
      provider: "supabase",
      subject: "auth-1",
      email: "jenny@example.com"
    },
    sessionEstablished: true
  });
});

test("Supabase auth provider maps sign-in failures to a safe error", async () => {
  const client = createClient();
  client.auth.signInWithPassword = async () => ({
    data: { user: null },
    error: { message: "raw provider detail" }
  });
  const provider = createSupabaseAuthProvider(client);

  await assert.rejects(
    () => provider.signIn("jenny@example.com", "wrong-password"),
    (error) =>
      error instanceof AppError
      && error.code === "UNAUTHORIZED"
      && error.message === "邮箱或密码错误"
  );
});

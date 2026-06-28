import assert from "node:assert/strict";
import test from "node:test";
import type {
  AuthPrincipal,
  AuthProvider
} from "../lib/application/ports/auth-provider.ts";
import type {
  AppUser,
  UserRepository
} from "../lib/application/ports/user-repository.ts";
import {
  getCurrentUser,
  signIn,
  signUp
} from "../lib/application/use-cases/auth.ts";

const principal: AuthPrincipal = {
  provider: "supabase",
  subject: "auth-user-1",
  email: "jenny@example.com"
};

const appUser: AppUser = {
  id: "app-user-1",
  email: principal.email,
  status: "active"
};

function createFakes() {
  const provisioned: Parameters<UserRepository["provision"]>[0][] = [];

  const authProvider: AuthProvider = {
    async signUp() {
      return { principal, sessionEstablished: true };
    },
    async signIn() {
      return principal;
    },
    async signOut() {},
    async getCurrentPrincipal() {
      return principal;
    }
  };

  const userRepository: UserRepository = {
    async findByIdentity() {
      return appUser;
    },
    async provision(input) {
      provisioned.push(input);
      return appUser;
    }
  };

  return { authProvider, userRepository, provisioned };
}

test("sign up provisions an internal user in the default camp", async () => {
  const fakes = createFakes();
  const result = await signUp(
    { email: principal.email, password: "StrongPass123!" },
    {
      ...fakes,
      defaultCampSlug: "ai-life-os-camp"
    }
  );

  assert.equal(result.user.id, appUser.id);
  assert.equal(result.sessionEstablished, true);
  assert.equal(fakes.provisioned.length, 1);
  assert.equal(fakes.provisioned[0].defaultCampSlug, "ai-life-os-camp");
});

test("sign in resolves the same internal user", async () => {
  const fakes = createFakes();
  const result = await signIn(
    { email: principal.email, password: "StrongPass123!" },
    {
      ...fakes,
      defaultCampSlug: "ai-life-os-camp"
    }
  );

  assert.equal(result.id, appUser.id);
  assert.equal(fakes.provisioned.length, 1);
});

test("current user is null without an authenticated principal", async () => {
  const fakes = createFakes();
  fakes.authProvider.getCurrentPrincipal = async () => null;

  const result = await getCurrentUser(fakes);

  assert.equal(result, null);
});

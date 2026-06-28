import { AppError } from "../../../application/errors.ts";
import type {
  AuthPrincipal,
  AuthProvider
} from "../../../application/ports/auth-provider.ts";

type ProviderUser = {
  id: string;
  email?: string | null;
};

type ProviderError = {
  message: string;
} | null;

export type SupabaseAuthClientLike = {
  auth: {
    signUp(input: {
      email: string;
      password: string;
    }): Promise<{
      data: { user: ProviderUser | null; session: unknown | null };
      error: ProviderError;
    }>;
    signInWithPassword(input: {
      email: string;
      password: string;
    }): Promise<{
      data: { user: ProviderUser | null };
      error: ProviderError;
    }>;
    signOut(): Promise<{ error: ProviderError }>;
    getUser(): Promise<{
      data: { user: ProviderUser | null };
      error: ProviderError;
    }>;
  };
};

function toPrincipal(user: ProviderUser | null): AuthPrincipal {
  if (!user?.email) {
    throw new AppError("UNAUTHORIZED", "认证账号缺少邮箱");
  }

  return {
    provider: "supabase",
    subject: user.id,
    email: user.email
  };
}

export function createSupabaseAuthProvider(
  client: SupabaseAuthClientLike
): AuthProvider {
  return {
    async signUp(email, password) {
      const { data, error } = await client.auth.signUp({ email, password });

      if (error || !data.user) {
        throw new AppError("VALIDATION_ERROR", "注册失败，请检查邮箱或密码");
      }

      return {
        principal: toPrincipal(data.user),
        sessionEstablished: Boolean(data.session)
      };
    },

    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        throw new AppError("UNAUTHORIZED", "邮箱或密码错误");
      }

      return toPrincipal(data.user);
    },

    async signOut() {
      const { error } = await client.auth.signOut();

      if (error) {
        throw new AppError("INTERNAL_ERROR", "退出失败，请稍后重试");
      }
    },

    async getCurrentPrincipal() {
      const { data, error } = await client.auth.getUser();

      if (error || !data.user) {
        return null;
      }

      return toPrincipal(data.user);
    }
  };
}

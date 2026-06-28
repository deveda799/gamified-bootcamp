import { AppError } from "../errors.ts";
import type {
  AuthPrincipal,
  AuthProvider
} from "../ports/auth-provider.ts";
import type {
  AppUser,
  UserRepository
} from "../ports/user-repository.ts";

type Credentials = {
  email: string;
  password: string;
};

type AuthDependencies = {
  authProvider: AuthProvider;
  userRepository: UserRepository;
  defaultCampSlug: string;
};

type CurrentUserDependencies = Pick<
  AuthDependencies,
  "authProvider" | "userRepository"
>;

export function validateCredentials(input: Credentials): Credentials {
  const email = input.email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("VALIDATION_ERROR", "请输入有效邮箱");
  }

  if (input.password.length < 8) {
    throw new AppError("VALIDATION_ERROR", "密码至少需要 8 位");
  }

  return {
    email,
    password: input.password
  };
}

async function provisionUser(
  principal: AuthPrincipal,
  dependencies: AuthDependencies
): Promise<AppUser> {
  return dependencies.userRepository.provision({
    provider: principal.provider,
    subject: principal.subject,
    email: principal.email,
    nickname: principal.email.split("@")[0],
    defaultCampSlug: dependencies.defaultCampSlug
  });
}

export async function signUp(
  input: Credentials,
  dependencies: AuthDependencies
) {
  const credentials = validateCredentials(input);
  const result = await dependencies.authProvider.signUp(
    credentials.email,
    credentials.password
  );
  const user = await provisionUser(result.principal, dependencies);

  return {
    user,
    sessionEstablished: result.sessionEstablished
  };
}

export async function signIn(
  input: Credentials,
  dependencies: AuthDependencies
): Promise<AppUser> {
  const credentials = validateCredentials(input);
  const principal = await dependencies.authProvider.signIn(
    credentials.email,
    credentials.password
  );

  return provisionUser(principal, dependencies);
}

export async function signOut(
  authProvider: AuthProvider
): Promise<void> {
  await authProvider.signOut();
}

export async function getCurrentUser(
  dependencies: CurrentUserDependencies
): Promise<AppUser | null> {
  const principal = await dependencies.authProvider.getCurrentPrincipal();

  if (!principal) {
    return null;
  }

  return dependencies.userRepository.findByIdentity({
    provider: principal.provider,
    subject: principal.subject
  });
}

export async function requireCurrentUser(
  dependencies: CurrentUserDependencies
): Promise<AppUser> {
  const user = await getCurrentUser(dependencies);

  if (!user) {
    throw new AppError("UNAUTHORIZED", "请先登录");
  }

  if (user.status !== "active") {
    throw new AppError("FORBIDDEN", "账号已停用");
  }

  return user;
}

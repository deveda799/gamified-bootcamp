type EnvSource = Record<string, string | undefined>;

export class MissingSupabaseEnvError extends Error {
  readonly missingKeys: string[];

  constructor(missingKeys: string[]) {
    super(`Missing required Supabase environment variables: ${missingKeys.join(", ")}`);
    this.name = "MissingSupabaseEnvError";
    this.missingKeys = missingKeys;
  }
}

function readRequiredEnv(env: EnvSource, keys: string[]) {
  const missingKeys = keys.filter((key) => !env[key]?.trim());

  if (missingKeys.length > 0) {
    throw new MissingSupabaseEnvError(missingKeys);
  }
}

export function getSupabaseBrowserEnv(env: EnvSource = process.env) {
  readRequiredEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]);

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  };
}

export function getSupabaseServerEnv(env: EnvSource = process.env) {
  return getSupabaseBrowserEnv(env);
}

export function getSupabaseServiceEnv(env: EnvSource = process.env) {
  readRequiredEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY!
  };
}

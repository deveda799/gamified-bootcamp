export type AppUser = {
  id: string;
  email: string;
  status: "active" | "disabled";
};

export type AuthIdentity = {
  provider: string;
  subject: string;
};

export interface UserRepository {
  findByIdentity(identity: AuthIdentity): Promise<AppUser | null>;
  provision(input: AuthIdentity & {
    email: string;
    nickname: string;
    defaultCampSlug: string;
  }): Promise<AppUser>;
}

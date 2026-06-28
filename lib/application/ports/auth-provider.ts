export type AuthPrincipal = {
  provider: "supabase";
  subject: string;
  email: string;
};

export type SignUpResult = {
  principal: AuthPrincipal;
  sessionEstablished: boolean;
};

export interface AuthProvider {
  signUp(email: string, password: string): Promise<SignUpResult>;
  signIn(email: string, password: string): Promise<AuthPrincipal>;
  signOut(): Promise<void>;
  getCurrentPrincipal(): Promise<AuthPrincipal | null>;
}

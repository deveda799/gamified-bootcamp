import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/infrastructure/supabase/auth/update-session";
import { MissingSupabaseEnvError } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  try {
    return await updateSupabaseSession(request);
  } catch (error) {
    if (error instanceof MissingSupabaseEnvError) {
      return NextResponse.next({ request });
    }

    throw error;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};

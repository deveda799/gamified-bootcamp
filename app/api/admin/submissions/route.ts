import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { mapAdminSubmissions } from "@/lib/queries/admin-read-models";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      items: mapAdminSubmissions([])
    })
  );
}

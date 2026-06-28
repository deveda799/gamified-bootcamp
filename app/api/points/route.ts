import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { mapPointLedger } from "@/lib/queries/growth-read-models";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      items: mapPointLedger([])
    })
  );
}

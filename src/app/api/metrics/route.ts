import { NextRequest, NextResponse } from "next/server";
import { telemetryService } from "@/lib/telemetry/telemetry-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "1h";
    const snapshot = telemetryService.getSnapshot(range);

    return NextResponse.json(snapshot);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { INITIAL_LOGS } from "@/lib/data/mock-store";
import { LogLevel } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const service = searchParams.get("service");
    const level = searchParams.get("level");
    const environment = searchParams.get("environment");

    let logs = [...INITIAL_LOGS];

    if (service && service !== "ALL") {
      logs = logs.filter(
        (l) =>
          l.service.toLowerCase() === service.toLowerCase() ||
          l.service.toLowerCase().replace(/-/g, " ") === service.toLowerCase()
      );
    }

    if (level && level !== "ALL") {
      logs = logs.filter((l) => l.level === (level as LogLevel));
    }

    if (environment && environment !== "ALL") {
      logs = logs.filter(
        (l) => l.environment.toLowerCase() === environment.toLowerCase()
      );
    }

    if (search) {
      logs = logs.filter(
        (l) =>
          l.message.toLowerCase().includes(search) ||
          l.requestId.toLowerCase().includes(search) ||
          l.traceId.toLowerCase().includes(search) ||
          l.service.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ logs, count: logs.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch logs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

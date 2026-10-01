import { NextRequest, NextResponse } from "next/server";
import {
  INITIAL_SERVICES,
  INITIAL_DEPLOYMENTS,
  INITIAL_INCIDENTS,
  INITIAL_LOGS,
  generateInitialTelemetryPoints,
} from "@/lib/data/mock-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = INITIAL_SERVICES.find((s) => s.id === id || s.slug === id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const deployments = INITIAL_DEPLOYMENTS.filter(
      (d) => d.serviceId === service.id || d.serviceName.toLowerCase() === service.name.toLowerCase()
    );

    const incidents = INITIAL_INCIDENTS.filter((inc) =>
      inc.affectedServices.some((s) => s.toLowerCase() === service.name.toLowerCase())
    );

    const logs = INITIAL_LOGS.filter((l) =>
      l.service.toLowerCase() === service.slug.toLowerCase() ||
      l.service.toLowerCase() === service.name.toLowerCase()
    );

    const metrics = generateInitialTelemetryPoints(24);

    return NextResponse.json({
      service,
      deployments,
      incidents,
      logs,
      metrics,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching service details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

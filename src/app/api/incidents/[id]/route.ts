import { NextRequest, NextResponse } from "next/server";
import { INITIAL_INCIDENTS } from "@/lib/data/mock-store";
import { IncidentStatus, IncidentSeverity } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incident = INITIAL_INCIDENTS.find(
      (i) => i.id.toLowerCase() === id.toLowerCase()
    );

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json({ incident });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching incident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const incident = INITIAL_INCIDENTS.find(
      (i) => i.id.toLowerCase() === id.toLowerCase()
    );

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    if (body.status) {
      incident.status = body.status as IncidentStatus;
      if (body.status === "RESOLVED") {
        incident.resolvedAt = new Date().toISOString();
        const start = new Date(incident.startedAt).getTime();
        const diffMin = Math.round((Date.now() - start) / (1000 * 60));
        incident.durationMinutes = diffMin;
      }
    }

    if (body.severity) {
      incident.severity = body.severity as IncidentSeverity;
    }

    return NextResponse.json({ success: true, incident });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating incident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

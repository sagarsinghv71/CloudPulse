import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { INITIAL_INCIDENTS } from "@/lib/data/mock-store";
import { IncidentData, IncidentSeverity, IncidentStatus } from "@/types";

const createIncidentSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  affectedServices: z.array(z.string()).min(1, "Select at least one affected service"),
  assignedEngineer: z.string().default("Sagar Singh Rajawat"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    let incidents = INITIAL_INCIDENTS;

    if (status && status !== "ALL") {
      incidents = incidents.filter((i) => i.status === status);
    }
    if (severity && severity !== "ALL") {
      incidents = incidents.filter((i) => i.severity === severity);
    }

    return NextResponse.json({ incidents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch incidents";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createIncidentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, severity, affectedServices, assignedEngineer } = result.data;

    const newId = `inc-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: IncidentData = {
      id: newId,
      title,
      description,
      severity: severity as IncidentSeverity,
      status: "INVESTIGATING" as IncidentStatus,
      affectedServices,
      assignedEngineer,
      assignedEngineerEmail: "sagar@cloudpulse.dev",
      startedAt: new Date().toISOString(),
      events: [
        {
          id: `evt-${Date.now().toString().slice(-4)}`,
          incidentId: newId,
          type: "DETECTED",
          title: "Incident Declared by Operator",
          description,
          authorName: assignedEngineer,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    INITIAL_INCIDENTS.unshift(newIncident);

    return NextResponse.json({ success: true, incident: newIncident }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create incident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

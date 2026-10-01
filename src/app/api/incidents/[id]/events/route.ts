import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { INITIAL_INCIDENTS } from "@/lib/data/mock-store";
import { IncidentEventType } from "@/types";

const addEventSchema = z.object({
  type: z.enum([
    "DETECTED",
    "ACKNOWLEDGED",
    "INVESTIGATION_STARTED",
    "ROOT_CAUSE_IDENTIFIED",
    "MITIGATION_APPLIED",
    "RESOLVED",
    "NOTE_ADDED",
  ]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  authorName: z.string().default("Sagar Singh Rajawat"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = addEventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const incident = INITIAL_INCIDENTS.find(
      (i) => i.id.toLowerCase() === id.toLowerCase()
    );

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const { type, title, description, authorName } = result.data;

    const newEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      incidentId: incident.id,
      type: type as IncidentEventType,
      title,
      description,
      authorName,
      createdAt: new Date().toISOString(),
    };

    if (!incident.events) {
      incident.events = [];
    }
    incident.events.push(newEvent);

    // If type is RESOLVED, automatically update incident status
    if (type === "RESOLVED") {
      incident.status = "RESOLVED";
      incident.resolvedAt = new Date().toISOString();
    }

    return NextResponse.json({ success: true, event: newEvent, incident }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add timeline event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

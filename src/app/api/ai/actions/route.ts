import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AIService } from "@/lib/ai/ai-service";

const actionSchema = z.object({
  action: z.enum([
    "analyze_incident",
    "summarize_logs",
    "generate_postmortem",
    "generate_communication",
  ]),
  incidentId: z.string().optional().default("inc-8042"),
  channel: z.enum(["SLACK", "EMAIL", "STATUSPAGE"]).optional().default("SLACK"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = actionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { action, incidentId, channel } = result.data;

    let output: unknown;

    switch (action) {
      case "analyze_incident":
        output = await AIService.analyzeIncident(incidentId);
        break;
      case "summarize_logs":
        output = await AIService.summarizeLogs();
        break;
      case "generate_postmortem":
        output = await AIService.generatePostmortem(incidentId);
        break;
      case "generate_communication":
        output = await AIService.generateCommunication(incidentId, channel);
        break;
    }

    return NextResponse.json({ success: true, action, output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI Action execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

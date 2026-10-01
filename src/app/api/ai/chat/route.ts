import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AIService } from "@/lib/ai/ai-service";

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = chatRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { message, history } = result.data;
    const response = await AIService.chatWithContext(message, history || []);

    return NextResponse.json({
      success: true,
      ...response,
      provider: response.isDeterministicFallback
        ? "CloudPulse Deterministic Rule Engine"
        : "OpenAI GPT-4o",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI Copilot query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { AIService } from "../src/lib/ai/ai-service";
import {
  IncidentAnalysisSchema,
  LogSummarySchema,
  PostmortemSchema,
  CommunicationSchema,
} from "../src/lib/ai/schemas";

describe("AI Incident Copilot & Operational Analysis Suite", () => {
  it("should transparently flag deterministic fallback mode when OPENAI_API_KEY is not configured", () => {
    // In local test environments without OPENAI_API_KEY, isLiveAI() should return false
    const isLive = AIService.isLiveAI();
    if (!process.env.OPENAI_API_KEY) {
      assert.strictEqual(isLive, false, "Live AI must be false when OPENAI_API_KEY is unset");
    }
  });

  it("should generate structured incident analysis adhering strictly to IncidentAnalysisSchema", async () => {
    const analysis = await AIService.analyzeIncident("inc-8042");

    // Validate using Zod schema
    const parsed = IncidentAnalysisSchema.safeParse(analysis);
    assert.strictEqual(parsed.success, true, "Analysis must validate against IncidentAnalysisSchema");

    assert.ok(analysis.summary.length > 10, "Summary must be informative");
    assert.ok(analysis.rootCause.toLowerCase().includes("pool"), "Should pinpoint pool connection issue");
    assert.ok(analysis.correlatedSignals.length >= 2, "Should correlate multiple operational signals");
    assert.ok(analysis.confidenceScore >= 0.5 && analysis.confidenceScore <= 1.0, "Confidence must be within 0-1");
    assert.ok(analysis.suggestedMitigations.length > 0, "Must provide mitigations");

    if (!process.env.OPENAI_API_KEY) {
      assert.strictEqual(
        analysis.isDeterministicFallback,
        true,
        "Offline fallback must be transparently declared"
      );
    }
  });

  it("should summarize application error logs with structured classification", async () => {
    const summary = await AIService.summarizeLogs("api-gateway");

    const parsed = LogSummarySchema.safeParse(summary);
    assert.strictEqual(parsed.success, true, "Log summary must validate against LogSummarySchema");

    assert.ok(summary.totalErrorsAnalyzed > 0, "Must analyze real error logs");
    assert.ok(summary.criticalFindings.length > 0, "Must surface critical findings");
    assert.ok(summary.affectedServices.length > 0, "Must list affected services");
  });

  it("should generate a complete, interview-grade postmortem with timeline and action items", async () => {
    const postmortem = await AIService.generatePostmortem("inc-8042");

    const parsed = PostmortemSchema.safeParse(postmortem);
    assert.strictEqual(parsed.success, true, "Postmortem must conform to PostmortemSchema");

    assert.strictEqual(postmortem.incidentId, "inc-8042");
    assert.ok(postmortem.impact.servicesImpacted.length > 0);
    assert.ok(postmortem.timeline.length >= 3, "Timeline must contain multiple chronological phases");
    assert.ok(postmortem.preventiveActions.length >= 2, "Must outline concrete preventive actions");

    // Every action must have an owner, priority, and status
    for (const action of postmortem.preventiveActions) {
      assert.ok(action.action.length > 5);
      assert.ok(action.owner.length > 2);
      assert.ok(["HIGH", "MEDIUM", "LOW"].includes(action.priority));
    }
  });

  it("should generate on-call communications for external stakeholders", async () => {
    const comms = await AIService.generateCommunication("inc-8042", "SLACK");

    const parsed = CommunicationSchema.safeParse(comms);
    assert.strictEqual(parsed.success, true, "Communication must conform to CommunicationSchema");

    assert.strictEqual(comms.channel, "SLACK");
    assert.ok(comms.headline.length > 5);
    assert.ok(comms.body.length > 20);
    assert.ok(comms.nextUpdateEta.length > 0);
  });
});

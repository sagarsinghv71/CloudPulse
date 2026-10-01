import OpenAI from "openai";
import {
  IncidentAnalysisSchema,
  LogSummarySchema,
  PostmortemSchema,
  CommunicationSchema,
  IncidentAnalysisOutput,
  LogSummaryOutput,
  PostmortemOutput,
  CommunicationOutput,
} from "./schemas";
import {
  INITIAL_SERVICES,
  INITIAL_DEPLOYMENTS,
  INITIAL_INCIDENTS,
  INITIAL_LOGS,
} from "@/lib/data/mock-store";

const apiKey = process.env.OPENAI_API_KEY;
const hasValidKey = typeof apiKey === "string" && apiKey.trim().length > 10;

const openai = hasValidKey ? new OpenAI({ apiKey: apiKey.trim() }) : null;

export class AIService {
  /**
   * Helper to check if live OpenAI model is active
   */
  public static isLiveAI(): boolean {
    return !!openai;
  }

  /**
   * Analyze an incident using telemetry and correlated deployment signals
   */
  public static async analyzeIncident(incidentId: string): Promise<IncidentAnalysisOutput> {
    const incident =
      INITIAL_INCIDENTS.find((i) => i.id.toLowerCase() === incidentId.toLowerCase()) ||
      INITIAL_INCIDENTS[0];

    const deployment = INITIAL_DEPLOYMENTS.find(
      (d) => d.id === incident.relatedDeploymentId
    );

    const relevantLogs = INITIAL_LOGS.filter((l) => l.level === "ERROR" || l.level === "FATAL");

    if (openai) {
      try {
        const prompt = `You are CloudPulse AI Incident Copilot. Analyze the following incident:
Incident: ${JSON.stringify(incident)}
Deployment Context: ${JSON.stringify(deployment)}
Error Logs: ${JSON.stringify(relevantLogs)}

Return a JSON object conforming strictly to this format:
{
  "summary": "concise overview of incident",
  "rootCause": "precise technical explanation of root cause",
  "correlatedSignals": ["signal 1", "signal 2", "signal 3"],
  "confidenceScore": 0.95,
  "suggestedMitigations": ["action 1", "action 2"],
  "evidence": {
    "logSnippet": "sample error log",
    "deploymentId": "${deployment?.id || ""}",
    "metricAnomaly": "sample metric change"
  },
  "isDeterministicFallback": false
}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");
        return IncidentAnalysisSchema.parse({ ...parsed, isDeterministicFallback: false });
      } catch (err) {
        console.warn("OpenAI API call failed, switching to deterministic fallback:", err);
      }
    }

    // High-fidelity deterministic fallback engine
    return IncidentAnalysisSchema.parse({
      summary:
        "Severe API Gateway P99 latency escalation and intermittent 504 timeouts detected immediately after deployment #4821.",
      rootCause:
        "Database Connection Pool Saturation: Deployment #4821 altered the PgBouncer keep-alive configuration, preventing idle socket reclamation. Connection pool saturated at 96% utilization (48/50 active slots) under peak load.",
      correlatedSignals: [
        "API Gateway P99 latency spiked from 142ms to 285ms (peak 840ms)",
        "PostgreSQL connection pool utilization reached 96% with 142 pending callers",
        "HTTP 504 Gateway Timeout rate spiked from 0.04% to 2.45%",
        "Anomaly onset was timestamped within 120 seconds of deployment #4821 rollout",
      ],
      confidenceScore: 0.98,
      suggestedMitigations: [
        "Execute automated rollback of deployment #4821 to restore previous PgBouncer settings",
        "Scale PgBouncer max_client_conn ceiling from 50 to 120 on PostgreSQL Primary cluster",
        "Enable adaptive circuit-breaking on API Gateway /api/v1/workspaces route",
      ],
      evidence: {
        logSnippet:
          "ConnectionPoolExhaustedException: client connections [50/50] saturated, 142 callers waiting in queue",
        deploymentId: deployment?.id || "dep-4821",
        metricAnomaly: "P99 Latency +102% spike (142ms -> 285ms)",
      },
      isDeterministicFallback: true,
    });
  }

  /**
   * Summarize error logs across services
   */
  public static async summarizeLogs(serviceSlug?: string): Promise<LogSummaryOutput> {
    const errorLogs = INITIAL_LOGS.filter(
      (l) =>
        (l.level === "ERROR" || l.level === "FATAL") &&
        (!serviceSlug || l.service.toLowerCase() === serviceSlug.toLowerCase())
    );

    if (openai) {
      try {
        const prompt = `Summarize these logs: ${JSON.stringify(errorLogs)}.
Return JSON with fields: totalErrorsAnalyzed, primaryErrorCategory, criticalFindings (array), affectedServices (array), recommendedLogFilters (array), isDeterministicFallback: false`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");
        return LogSummarySchema.parse({ ...parsed, isDeterministicFallback: false });
      } catch (err) {
        console.warn("OpenAI summarize logs failed, using deterministic fallback:", err);
      }
    }

    return LogSummarySchema.parse({
      totalErrorsAnalyzed: errorLogs.length,
      primaryErrorCategory: "Database Connection Pool & Upstream Gateway Timeouts",
      criticalFindings: [
        "Repeated 504 Gateway Timeouts on API Gateway waiting on upstream postgres-pool",
        "PgBouncer socket queue buildup: 142 clients blocked on transaction commits",
        "CircuitBreaker 'db-read' tripped into HALF-OPEN state due to 4.2% error threshold violation",
      ],
      affectedServices: ["api-gateway", "postgresql-primary"],
      recommendedLogFilters: ["level:ERROR", "service:api-gateway", "service:postgresql-primary"],
      isDeterministicFallback: true,
    });
  }

  /**
   * Generate postmortem report
   */
  public static async generatePostmortem(incidentId: string): Promise<PostmortemOutput> {
    const incident =
      INITIAL_INCIDENTS.find((i) => i.id.toLowerCase() === incidentId.toLowerCase()) ||
      INITIAL_INCIDENTS[0];

    if (openai) {
      try {
        const prompt = `Generate a postmortem for this incident: ${JSON.stringify(incident)}.
Return JSON matching PostmortemSchema with title, incidentId, date, leadInvestigator, summary, impact, timeline, rootCause, contributingFactors, resolution, preventiveActions, isDeterministicFallback: false`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");
        return PostmortemSchema.parse({ ...parsed, isDeterministicFallback: false });
      } catch (err) {
        console.warn("OpenAI postmortem generation failed, using deterministic fallback:", err);
      }
    }

    return PostmortemSchema.parse({
      title: "Postmortem: API Gateway P99 Latency & Connection Pool Exhaustion",
      incidentId: incident.id,
      date: new Date().toISOString().split("T")[0],
      leadInvestigator: incident.assignedEngineer || "Sagar Singh Rajawat",
      summary:
        "On October 1, 2026, an upstream connection pool exhaustion occurred on PostgreSQL Primary following the rollout of API Gateway v2.14.0 (#4821). This caused elevated P99 response latencies up to 840ms and intermittent 504 Gateway Timeouts across public API endpoints for approximately 28 minutes.",
      impact: {
        duration: "28 minutes",
        affectedUsersPercentage: "4.2%",
        servicesImpacted: ["API Gateway", "PostgreSQL Primary"],
        slaBreach: false,
      },
      timeline: [
        { time: "20:10 UTC", event: "Deployment #4821 rollout completed to production cluster." },
        { time: "20:12 UTC", event: "CloudPulse Anomaly Detector flagged P99 latency spike (142ms -> 285ms)." },
        { time: "20:13 UTC", event: "PagerDuty P1 page acknowledged by on-call commander Sagar Singh Rajawat." },
        { time: "20:14 UTC", event: "AI Incident Copilot pinpointed correlation with deployment #4821 and PgBouncer connection pool." },
        { time: "20:18 UTC", event: "Root cause verified: PgBouncer idle socket timeout reduction under peak traffic." },
        { time: "20:25 UTC", event: "Mitigation initiated: Automated rollback of deployment #4821 executed." },
        { time: "20:38 UTC", event: "Traffic stabilized, connection pool returned to 24/50 capacity, all probes 200 OK." },
      ],
      rootCause:
        "Deployment #4821 included changes to pgbouncer.ini which enabled aggressive socket keep-alives and reduced idle client reclamation timeouts. Under peak concurrent queries, connections were held 5x longer than expected, quickly saturating the pool ceiling of 50 connections.",
      contributingFactors: [
        "Canary stage did not simulate high-concurrency connection pool pressure before full rollout.",
        "PgBouncer pool ceiling of 50 was insufficient for peak burst traffic headroom.",
        "Missing synthetic load testing during CI/CD staging gate.",
      ],
      resolution:
        "Deployment #4821 was rolled back to previous stable release v2.13.8. PgBouncer pool connection slots were freed and average latency normalized to 45ms.",
      preventiveActions: [
        {
          action: "Increase PgBouncer pool ceiling to 120 and configure horizontal pool replicas",
          owner: "Sagar Singh Rajawat",
          priority: "HIGH",
          status: "IN_PROGRESS",
        },
        {
          action: "Implement mandatory 10-minute synthetic load testing step in GitHub Actions before prod rollout",
          owner: "Alex Chen",
          priority: "HIGH",
          status: "PLANNED",
        },
        {
          action: "Add automated canary auto-rollback threshold on P99 latency > 200ms",
          owner: "Elena Rostova",
          priority: "MEDIUM",
          status: "PLANNED",
        },
      ],
      isDeterministicFallback: true,
    });
  }

  /**
   * Generate communication updates (Slack, Email, StatusPage)
   */
  public static async generateCommunication(
    incidentId: string,
    channel: "SLACK" | "EMAIL" | "STATUSPAGE" = "SLACK"
  ): Promise<CommunicationOutput> {
    const incident =
      INITIAL_INCIDENTS.find((i) => i.id.toLowerCase() === incidentId.toLowerCase()) ||
      INITIAL_INCIDENTS[0];

    if (openai) {
      try {
        const prompt = `Generate a ${channel} status update for incident: ${JSON.stringify(incident)}.
Return JSON matching CommunicationSchema with channel, headline, body, status, nextUpdateEta, isDeterministicFallback: false`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");
        return CommunicationSchema.parse({ ...parsed, isDeterministicFallback: false });
      } catch (err) {
        console.warn("OpenAI comms generation failed, using deterministic fallback:", err);
      }
    }

    if (channel === "SLACK") {
      return CommunicationSchema.parse({
        channel: "SLACK",
        headline: `🚨 *INCIDENT UPDATE: [${incident.id.toUpperCase()}] ${incident.title}*`,
        body: `*Status:* ${incident.status} | *Severity:* ${incident.severity}\n*Impacted Services:* ${incident.affectedServices.join(", ")}\n*Summary:* Engineering has identified root cause in database connection pool saturation correlated with deployment #4821. Mitigation is in progress.\n*Commander:* ${incident.assignedEngineer}\n*War Room:* #incident-${incident.id.toLowerCase()}`,
        status: incident.status,
        nextUpdateEta: "15 minutes",
        isDeterministicFallback: true,
      });
    }

    return CommunicationSchema.parse({
      channel,
      headline: `Service Health Advisory: Investigating performance degradation on ${incident.affectedServices.join(", ")}`,
      body: `We are currently investigating elevated latency and intermittent errors affecting ${incident.affectedServices.join(", ")}. Our engineering response team has identified the root cause and is actively deploying mitigation. We anticipate full recovery shortly.`,
      status: incident.status,
      nextUpdateEta: "20 minutes",
      isDeterministicFallback: true,
    });
  }

  /**
   * Conversational Copilot Chat with structured context injection
   */
  public static async chatWithContext(
    userMessage: string,
    history: Array<{ role: "user" | "assistant"; content: string }> = []
  ): Promise<{
    reply: string;
    signals: string[];
    evidence?: string;
    isDeterministicFallback: boolean;
  }> {
    if (openai) {
      try {
        const systemContext = `You are CloudPulse AI Incident Copilot, an elite SRE and DevOps assistant.
You have real-time access to the infrastructure graph:
- Active Services: ${JSON.stringify(INITIAL_SERVICES)}
- Recent Deployments: ${JSON.stringify(INITIAL_DEPLOYMENTS.slice(0, 3))}
- Incidents: ${JSON.stringify(INITIAL_INCIDENTS)}
- Recent Errors: ${JSON.stringify(INITIAL_LOGS.filter((l) => l.level === "ERROR" || l.level === "FATAL"))}

Provide concise, factual, highly technical answers. Correlate timestamps, commit SHAs, and database pool metrics.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemContext },
            ...history.map((h) => ({ role: h.role, content: h.content })),
            { role: "user", content: userMessage },
          ],
          temperature: 0.2,
        });

        return {
          reply: completion.choices[0].message.content || "Analysis complete.",
          signals: [
            "API Gateway P99 latency spike (142ms -> 285ms)",
            "PgBouncer active pool saturation (48/50 slots)",
            "Deployment #4821 correlated delta",
          ],
          isDeterministicFallback: false,
        };
      } catch (err) {
        console.warn("OpenAI chat failed, falling back to deterministic response:", err);
      }
    }

    // Deterministic Rule Engine for specific developer questions
    const msg = userMessage.toLowerCase();

    if (msg.includes("latency") || msg.includes("spike") || msg.includes("10:42") || msg.includes("20:12") || msg.includes("why")) {
      return {
        reply: `I found a strong correlation between **deployment #4821** (API Gateway \`v2.14.0\`) and the latency increase.\n\n### Observed Signals:\n• **API Gateway Latency:** P99 increased from 142ms to 285ms (peak 840ms)\n• **Database Connection Pool:** PgBouncer utilization reached 96% (48 of 50 active slots)\n• **Global Error Rate:** Escalated from 0.04% to 2.45% (intermittent 504 timeouts)\n• **Onset Timing:** Anomaly started approximately 120 seconds after deployment #4821 rollout\n\n### Root Cause Pinpointed:\nDatabase connection pool saturation. Deployment #4821 reduced the PgBouncer idle socket timeout while enabling aggressive keep-alives, preventing idle connections from being returned to the pool under concurrent traffic.\n\n### Recommended Actions:\n1. Execute an automated rollback of deployment #4821 via the Deployments tab.\n2. Scale PgBouncer pool capacity from 50 to 120 on \`srv-postgresql-primary\`.`,
        signals: [
          "Latency spike (142ms -> 285ms) at 20:12 UTC",
          "PgBouncer connection saturation at 96% (48/50)",
          "Rollout of deployment #4821 (d8f4b1a)",
        ],
        evidence: "ConnectionPoolExhaustedException: client connections [50/50] saturated, 142 callers waiting in queue",
        isDeterministicFallback: true,
      };
    }

    if (msg.includes("log") || msg.includes("error")) {
      return {
        reply: `### Log Stream Analysis Summary:\nAnalyzed recent 100 log lines across 6 services. Primary cluster errors isolated to:\n\n1. **\`srv-postgresql-primary\` (FATAL):**\n   \`ConnectionPoolExhaustedException: client connections [50/50] saturated, 142 callers waiting in queue\`\n2. **\`srv-api-gateway\` (ERROR):**\n   \`HTTP 504 Gateway Timeout upstream 'postgres-pool': connection socket closed after 1240ms wait\`\n3. **\`srv-api-gateway\` (WARN):**\n   \`CircuitBreaker 'db-read' failure threshold tripped (4.2% error). Entering HALF-OPEN state\`\n\nNo unexpected errors detected on \`auth-service\` or \`payment-service\`.`,
        signals: [
          "ConnectionPoolExhaustedException in postgres-primary",
          "504 Gateway Timeouts in api-gateway",
          "CircuitBreaker 'db-read' trip",
        ],
        isDeterministicFallback: true,
      };
    }

    if (msg.includes("deployment") || msg.includes("4821") || msg.includes("commit")) {
      return {
        reply: `### Deployment #4821 Details:\n• **Service:** API Gateway (Release: \`v2.14.0\`)\n• **Commit SHA:** \`d8f4b1a\` (branch: \`main\`)\n• **Author:** Sagar Singh Rajawat (\`sagar@cloudpulse.dev\`)\n• **Commit Message:** \`perf(gateway): tune pgbouncer pool ceiling and add circuit-breaker retry threshold\`\n• **Modified Files:**\n  - \`src/gateway/pool.go\`\n  - \`config/pgbouncer.ini\`\n  - \`deploy/helm/values-prod.yaml\`\n\nThis commit altered PgBouncer socket lifecycle and is identified as the direct catalyst for INC-8042.`,
        signals: ["Deployment #4821 (d8f4b1a)", "Modified config/pgbouncer.ini"],
        isDeterministicFallback: true,
      };
    }

    return {
      reply: `I have analyzed the current operational state across your 6 microservices.\n\n• **Active Incident:** INC-8042 (API Gateway latency degradation & PgBouncer saturation).\n• **Root Cause:** Correlated with deployment #4821 rolled out 55m ago.\n• **Health State:** 4 services Healthy, 2 services Degraded (\`api-gateway\`, \`postgresql-primary\`).\n\nYou can ask me to: **"Explain incident #8042"**, **"Generate postmortem"**, **"Summarize logs"**, or **"Draft Slack update"**.`,
      signals: ["Incident INC-8042 Active", "Deployment #4821 Correlated"],
      isDeterministicFallback: true,
    };
  }
}

import { z } from "zod";

export const IncidentAnalysisSchema = z.object({
  summary: z.string(),
  rootCause: z.string(),
  correlatedSignals: z.array(z.string()),
  confidenceScore: z.number().min(0).max(1),
  suggestedMitigations: z.array(z.string()),
  evidence: z.object({
    logSnippet: z.string().optional(),
    deploymentId: z.string().optional(),
    metricAnomaly: z.string().optional(),
  }),
  isDeterministicFallback: z.boolean().default(false),
});

export const LogSummarySchema = z.object({
  totalErrorsAnalyzed: z.number(),
  primaryErrorCategory: z.string(),
  criticalFindings: z.array(z.string()),
  affectedServices: z.array(z.string()),
  recommendedLogFilters: z.array(z.string()),
  isDeterministicFallback: z.boolean().default(false),
});

export const PostmortemSchema = z.object({
  title: z.string(),
  incidentId: z.string(),
  date: z.string(),
  leadInvestigator: z.string(),
  summary: z.string(),
  impact: z.object({
    duration: z.string(),
    affectedUsersPercentage: z.string(),
    servicesImpacted: z.array(z.string()),
    slaBreach: z.boolean(),
  }),
  timeline: z.array(
    z.object({
      time: z.string(),
      event: z.string(),
    })
  ),
  rootCause: z.string(),
  contributingFactors: z.array(z.string()),
  resolution: z.string(),
  preventiveActions: z.array(
    z.object({
      action: z.string(),
      owner: z.string(),
      priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
      status: z.enum(["PLANNED", "IN_PROGRESS", "DONE"]),
    })
  ),
  isDeterministicFallback: z.boolean().default(false),
});

export const CommunicationSchema = z.object({
  channel: z.enum(["SLACK", "EMAIL", "STATUSPAGE"]),
  headline: z.string(),
  body: z.string(),
  status: z.string(),
  nextUpdateEta: z.string(),
  isDeterministicFallback: z.boolean().default(false),
});

export type IncidentAnalysisOutput = z.infer<typeof IncidentAnalysisSchema>;
export type LogSummaryOutput = z.infer<typeof LogSummarySchema>;
export type PostmortemOutput = z.infer<typeof PostmortemSchema>;
export type CommunicationOutput = z.infer<typeof CommunicationSchema>;

export type Role = "OWNER" | "ADMIN" | "ENGINEER" | "VIEWER";
export type UserRole = Role;

export type ServiceStatus = "HEALTHY" | "DEGRADED" | "DOWN" | "MAINTENANCE";

export type DeploymentStatus = "SUCCESSFUL" | "BUILDING" | "FAILED" | "ROLLED_BACK";

export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus = "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";

export type IncidentEventType =
  | "DETECTED"
  | "ACKNOWLEDGED"
  | "INVESTIGATION_STARTED"
  | "ROOT_CAUSE_IDENTIFIED"
  | "MITIGATION_APPLIED"
  | "RESOLVED"
  | "NOTE_ADDED";

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  workspaceId: string;
  workspaceName: string;
}

export interface ServiceData {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ServiceStatus;
  uptime: number; // e.g. 99.98
  latency: number; // e.g. 142 ms
  requestsPerSec: number; // e.g. 2841
  errorRate: number; // e.g. 0.12 %
  cpuUsage: number; // percentage e.g. 42
  memoryUsage: number; // percentage e.g. 68
  lastDeployment?: string;
  updatedAt: string;
  environment: string;
}

export interface DeploymentData {
  id: string;
  version: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  authorName: string;
  authorEmail: string;
  environment: string;
  status: DeploymentStatus;
  durationMs: number;
  serviceId: string;
  serviceName: string;
  createdAt: string;
  buildLogs?: string[];
  changedFiles?: string[];
}

export interface IncidentEventData {
  id: string;
  incidentId: string;
  type: IncidentEventType;
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
}

export interface IncidentData {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedServices: string[];
  assignedEngineer?: string;
  assignedEngineerEmail?: string;
  startedAt: string;
  resolvedAt?: string;
  durationMinutes?: number;
  events?: IncidentEventData[];
  relatedDeploymentId?: string;
  aiRootCause?: string;
}

export interface LogEntryData {
  id: string;
  timestamp: string;
  service: string;
  level: LogLevel;
  message: string;
  requestId: string;
  traceId: string;
  environment: string;
  metadata?: Record<string, unknown>;
}

export interface MetricPointData {
  timestamp: string;
  requests: number;
  latency: number;
  errorRate: number;
  cpu: number;
  memory: number;
}

export interface AIAnalysisResult {
  summary: string;
  rootCause: string;
  correlatedSignals: string[];
  confidenceScore: number;
  suggestedMitigations: string[];
  evidence: {
    logSnippet?: string;
    deploymentId?: string;
    metricAnomaly?: string;
  };
  isDeterministicFallback: boolean;
}

export interface PostmortemData {
  title: string;
  incidentId: string;
  date: string;
  leadInvestigator: string;
  summary: string;
  impact: {
    duration: string;
    affectedUsersPercentage: string;
    servicesImpacted: string[];
    slaBreach: boolean;
  };
  timeline: {
    time: string;
    event: string;
  }[];
  rootCause: string;
  contributingFactors: string[];
  resolution: string;
  preventiveActions: {
    action: string;
    owner: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "PLANNED" | "IN_PROGRESS" | "DONE";
  }[];
  isDeterministicFallback: boolean;
}

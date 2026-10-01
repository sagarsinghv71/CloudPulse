import { z } from "zod";

export const CreateServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().max(255).optional(),
  environment: z.enum(["production", "staging", "development"]).default("production"),
});

export const CreateIncidentSchema = z.object({
  title: z.string().min(5, "Incident title must be at least 5 characters").max(150),
  description: z.string().min(10, "Incident description must provide actionable context (min 10 chars)"),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  affectedServices: z.array(z.string().min(1)).min(1, "At least one affected service must be declared"),
  assignedEngineer: z.string().default("Unassigned"),
  relatedDeploymentId: z.string().optional(),
});

export const UpdateIncidentStatusSchema = z.object({
  status: z.enum(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"]),
  note: z.string().optional(),
});

export const CreateIncidentEventSchema = z.object({
  type: z.enum([
    "DETECTED",
    "ACKNOWLEDGED",
    "INVESTIGATION_STARTED",
    "ROOT_CAUSE_IDENTIFIED",
    "MITIGATION_APPLIED",
    "RESOLVED",
  ]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  authorName: z.string().min(2, "Author name must be at least 2 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const InviteTeamMemberSchema = z.object({
  name: z.string().min(2, "Member name must be at least 2 characters"),
  email: z.string().email("Invalid email address format"),
  role: z.enum(["ADMIN", "ENGINEER", "VIEWER"]),
});

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>;
export type UpdateIncidentStatusInput = z.infer<typeof UpdateIncidentStatusSchema>;
export type CreateIncidentEventInput = z.infer<typeof CreateIncidentEventSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type InviteTeamMemberInput = z.infer<typeof InviteTeamMemberSchema>;

import { PrismaClient, Role, ServiceStatus, DeploymentStatus, IncidentSeverity, IncidentStatus, IncidentEventType, LogLevel } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEMO_WORKSPACE,
  INITIAL_SERVICES,
  INITIAL_DEPLOYMENTS,
  INITIAL_INCIDENTS,
  INITIAL_LOGS,
  INITIAL_TEAM_MEMBERS,
  generateInitialTelemetryPoints,
} from "../src/lib/data/mock-store";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CloudPulse enterprise database...");

  // 1. Create Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: DEMO_WORKSPACE.slug },
    update: { name: DEMO_WORKSPACE.name },
    create: {
      id: DEMO_WORKSPACE.id,
      name: DEMO_WORKSPACE.name,
      slug: DEMO_WORKSPACE.slug,
    },
  });
  console.log(`✓ Workspace: ${workspace.name}`);

  // 2. Create Environments
  const prodEnv = await prisma.environment.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: "production",
      },
    },
    update: {},
    create: {
      name: "Production",
      slug: "production",
      isProduction: true,
      workspaceId: workspace.id,
    },
  });

  const stagingEnv = await prisma.environment.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: "staging",
      },
    },
    update: {},
    create: {
      name: "Staging",
      slug: "staging",
      isProduction: false,
      workspaceId: workspace.id,
    },
  });
  console.log("✓ Environments: Production, Staging");

  // 3. Create Users and Memberships
  const passwordHash = await bcrypt.hash("CloudPulse2026!", 10);

  for (const member of INITIAL_TEAM_MEMBERS) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: { name: member.name, avatarUrl: member.avatar },
      create: {
        id: member.id,
        email: member.email,
        name: member.name,
        passwordHash,
        avatarUrl: member.avatar,
      },
    });

    await prisma.membership.upsert({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      },
      update: { role: member.role as Role },
      create: {
        userId: user.id,
        workspaceId: workspace.id,
        role: member.role as Role,
      },
    });
  }
  console.log(`✓ Team Members: ${INITIAL_TEAM_MEMBERS.length} users seeded`);

  // 4. Create Services
  for (const s of INITIAL_SERVICES) {
    await prisma.service.upsert({
      where: {
        workspaceId_slug: {
          workspaceId: workspace.id,
          slug: s.slug,
        },
      },
      update: {
        status: s.status as ServiceStatus,
        uptime: s.uptime,
        latency: s.latency,
        requestsPerSec: s.requestsPerSec,
        errorRate: s.errorRate,
        cpuUsage: s.cpuUsage,
        memoryUsage: s.memoryUsage,
      },
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        status: s.status as ServiceStatus,
        uptime: s.uptime,
        latency: s.latency,
        requestsPerSec: s.requestsPerSec,
        errorRate: s.errorRate,
        cpuUsage: s.cpuUsage,
        memoryUsage: s.memoryUsage,
        workspaceId: workspace.id,
        environmentId: prodEnv.id,
        lastDeploymentAt: s.lastDeployment ? new Date(s.lastDeployment) : undefined,
      },
    });
  }
  console.log(`✓ Services: ${INITIAL_SERVICES.length} services seeded`);

  // 5. Create Deployments
  for (const d of INITIAL_DEPLOYMENTS) {
    await prisma.deployment.upsert({
      where: { id: d.id },
      update: { status: d.status as DeploymentStatus },
      create: {
        id: d.id,
        version: d.version,
        commitSha: d.commitSha,
        commitMessage: d.commitMessage,
        branch: d.branch,
        authorName: d.authorName,
        authorEmail: d.authorEmail,
        status: d.status as DeploymentStatus,
        durationMs: d.durationMs,
        serviceId: d.serviceId,
        environmentId: d.environment === "staging" ? stagingEnv.id : prodEnv.id,
        workspaceId: workspace.id,
        createdAt: new Date(d.createdAt),
      },
    });
  }
  console.log(`✓ Deployments: ${INITIAL_DEPLOYMENTS.length} deployments seeded`);

  // 6. Create Incidents & Events
  for (const inc of INITIAL_INCIDENTS) {
    const createdIncident = await prisma.incident.upsert({
      where: { id: inc.id },
      update: {
        status: inc.status as IncidentStatus,
        severity: inc.severity as IncidentSeverity,
      },
      create: {
        id: inc.id,
        title: inc.title,
        description: inc.description,
        severity: inc.severity as IncidentSeverity,
        status: inc.status as IncidentStatus,
        workspaceId: workspace.id,
        serviceId: "srv-api-gateway",
        assignedUserId: "usr-sagar-01",
        relatedDeploymentId: inc.relatedDeploymentId,
        aiRootCause: inc.aiRootCause,
        startedAt: new Date(inc.startedAt),
        resolvedAt: inc.resolvedAt ? new Date(inc.resolvedAt) : null,
        durationMinutes: inc.durationMinutes,
      },
    });

    if (inc.events) {
      for (const evt of inc.events) {
        await prisma.incidentEvent.upsert({
          where: { id: evt.id },
          update: {},
          create: {
            id: evt.id,
            incidentId: createdIncident.id,
            type: evt.type as IncidentEventType,
            title: evt.title,
            description: evt.description,
            authorName: evt.authorName,
            createdAt: new Date(evt.createdAt),
          },
        });
      }
    }
  }
  console.log(`✓ Incidents: ${INITIAL_INCIDENTS.length} incidents & timeline events seeded`);

  // 7. Seed Log Entries
  for (const log of INITIAL_LOGS) {
    await prisma.logEntry.create({
      data: {
        workspaceId: workspace.id,
        serviceName: log.service,
        environment: log.environment,
        level: log.level as LogLevel,
        message: log.message,
        requestId: log.requestId,
        traceId: log.traceId,
        timestamp: new Date(log.timestamp),
        metadata: log.metadata ? JSON.stringify(log.metadata) : undefined,
      },
    });
  }
  console.log(`✓ Logs: ${INITIAL_LOGS.length} log entries seeded`);

  // 8. Seed Metric Points
  const metrics = generateInitialTelemetryPoints(48);
  for (const m of metrics) {
    await prisma.metricPoint.create({
      data: {
        workspaceId: workspace.id,
        timestamp: new Date(m.timestamp),
        requests: m.requests,
        latency: m.latency,
        errorRate: m.errorRate,
        cpu: m.cpu,
        memory: m.memory,
      },
    });
  }
  console.log(`✓ Metric points: ${metrics.length} telemetry records seeded`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

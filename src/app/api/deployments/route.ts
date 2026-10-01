import { NextRequest, NextResponse } from "next/server";
import { INITIAL_DEPLOYMENTS } from "@/lib/data/mock-store";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const environment = searchParams.get("environment");

    let deployments = INITIAL_DEPLOYMENTS;

    try {
      if (process.env.DATABASE_URL) {
        const dbDeployments = await prisma.deployment.findMany({
          orderBy: { createdAt: "desc" },
          include: { service: true },
        });

        if (dbDeployments && dbDeployments.length > 0) {
          deployments = dbDeployments.map((d) => ({
            id: d.id,
            version: d.version,
            commitSha: d.commitSha,
            commitMessage: d.commitMessage,
            branch: d.branch,
            authorName: d.authorName,
            authorEmail: d.authorEmail,
            environment: "production",
            status: d.status,
            durationMs: d.durationMs,
            serviceId: d.serviceId,
            serviceName: d.service.name,
            createdAt: d.createdAt.toISOString(),
          }));
        }
      }
    } catch {
      // Fallback cleanly to mock data
    }

    if (status && status !== "ALL") {
      deployments = deployments.filter((d) => d.status === status);
    }
    if (environment && environment !== "ALL") {
      deployments = deployments.filter(
        (d) => d.environment.toLowerCase() === environment.toLowerCase()
      );
    }

    return NextResponse.json({ deployments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch deployments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

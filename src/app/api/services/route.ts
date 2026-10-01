import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { INITIAL_SERVICES } from "@/lib/data/mock-store";
import { prisma } from "@/lib/db/prisma";

const createServiceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  environment: z.string().default("production"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const environment = searchParams.get("environment");

    let services = INITIAL_SERVICES;

    // Attempt to query PostgreSQL if DATABASE_URL is configured
    try {
      if (process.env.DATABASE_URL) {
        const dbServices = await prisma.service.findMany({
          orderBy: { name: "asc" },
        });
        if (dbServices && dbServices.length > 0) {
          services = dbServices.map((s) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            description: s.description || "",
            status: s.status,
            uptime: s.uptime,
            latency: Math.round(s.latency),
            requestsPerSec: s.requestsPerSec,
            errorRate: s.errorRate,
            cpuUsage: s.cpuUsage,
            memoryUsage: s.memoryUsage,
            lastDeployment: s.lastDeploymentAt?.toISOString(),
            updatedAt: s.updatedAt.toISOString(),
            environment: "production",
          }));
        }
      }
    } catch {
      // Fallback seamlessly to mock store
    }

    if (status && status !== "ALL") {
      services = services.filter((s) => s.status === status);
    }
    if (environment && environment !== "ALL") {
      services = services.filter((s) => s.environment.toLowerCase() === environment.toLowerCase());
    }

    return NextResponse.json({ services });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch services";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createServiceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug, description, environment } = result.data;

    const newService = {
      id: `srv-${slug}-${Date.now().toString().slice(-4)}`,
      name,
      slug,
      description: description || "Microservice registered via CloudPulse Console",
      status: "HEALTHY" as const,
      uptime: 100.0,
      latency: 45,
      requestsPerSec: 100,
      errorRate: 0.0,
      cpuUsage: 15.0,
      memoryUsage: 30.0,
      lastDeployment: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      environment,
    };

    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

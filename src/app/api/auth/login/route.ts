import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth/session";
import { DEMO_USER, DEMO_WORKSPACE, INITIAL_TEAM_MEMBERS } from "@/lib/data/mock-store";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // 1. Check live database if DATABASE_URL is reachable
    try {
      if (process.env.DATABASE_URL) {
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: {
              include: { workspace: true },
            },
          },
        });

        if (user) {
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (isValid) {
            const membership = user.memberships[0];
            const sessionUser = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: (membership?.role || "ENGINEER") as "OWNER" | "ADMIN" | "ENGINEER" | "VIEWER",
              workspaceId: membership?.workspaceId || DEMO_WORKSPACE.id,
              workspaceName: membership?.workspace.name || DEMO_WORKSPACE.name,
            };

            await createSession(sessionUser);
            return NextResponse.json({ success: true, user: sessionUser });
          }
        }
      }
    } catch {
      // Fallback gracefully to demo credentials
    }

    // 2. Demo fallback authentication
    const matchedMember = INITIAL_TEAM_MEMBERS.find(
      (m) => m.email.toLowerCase() === email.toLowerCase()
    );

    // Standard demo password is CloudPulse2026!
    if (matchedMember && (password === "CloudPulse2026!" || password === "demo1234")) {
      const sessionUser = {
        id: matchedMember.id,
        email: matchedMember.email,
        name: matchedMember.name,
        role: matchedMember.role,
        workspaceId: DEMO_WORKSPACE.id,
        workspaceName: DEMO_WORKSPACE.name,
      };

      await createSession(sessionUser);
      return NextResponse.json({ success: true, user: sessionUser });
    }

    // If demo user Sagar default
    if (email === DEMO_USER.email && (password === "CloudPulse2026!" || password === "demo1234")) {
      await createSession(DEMO_USER);
      return NextResponse.json({ success: true, user: DEMO_USER });
    }

    return NextResponse.json(
      { error: "Invalid email or password. Use demo account: sagar@cloudpulse.dev / CloudPulse2026!" },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal authentication error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

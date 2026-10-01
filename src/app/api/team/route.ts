import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { INITIAL_TEAM_MEMBERS } from "@/lib/data/mock-store";
import { Role } from "@/types";

const inviteMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  role: z.enum(["OWNER", "ADMIN", "ENGINEER", "VIEWER"]),
});

export async function GET() {
  return NextResponse.json({ members: INITIAL_TEAM_MEMBERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = inviteMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, role } = result.data;

    const newMember = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role: role as Role,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      incidentsHandled: 0,
      deployments: 0,
      status: "ACTIVE" as const,
    };

    INITIAL_TEAM_MEMBERS.push(newMember);

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to invite member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

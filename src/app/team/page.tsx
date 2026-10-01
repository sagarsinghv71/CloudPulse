"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UserPlus,
  Shield,
  Search,
  X,
  Lock,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { INITIAL_TEAM_MEMBERS } from "@/lib/data/mock-store";
import { Role } from "@/types";

export default function TeamPage() {
  const [members, setMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("ENGINEER");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newM = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      incidentsHandled: 0,
      deployments: 0,
      status: "ACTIVE" as const,
    };

    setMembers([...members, newM]);
    setIsInviteOpen(false);
    setNewName("");
    setNewEmail("");
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "OWNER":
        return <Badge variant="cyan" size="sm">OWNER</Badge>;
      case "ADMIN":
        return <Badge variant="purple" size="sm">ADMIN</Badge>;
      case "ENGINEER":
        return <Badge variant="default" size="sm">ENGINEER</Badge>;
      case "VIEWER":
        return <Badge variant="secondary" size="sm">VIEWER</Badge>;
    }
  };

  const permissions = [
    { role: "OWNER", desc: "Full administrative access, billing, workspace deletion, role delegation." },
    { role: "ADMIN", desc: "Manage services, deployments, invite & remove members, configure integrations." },
    { role: "ENGINEER", desc: "Declare incidents, execute rollbacks, inspect full log streams, run Copilot." },
    { role: "VIEWER", desc: "Read-only observability, view service dashboards and status updates." },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Team Members & Access Control
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Workspace role-based access control (RBAC), on-call rotation assignment, and security privileges.
            </p>
          </div>

          <Button
            variant="cyanGlow"
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            className="text-xs"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Invite Member
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-[#6c7891] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team members by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#111420] border border-[#1e2436] text-xs text-[#f1f3f9] placeholder-[#55617a] focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <span className="text-xs font-mono text-[#6c7891]">
            {filteredMembers.length} active operators
          </span>
        </div>

        {/* Team Table */}
        <div className="rounded-xl border border-[#1f2538] bg-[#0c0e17] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111420] text-[#718096] border-b border-[#1b2133] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Incidents Handled</th>
                  <th className="py-3 px-4">Deployments Triggered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161a27] text-[#cbd5e1]">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-[#121623] transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-[#f1f3f9]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-cyan-900 border border-[#23293d] shrink-0">
                          <Image
                            src={m.avatar}
                            alt={m.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div>{m.name}</div>
                          <span className="text-[10px] text-[#64748b] font-mono block">
                            {m.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(m.role)}</td>
                    <td className="py-3.5 px-4">{m.incidentsHandled} incidents</td>
                    <td className="py-3.5 px-4">{m.deployments} rollouts</td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[#8a94a6] hover:text-white"
                        disabled={m.role === "OWNER"}
                      >
                        Edit Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RBAC Matrix Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <CardTitle>Role-Based Access Control (RBAC) Permissions</CardTitle>
            </div>
            <Badge variant="cyan" size="sm">
              Enforced via Server Session
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {permissions.map((p) => (
                <div
                  key={p.role}
                  className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">
                      {p.role}
                    </span>
                    <Lock className="h-3 w-3 text-[#6c7891]" />
                  </div>
                  <p className="text-xs text-[#8a94a6] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invite Member Modal Dialog */}
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-[#23293d] bg-[#0c0f18] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-[#f1f3f9]">Invite New Operator</h3>
                </div>
                <button onClick={() => setIsInviteOpen(false)} className="text-[#64748b] hover:text-[#f1f3f9]">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Role Assignment</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="w-full h-9 px-2 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] font-mono focus:outline-none"
                  >
                    <option value="ENGINEER">Engineer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#171b28]">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="cyanGlow" size="sm">
                    Send Invitation
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

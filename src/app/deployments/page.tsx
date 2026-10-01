"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitBranch,
  Search,
  ChevronRight,
  User,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_DEPLOYMENTS } from "@/lib/data/mock-store";
import { DeploymentData, DeploymentStatus } from "@/types";
import { timeAgo, formatDuration } from "@/lib/utils";

export default function DeploymentsPage() {
  const [deployments] = useState<DeploymentData[]>(INITIAL_DEPLOYMENTS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = deployments.filter((d) => {
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    const matchesSearch =
      d.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.commitSha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const successCount = deployments.filter((d) => d.status === "SUCCESSFUL").length;
  const successRate = Math.round((successCount / deployments.length) * 100);

  const getStatusBadgeVariant = (status: DeploymentStatus) => {
    switch (status) {
      case "SUCCESSFUL":
        return "success";
      case "FAILED":
        return "destructive";
      case "ROLLED_BACK":
        return "warning";
      case "BUILDING":
        return "cyan";
      default:
        return "default";
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Deployment Timeline
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Production rollout history, git commit diff tracking, and instant rollback controls.
            </p>
          </div>
        </div>

        {/* Metric summary pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-[#1e2436] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Deployments (30d)</span>
            <div className="text-2xl font-bold font-mono text-[#f1f3f9]">{deployments.length}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Rollout Success Rate</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{successRate}%</div>
          </div>
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-1">
            <span className="text-[11px] font-mono text-cyan-400 uppercase">Avg Rollout Time</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">42s</div>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
            <span className="text-[11px] font-mono text-amber-400 uppercase">Rollbacks</span>
            <div className="text-2xl font-bold font-mono text-amber-400">1</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-[#6c7891] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by commit, author, service, version..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#111420] border border-[#1e2436] text-xs text-[#f1f3f9] placeholder-[#64748b] focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233] overflow-x-auto">
            {["ALL", "SUCCESSFUL", "FAILED", "ROLLED_BACK"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? "bg-[#1c2233] text-cyan-300 font-semibold"
                    : "text-[#718096] hover:text-[#f1f3f9]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Deployment Timeline Stream */}
        <div className="rounded-xl border border-[#1f2538] bg-[#0c0e17] overflow-hidden shadow-sm">
          <div className="divide-y divide-[#161a27]">
            {filtered.map((dep) => (
              <Link
                key={dep.id}
                href={`/deployments/${dep.id}`}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#121623] transition-colors group block"
              >
                {/* Left side: Version, status, service, and commit */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="pt-0.5">
                    <StatusDot status={dep.status} size="md" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold font-mono text-[#f1f3f9] group-hover:text-cyan-400 transition-colors">
                        {dep.serviceName}
                      </span>
                      <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {dep.version}
                      </span>
                      <Badge variant={getStatusBadgeVariant(dep.status)} size="sm">
                        {dep.status}
                      </Badge>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b28] text-[#8a94a6]">
                        {dep.environment}
                      </span>
                    </div>

                    <p className="text-xs text-[#cbd5e1] font-mono truncate">
                      {dep.commitMessage}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#6c7891] pt-1">
                      <span className="flex items-center gap-1 text-[#8a94a6]">
                        <GitBranch className="h-3 w-3 text-cyan-400" /> {dep.branch}
                      </span>
                      <span>•</span>
                      <span className="text-cyan-400/80">{dep.commitSha}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {dep.authorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Duration, timestamp, action button */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#171b28]">
                  <div className="text-left md:text-right font-mono">
                    <span className="text-xs text-[#f1f3f9] block">
                      {formatDuration(dep.durationMs)}
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      {timeAgo(dep.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs group-hover:border-cyan-500/40"
                    >
                      Inspect Logs <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

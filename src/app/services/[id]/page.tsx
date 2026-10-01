"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Server,
  ArrowLeft,
  Activity,
  GitCommit,
  AlertOctagon,
  Terminal,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  INITIAL_SERVICES,
  INITIAL_DEPLOYMENTS,
  INITIAL_INCIDENTS,
  INITIAL_LOGS,
  generateInitialTelemetryPoints,
} from "@/lib/data/mock-store";
import { TelemetryChart } from "@/components/dashboard/telemetry-chart";
import { formatNumber, timeAgo, formatDuration } from "@/lib/utils";

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "deployments" | "incidents" | "logs">("overview");

  const service =
    INITIAL_SERVICES.find((s) => s.id === id || s.slug === id) || INITIAL_SERVICES[0];

  const deployments = INITIAL_DEPLOYMENTS.filter(
    (d) => d.serviceId === service.id || d.serviceName.toLowerCase() === service.name.toLowerCase()
  );

  const incidents = INITIAL_INCIDENTS.filter((inc) =>
    inc.affectedServices.some((s) => s.toLowerCase() === service.name.toLowerCase())
  );

  const logs = INITIAL_LOGS.filter(
    (l) =>
      l.service.toLowerCase() === service.slug.toLowerCase() ||
      l.service.toLowerCase() === service.name.toLowerCase()
  );

  const metrics = generateInitialTelemetryPoints(24);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#718096]">
          <Link href="/services" className="hover:text-cyan-400 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{service.name}</span>
        </div>

        {/* Header Hero Banner */}
        <div className="p-6 rounded-2xl border border-[#23293d] bg-[#0c0f18] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Server className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#f1f3f9]">{service.name}</h1>
                <Badge
                  variant={
                    service.status === "HEALTHY"
                      ? "success"
                      : service.status === "DEGRADED"
                      ? "warning"
                      : "destructive"
                  }
                  size="md"
                >
                  <StatusDot status={service.status} size="sm" pulse={false} />
                  <span className="ml-1">{service.status}</span>
                </Badge>
              </div>
              <p className="text-xs text-[#8a94a6] max-w-xl">{service.description}</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#64748b] pt-1">
                <span>Slug: {service.slug}</span>
                <span>•</span>
                <span>Env: {service.environment}</span>
                <span>•</span>
                <span>Last rollout: {service.lastDeployment ? timeAgo(service.lastDeployment) : "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/logs?service=${service.slug}`}>
              <Button variant="secondary" size="sm" className="text-xs">
                <Terminal className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                Live Logs
              </Button>
            </Link>
            <Link href={`/ai-copilot`}>
              <Button variant="secondary" size="sm" className="text-xs border-purple-500/40 text-purple-300">
                Copilot Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 border-b border-[#1b2133] pb-px">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "metrics", label: "Metrics & Telemetry", icon: Activity },
            { id: "deployments", label: `Deployments (${deployments.length})`, icon: GitCommit },
            { id: "incidents", label: `Incidents (${incidents.length})`, icon: AlertOctagon },
            { id: "logs", label: `Recent Logs (${logs.length})`, icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-all ${
                  isSelected
                    ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                    : "border-transparent text-[#718096] hover:text-[#f1f3f9] hover:bg-[#121622]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0e18] space-y-1">
                <span className="text-[11px] font-mono text-[#718096] uppercase">Uptime (SLA)</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">{service.uptime}%</div>
                <span className="text-[10px] text-[#55607a]">Last 30 days: 99.98%</span>
              </div>
              <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0e18] space-y-1">
                <span className="text-[11px] font-mono text-[#718096] uppercase">P99 Latency</span>
                <div className={`text-2xl font-bold font-mono ${service.latency > 200 ? "text-amber-400" : "text-cyan-400"}`}>
                  {service.latency}ms
                </div>
                <span className="text-[10px] text-[#55607a]">Baseline target: 120ms</span>
              </div>
              <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0e18] space-y-1">
                <span className="text-[11px] font-mono text-[#718096] uppercase">Traffic Rate</span>
                <div className="text-2xl font-bold font-mono text-[#f1f3f9]">{formatNumber(service.requestsPerSec)} req/s</div>
                <span className="text-[10px] text-[#55607a]">Peak capacity: 10,000 req/s</span>
              </div>
              <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0e18] space-y-1">
                <span className="text-[11px] font-mono text-[#718096] uppercase">Error Budget</span>
                <div className={`text-2xl font-bold font-mono ${service.errorRate > 1.0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {service.errorRate}%
                </div>
                <span className="text-[10px] text-[#55607a]">Max threshold: 0.10%</span>
              </div>
            </div>

            {/* Performance Chart */}
            <TelemetryChart
              metrics={metrics}
              timeRange="1h"
              onTimeRangeChange={() => {}}
              isPaused={false}
              onTogglePause={() => {}}
              onRefresh={() => {}}
            />

            {/* Split row: Deployments & Incidents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deployments list */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-cyan-400" />
                    <CardTitle>Recent Service Rollouts</CardTitle>
                  </div>
                  <Link href="/deployments" className="text-xs text-cyan-400 hover:underline">
                    View all
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                  {deployments.length === 0 ? (
                    <p className="text-xs text-[#64748b]">No deployment history found.</p>
                  ) : (
                    deployments.map((d) => (
                      <Link
                        key={d.id}
                        href={`/deployments/${d.id}`}
                        className="p-3 rounded-lg border border-[#1b2133] bg-[#0e111a] hover:border-cyan-500/30 flex items-center justify-between transition-colors block"
                      >
                        <div className="flex items-center gap-2.5">
                          <StatusDot status={d.status} size="sm" />
                          <div>
                            <span className="text-xs font-mono font-bold text-white">
                              {d.version} ({d.commitSha})
                            </span>
                            <p className="text-[11px] text-[#8a94a6] truncate max-w-xs">{d.commitMessage}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#6c7891]">{timeAgo(d.createdAt)}</span>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Incidents list */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-rose-400" />
                    <CardTitle>Service Outages & Alerts</CardTitle>
                  </div>
                  <Link href="/incidents" className="text-xs text-rose-400 hover:underline">
                    View all
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                  {incidents.length === 0 ? (
                    <p className="text-xs text-emerald-400">✓ No incidents recorded on this service.</p>
                  ) : (
                    incidents.map((inc) => (
                      <Link
                        key={inc.id}
                        href={`/incidents/${inc.id}`}
                        className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50 flex items-center justify-between transition-colors block"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-rose-400">{inc.id.toUpperCase()}</span>
                            <Badge variant="destructive" size="sm">{inc.severity}</Badge>
                          </div>
                          <p className="text-xs text-[#cbd5e1] mt-1">{inc.title}</p>
                        </div>
                        <span className="text-[10px] font-mono text-[#6c7891]">{timeAgo(inc.startedAt)}</span>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            <TelemetryChart
              metrics={metrics}
              timeRange="1h"
              onTimeRangeChange={() => {}}
              isPaused={false}
              onTogglePause={() => {}}
              onRefresh={() => {}}
            />
          </div>
        )}

        {activeTab === "deployments" && (
          <div className="rounded-xl border border-[#1f2538] bg-[#0c0e17] overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111420] text-[#718096] border-b border-[#1b2133] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Release</th>
                  <th className="py-3 px-4">Commit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161a27] text-[#cbd5e1]">
                {deployments.map((d) => (
                  <tr key={d.id} className="hover:bg-[#131724]">
                    <td className="py-3.5 px-4 font-bold text-white">{d.version}</td>
                    <td className="py-3.5 px-4 text-cyan-400">{d.commitSha}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" size="sm">{d.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4">{d.authorName}</td>
                    <td className="py-3.5 px-4">{formatDuration(d.durationMs)}</td>
                    <td className="py-3.5 px-4 text-right text-[#718096]">{timeAgo(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "incidents" && (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 rounded-xl border border-rose-500/30 bg-[#0e111a] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{inc.id.toUpperCase()}</span>
                    <Badge variant="destructive" size="sm">{inc.severity}</Badge>
                    <Badge variant="warning" size="sm">{inc.status}</Badge>
                  </div>
                  <span className="text-[10px] font-mono text-[#6c7891]">{timeAgo(inc.startedAt)}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#f1f3f9]">{inc.title}</h4>
                <p className="text-xs text-[#8a94a6]">{inc.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "logs" && (
          <div className="rounded-xl border border-[#1f2538] bg-[#08090f] p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {logs.map((l) => (
              <div key={l.id} className="flex items-start gap-3 py-1.5 border-b border-[#141825] last:border-none">
                <span className="text-[10px] text-[#6c7891]">{l.timestamp.split("T")[1].slice(0, 8)}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    l.level === "ERROR" || l.level === "FATAL"
                      ? "bg-rose-500/20 text-rose-400"
                      : l.level === "WARN"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-cyan-500/20 text-cyan-400"
                  }`}
                >
                  {l.level}
                </span>
                <span className="text-[#cbd5e1] flex-1">{l.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

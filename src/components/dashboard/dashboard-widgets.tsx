import React from "react";
import Link from "next/link";
import {
  AlertOctagon,
  ArrowRight,
  GitCommit,
  Server,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceData, DeploymentData, IncidentData } from "@/types";
import { timeAgo, formatDuration } from "@/lib/utils";

export function ActiveIncidentsWidget({ incidents }: { incidents: IncidentData[] }) {
  const active = incidents.filter((i) => i.status !== "RESOLVED");

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-rose-400" />
          <CardTitle>Active Incidents</CardTitle>
          <Badge variant="destructive" size="sm">
            {active.length} Active
          </Badge>
        </div>
        <Link href="/incidents">
          <Button variant="ghost" size="sm" className="text-xs text-[#8a94a6] hover:text-cyan-400">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-3">
        {active.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8a94a6]">
            No active incidents. All systems operational.
          </div>
        ) : (
          active.map((inc) => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="block p-3.5 rounded-xl border border-[#1f2538] bg-[#0f121c]/70 hover:border-rose-500/40 hover:bg-[#141824] transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {inc.id.toUpperCase()}
                    </span>
                    <Badge
                      variant={inc.severity === "CRITICAL" ? "destructive" : "warning"}
                      size="sm"
                    >
                      {inc.severity}
                    </Badge>
                    <span className="text-[10px] font-mono text-[#6c7891]">
                      {timeAgo(inc.startedAt)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#f1f3f9] line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {inc.title}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#6c7891] group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
              </div>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#171b28] text-[11px] text-[#8a94a6]">
                <span>Services:</span>
                <div className="flex flex-wrap gap-1">
                  {inc.affectedServices.map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded bg-[#171b28] text-[#cbd5e1] font-mono text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function RecentDeploymentsWidget({ deployments }: { deployments: DeploymentData[] }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-cyan-400" />
          <CardTitle>Recent Deployments</CardTitle>
        </div>
        <Link href="/deployments">
          <Button variant="ghost" size="sm" className="text-xs text-[#8a94a6] hover:text-cyan-400">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 pt-3">
        {deployments.slice(0, 4).map((dep) => (
          <Link
            key={dep.id}
            href={`/deployments/${dep.id}`}
            className="flex items-center justify-between p-3 rounded-lg border border-[#1b2031] bg-[#0e111a] hover:border-cyan-500/30 hover:bg-[#131724] transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <StatusDot status={dep.status} size="sm" />
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#f1f3f9] truncate">
                    {dep.serviceName}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    {dep.version}
                  </span>
                  <span className="text-[10px] font-mono text-[#6c7891]">
                    {dep.commitSha}
                  </span>
                </div>
                <p className="text-[11px] text-[#8a94a6] truncate">
                  {dep.commitMessage}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 pl-3">
              <span className="text-[10px] font-mono text-[#6c7891]">
                {timeAgo(dep.createdAt)}
              </span>
              <span className="text-[10px] font-mono text-[#54607b]">
                {formatDuration(dep.durationMs)}
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function ServicesHealthGrid({ services }: { services: ServiceData[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-cyan-400" />
          <CardTitle>Core Services Matrix</CardTitle>
        </div>
        <Link href="/services">
          <Button variant="ghost" size="sm" className="text-xs text-[#8a94a6] hover:text-cyan-400">
            View All Services <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((svc) => (
            <Link
              key={svc.id}
              href={`/services/${svc.id}`}
              className="p-3.5 rounded-xl border border-[#1b2031] bg-[#0e111a] hover:border-[#2d3752] hover:bg-[#121622] transition-all group block"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={svc.status} size="sm" />
                  <span className="text-xs font-semibold text-[#f1f3f9] group-hover:text-cyan-300 transition-colors">
                    {svc.name}
                  </span>
                </div>
                <Badge
                  variant={
                    svc.status === "HEALTHY"
                      ? "success"
                      : svc.status === "DEGRADED"
                      ? "warning"
                      : "destructive"
                  }
                  size="sm"
                >
                  {svc.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#171b28] text-center font-mono">
                <div>
                  <span className="text-[9px] text-[#6b768e] block uppercase">Uptime</span>
                  <span className="text-xs font-semibold text-[#f1f3f9]">{svc.uptime}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6b768e] block uppercase">Latency</span>
                  <span className="text-xs font-semibold text-[#f1f3f9]">{svc.latency}ms</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6b768e] block uppercase">Error</span>
                  <span
                    className={`text-xs font-semibold ${
                      svc.errorRate > 1.0 ? "text-rose-400" : "text-[#f1f3f9]"
                    }`}
                  >
                    {svc.errorRate}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

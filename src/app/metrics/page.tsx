"use client";

import React, { useState } from "react";
import {
  Zap,
  Server,
  AlertTriangle,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TelemetryChart } from "@/components/dashboard/telemetry-chart";
import { useTelemetry } from "@/hooks/use-telemetry";
import { INITIAL_SERVICES } from "@/lib/data/mock-store";
import { formatNumber } from "@/lib/utils";

export default function MetricsPage() {
  const {
    data,
    loading,
    timeRange,
    setTimeRange,
    isPaused,
    togglePause,
    refetch,
  } = useTelemetry("1h");

  const [isAnomalyInjected, setIsAnomalyInjected] = useState(false);

  if (loading || !data) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-[#141825] rounded-md animate-pulse" />
          <div className="h-80 bg-[#141825] rounded-xl animate-pulse" />
        </div>
      </DashboardShell>
    );
  }

  const { metrics, summary } = data;

  const handleToggleAnomaly = () => {
    setIsAnomalyInjected(!isAnomalyInjected);
    refetch();
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Real-Time Metrics & Telemetry
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Sub-second telemetry aggregation, percentile latency tracking, and resource saturation curves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isAnomalyInjected ? "destructive" : "secondary"}
              size="sm"
              onClick={handleToggleAnomaly}
              className="text-xs font-mono"
            >
              <Zap className="h-3.5 w-3.5 mr-1 text-amber-400" />
              {isAnomalyInjected ? "Clear Injected Anomaly" : "Simulate Anomaly"}
            </Button>
          </div>
        </div>

        {/* Anomaly notice banner if injected */}
        {isAnomalyInjected && (
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                <strong>Simulated Anomaly Active:</strong> Ingress traffic surge injected with artificial connection pool queuing. P99 latency shifted +140ms.
              </span>
            </div>
            <button
              onClick={() => setIsAnomalyInjected(false)}
              className="text-xs underline hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Key Health KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Average Latency (P50)</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {isAnomalyInjected ? "245ms" : `${summary.latency}ms`}
            </div>
            <span className="text-[10px] text-[#55607a]">Global edge average</span>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Peak Latency (P99)</span>
            <div className="text-2xl font-bold font-mono text-rose-400">
              {isAnomalyInjected ? "840ms" : "285ms"}
            </div>
            <span className="text-[10px] text-rose-400/80">Threshold &gt; 250ms exceeded</span>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Ingress Requests</span>
            <div className="text-2xl font-bold font-mono text-white">
              {formatNumber(summary.requestsPerSec)} req/s
            </div>
            <span className="text-[10px] text-emerald-400">+8.4% vs median</span>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Active Error Rate</span>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {isAnomalyInjected ? "3.85%" : `${summary.errorRate}%`}
            </div>
            <span className="text-[10px] text-[#55607a]">SLA threshold: 0.10%</span>
          </div>
        </div>

        {/* Main Telemetry Chart */}
        <TelemetryChart
          metrics={metrics}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onRefresh={refetch}
        />

        {/* Service-by-Service Breakdown Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <CardTitle>Microservice Saturation & Latency Breakdown</CardTitle>
            </div>
            <Badge variant="secondary" size="sm">
              6 Monitored Targets
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111420] text-[#718096] border-b border-[#1b2133] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Throughput</th>
                    <th className="py-3 px-4">Error Rate</th>
                    <th className="py-3 px-4">CPU Saturation</th>
                    <th className="py-3 px-4 text-right">Memory Footprint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161a27] text-[#cbd5e1]">
                  {INITIAL_SERVICES.map((s) => (
                    <tr key={s.id} className="hover:bg-[#131724] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2 font-sans">
                        <StatusDot status={s.status} size="sm" />
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            s.status === "HEALTHY"
                              ? "success"
                              : s.status === "DEGRADED"
                              ? "warning"
                              : "destructive"
                          }
                          size="sm"
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={s.latency > 200 ? "text-amber-400 font-bold" : ""}>
                          {s.latency}ms
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{formatNumber(s.requestsPerSec)} req/s</td>
                      <td className="py-3.5 px-4">
                        <span className={s.errorRate > 1.0 ? "text-rose-400 font-bold" : ""}>
                          {s.errorRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#161b28] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${s.cpuUsage > 80 ? "bg-rose-500" : "bg-cyan-500"}`}
                              style={{ width: `${s.cpuUsage}%` }}
                            />
                          </div>
                          <span>{s.cpuUsage}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-[#161b28] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${s.memoryUsage > 85 ? "bg-rose-500" : "bg-emerald-500"}`}
                              style={{ width: `${s.memoryUsage}%` }}
                            />
                          </div>
                          <span>{s.memoryUsage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

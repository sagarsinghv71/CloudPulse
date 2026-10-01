"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { TelemetryChart } from "@/components/dashboard/telemetry-chart";
import {
  ActiveIncidentsWidget,
  RecentDeploymentsWidget,
  ServicesHealthGrid,
} from "@/components/dashboard/dashboard-widgets";
import { LoadingDashboard, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { useTelemetry } from "@/hooks/use-telemetry";
import {
  INITIAL_DEPLOYMENTS,
  INITIAL_INCIDENTS,
  INITIAL_SERVICES,
} from "@/lib/data/mock-store";

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
    timeRange,
    setTimeRange,
    isPaused,
    togglePause,
    refetch,
  } = useTelemetry("1h");

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-[#141825] rounded-md animate-pulse" />
          <LoadingDashboard />
        </div>
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell>
        <ErrorState
          title="Telemetry Feed Disconnected"
          message={error || "Could not retrieve live infrastructure telemetry."}
          onRetry={refetch}
        />
      </DashboardShell>
    );
  }

  const { summary, metrics } = data;
  const hasDegradation = summary.activeIncidents > 0;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Good morning, Sagar
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Here&apos;s what&apos;s happening across your infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/ai-copilot">
              <Button
                variant="secondary"
                size="sm"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-950/40"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400 mr-1.5" />
                Copilot Incident Triage
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Status Banner */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-3 transition-colors ${
            hasDegradation
              ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
              : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                hasDegradation
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {hasDegradation ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider">
                  {hasDegradation
                    ? "SYSTEM DEGRADED — 2 ACTIVE INCIDENTS"
                    : "SYSTEM OPERATIONAL"}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#cbd5e1] border border-white/10">
                  us-east-1
                </span>
              </div>
              <p className="text-xs text-[#cbd5e1] mt-0.5">
                {hasDegradation
                  ? "API Gateway experiencing elevated P99 latency (285ms) linked to PostgreSQL connection exhaustion."
                  : "All monitored microservices are reporting healthy metrics and SLA compliance."}
              </p>
            </div>
          </div>

          {hasDegradation && (
            <Link href="/incidents/inc-8042" className="shrink-0">
              <Button
                variant="secondary"
                size="sm"
                className="bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs"
              >
                Inspect Incident #8042 <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {/* KPI Cards */}
        <KpiCards
          uptime={summary.uptime}
          requestsPerSec={summary.requestsPerSec}
          errorRate={summary.errorRate}
          latency={summary.latency}
          activeIncidents={summary.activeIncidents}
          deploymentsToday={summary.deploymentsToday}
        />

        {/* Real-Time Telemetry Chart */}
        <TelemetryChart
          metrics={metrics}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onRefresh={refetch}
        />

        {/* Core Services Health Grid */}
        <ServicesHealthGrid services={INITIAL_SERVICES} />

        {/* Incidents & Deployments split widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveIncidentsWidget incidents={INITIAL_INCIDENTS} />
          <RecentDeploymentsWidget deployments={INITIAL_DEPLOYMENTS} />
        </div>
      </div>
    </DashboardShell>
  );
}

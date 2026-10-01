"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INITIAL_DEPLOYMENTS, INITIAL_INCIDENTS, INITIAL_SERVICES } from "@/lib/data/mock-store";

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<"7d" | "30d" | "90d" | "ytd">("30d");

  // Dynamic calculations from dataset
  const analyticsData = useMemo(() => {
    const totalDeployments = INITIAL_DEPLOYMENTS.length;
    const failedDeployments = INITIAL_DEPLOYMENTS.filter(
      (d) => d.status === "FAILED" || d.status === "ROLLED_BACK"
    ).length;
    const failureRate = parseFloat(((failedDeployments / totalDeployments) * 100).toFixed(1));

    const resolvedIncidents = INITIAL_INCIDENTS.filter((i) => i.status === "RESOLVED");
    const avgMttr =
      resolvedIncidents.length > 0
        ? Math.round(
            resolvedIncidents.reduce((acc, i) => acc + (i.durationMinutes || 24), 0) /
              resolvedIncidents.length
          )
        : 24;

    const avgUptime = parseFloat(
      (INITIAL_SERVICES.reduce((acc, s) => acc + s.uptime, 0) / INITIAL_SERVICES.length).toFixed(2)
    );

    // Chart trend series
    const days = timeFilter === "7d" ? 7 : timeFilter === "30d" ? 30 : timeFilter === "90d" ? 90 : 120;
    const step = Math.max(1, Math.floor(days / 10));

    const trendPoints = [];
    for (let i = 0; i < 10; i++) {
      const dayOffset = (9 - i) * step;
      const d = new Date();
      d.setDate(d.getDate() - dayOffset);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      trendPoints.push({
        date: label,
        uptime: parseFloat((99.9 + Math.sin(i * 0.7) * 0.08).toFixed(2)),
        deployments: 4 + Math.round(Math.cos(i * 0.5) * 3),
        failures: i % 4 === 0 ? 1 : 0,
        mttr: Math.round(22 + Math.sin(i * 0.8) * 8),
        latency: Math.round(135 + Math.cos(i * 0.4) * 25),
        incidents: i % 3 === 0 ? 1 : 0,
      });
    }

    return {
      totalDeployments,
      failureRate,
      avgMttr,
      avgUptime,
      trendPoints,
    };
  }, [timeFilter]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Engineering Analytics
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Long-term service reliability, MTTR trends, deployment velocity, and error budgets.
            </p>
          </div>

          {/* Time range pills */}
          <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
            {(["7d", "30d", "90d", "ytd"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1 rounded text-xs font-mono font-semibold uppercase transition-all ${
                  timeFilter === t
                    ? "bg-[#1f2638] text-cyan-300"
                    : "text-[#718096] hover:text-[#f1f3f9]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Metric KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Overall SLA Uptime</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {analyticsData.avgUptime}%
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> SLA target &gt; 99.90% met
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Mean Time to Resolution</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {analyticsData.avgMttr}m
            </div>
            <span className="text-[10px] text-[#55607a]">-18% vs previous window</span>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Change Failure Rate</span>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {analyticsData.failureRate}%
            </div>
            <span className="text-[10px] text-[#55607a]">1 rollback out of 5 tracked</span>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Deployments Recorded</span>
            <div className="text-2xl font-bold font-mono text-white">
              {analyticsData.totalDeployments}
            </div>
            <span className="text-[10px] text-cyan-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 1.2 per engineer / day
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Uptime Trend */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Uptime & Availability Curve</CardTitle>
              <Badge variant="success" size="sm">
                99.98% Average
              </Badge>
            </CardHeader>
            <CardContent className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.trendPoints}>
                  <defs>
                    <linearGradient id="analyticsUptime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161b28" vertical={false} />
                  <XAxis dataKey="date" stroke="#525f7a" fontSize={10} tickLine={false} />
                  <YAxis domain={[99.8, 100]} stroke="#525f7a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0e18", borderColor: "#1f2538" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#analyticsUptime)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* MTTR Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Mean Time to Resolution (MTTR)</CardTitle>
              <Badge variant="cyan" size="sm">
                Minutes to Resolve
              </Badge>
            </CardHeader>
            <CardContent className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.trendPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161b28" vertical={false} />
                  <XAxis dataKey="date" stroke="#525f7a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#525f7a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0e18", borderColor: "#1f2538" }}
                  />
                  <Bar dataKey="mttr" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Deployment Frequency & Failures */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Deployment Frequency vs Failures</CardTitle>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> Deploys
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> Failures
                </span>
              </div>
            </CardHeader>
            <CardContent className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.trendPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161b28" vertical={false} />
                  <XAxis dataKey="date" stroke="#525f7a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#525f7a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0e18", borderColor: "#1f2538" }}
                  />
                  <Bar dataKey="deployments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failures" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Latency Trends Over Time */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>P99 Latency Evolution (ms)</CardTitle>
              <Badge variant="warning" size="sm">
                Target: &lt;150ms
              </Badge>
            </CardHeader>
            <CardContent className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.trendPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161b28" vertical={false} />
                  <XAxis dataKey="date" stroke="#525f7a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#525f7a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0e18", borderColor: "#1f2538" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

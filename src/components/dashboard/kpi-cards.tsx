import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertOctagon,
  Clock,
  GitCommit,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface KpiCardsProps {
  uptime: number;
  requestsPerSec: number;
  errorRate: number;
  latency: number;
  activeIncidents: number;
  deploymentsToday: number;
}

export function KpiCards({
  uptime,
  requestsPerSec,
  errorRate,
  latency,
  activeIncidents,
  deploymentsToday,
}: KpiCardsProps) {
  const cards = [
    {
      title: "System Uptime",
      value: `${uptime.toFixed(2)}%`,
      trend: "Operational SLA met",
      trendUp: true,
      icon: CheckCircle2,
      color: "text-emerald-400",
      accentBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total Throughput",
      value: `${formatNumber(requestsPerSec)} req/s`,
      trend: "+12.4% vs last hour",
      trendUp: true,
      icon: Activity,
      color: "text-cyan-400",
      accentBg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Global Error Rate",
      value: `${errorRate.toFixed(2)}%`,
      trend: "+0.8% threshold warning",
      trendUp: false,
      icon: AlertOctagon,
      color: errorRate > 1.0 ? "text-rose-400" : "text-emerald-400",
      accentBg: errorRate > 1.0 ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Average Latency",
      value: `${latency}ms`,
      trend: "P99 Spike: 285ms",
      trendUp: false,
      icon: Clock,
      color: latency > 200 ? "text-amber-400" : "text-cyan-400",
      accentBg: latency > 200 ? "bg-amber-500/10 border-amber-500/20" : "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Active Incidents",
      value: `${activeIncidents} Active`,
      trend: "1 Critical, 1 Medium",
      trendUp: false,
      icon: AlertOctagon,
      color: activeIncidents > 0 ? "text-rose-400" : "text-emerald-400",
      accentBg: activeIncidents > 0 ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Deployments Today",
      value: `${deploymentsToday}`,
      trend: "Latest: #4821 14m ago",
      trendUp: true,
      icon: GitCommit,
      color: "text-indigo-400",
      accentBg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="p-4 hover:border-[#2f3750] transition-all duration-150 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#8a94a6] truncate uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`h-7 w-7 rounded-lg border flex items-center justify-center ${card.accentBg} ${card.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#f1f3f9]">
                {card.value}
              </div>
              <p className="text-[10px] text-[#718096] truncate font-mono">
                {card.trend}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

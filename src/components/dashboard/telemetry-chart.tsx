"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MetricPointData } from "@/types";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, Radio } from "lucide-react";

interface TelemetryChartProps {
  metrics: MetricPointData[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onRefresh: () => void;
}

type MetricType = "requests" | "latency" | "errorRate" | "cpu" | "memory";

export function TelemetryChart({
  metrics,
  timeRange,
  onTimeRangeChange,
  isPaused,
  onTogglePause,
  onRefresh,
}: TelemetryChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("latency");

  const ranges = ["15m", "1h", "6h", "24h", "7d"];

  const metricConfigs: Record<
    MetricType,
    { label: string; unit: string; color: string; gradientId: string; stroke: string }
  > = {
    latency: {
      label: "Average Latency",
      unit: "ms",
      color: "#f43f5e",
      gradientId: "latGrad",
      stroke: "#f43f5e",
    },
    requests: {
      label: "Requests / sec",
      unit: "req/s",
      color: "#00e5ff",
      gradientId: "reqGrad",
      stroke: "#00e5ff",
    },
    errorRate: {
      label: "Error Rate",
      unit: "%",
      color: "#f59e0b",
      gradientId: "errGrad",
      stroke: "#f59e0b",
    },
    cpu: {
      label: "CPU Utilization",
      unit: "%",
      color: "#8b5cf6",
      gradientId: "cpuGrad",
      stroke: "#8b5cf6",
    },
    memory: {
      label: "Memory Utilization",
      unit: "%",
      color: "#10b981",
      gradientId: "memGrad",
      stroke: "#10b981",
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  const formattedData = metrics.map((m) => {
    const d = new Date(m.timestamp);
    const timeFormatted = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return {
      time: timeFormatted,
      [selectedMetric]: m[selectedMetric],
    };
  });

  return (
    <div className="rounded-xl border border-[#1f2538] bg-[#0c0e17] p-5 shadow-sm space-y-4">
      {/* Header with Metric selection tabs and controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171b28] pb-4">
        {/* Metric tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(Object.keys(metricConfigs) as MetricType[]).map((mKey) => {
            const config = metricConfigs[mKey];
            const isSelected = selectedMetric === mKey;
            return (
              <button
                key={mKey}
                onClick={() => setSelectedMetric(mKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#181d2c] text-white border border-[#2b334d] shadow-sm"
                    : "text-[#8a94a6] hover:text-[#f1f3f9] hover:bg-[#121622]"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Time ranges and Pause/Live controls */}
        <div className="flex items-center gap-2">
          {/* Simulated Live Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#111520] border border-[#1d2335] text-[11px] font-mono">
            <Radio
              className={`h-3 w-3 ${
                isPaused ? "text-amber-400" : "text-emerald-400 animate-pulse"
              }`}
            />
            <span className={isPaused ? "text-amber-400" : "text-emerald-400"}>
              {isPaused ? "Paused" : "Live Stream"}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePause}
            className="h-7 w-7 text-[#8a94a6] hover:text-white"
            title={isPaused ? "Resume Live Stream" : "Pause Live Stream"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="h-7 w-7 text-[#8a94a6] hover:text-white"
            title="Refresh Snapshot"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Time range pills */}
          <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => onTimeRangeChange(r)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                  timeRange === r
                    ? "bg-[#1b2131] text-cyan-300 font-semibold"
                    : "text-[#64748b] hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#161b28" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#525f7a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="var(--font-geist-mono)"
            />
            <YAxis
              stroke="#525f7a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="var(--font-geist-mono)"
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#23293d] bg-[#0c0e17] p-2.5 shadow-xl font-mono text-xs space-y-1">
                      <p className="text-[#64748b] text-[10px]">{label}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: currentConfig.color }}
                        />
                        <span className="font-semibold text-white">
                          {payload[0].value} {currentConfig.unit}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentConfig.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${currentConfig.gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#6b768e] pt-1 border-t border-[#141825]">
        <span>Aggregated via CloudPulse Telemetry Engine</span>
        <span className="text-cyan-400/80">Interval: 5s simulated tick</span>
      </div>
    </div>
  );
}

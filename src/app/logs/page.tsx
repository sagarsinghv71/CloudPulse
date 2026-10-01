"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  Radio,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { INITIAL_LOGS, INITIAL_SERVICES } from "@/lib/data/mock-store";
import { LogEntryData, LogLevel } from "@/types";

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntryData[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [envFilter, setEnvFilter] = useState("ALL");
  const [isPaused, setIsPaused] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated live log ticker
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const services = ["api-gateway", "postgresql-primary", "auth-service", "user-service", "payment-service"];
      const svc = services[Math.floor(Math.random() * services.length)];
      const randomTrace = `tr-${Math.random().toString(16).slice(2, 10)}`;
      const randomReq = `req-${Math.random().toString(16).slice(2, 8)}`;
      const now = new Date().toISOString();

      const templates = [
        { level: "INFO" as LogLevel, msg: `HTTP 200 GET /api/v1/health status=OK duration=${Math.floor(12 + Math.random() * 40)}ms` },
        { level: "DEBUG" as LogLevel, msg: `Cache lookup key=tenant:sess_${Math.random().toString(36).slice(2, 8)} status=HIT` },
        { level: "WARN" as LogLevel, msg: `PgBouncer pool slot latency elevated: ${Math.floor(140 + Math.random() * 120)}ms` },
        { level: "INFO" as LogLevel, msg: `Stripe webhook dispatch acknowledged idempotency_key=evt_${Math.random().toString(36).slice(2, 10)}` },
      ];

      const chosen = templates[Math.floor(Math.random() * templates.length)];

      const newLog: LogEntryData = {
        id: `log-${Date.now()}`,
        timestamp: now,
        service: svc,
        level: chosen.level,
        message: chosen.msg,
        requestId: randomReq,
        traceId: randomTrace,
        environment: "production",
        metadata: {
          runtimeNode: "us-east-1a",
          callerIp: "10.0.8.21",
          durationMs: Math.floor(20 + Math.random() * 60),
        },
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 75)]);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const filteredLogs = logs.filter((log) => {
    const matchesService =
      serviceFilter === "ALL" || log.service.toLowerCase() === serviceFilter.toLowerCase();
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    const matchesEnv = envFilter === "ALL" || log.environment.toLowerCase() === envFilter.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesService && matchesLevel && matchesEnv && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setServiceFilter("ALL");
    setLevelFilter("ALL");
    setEnvFilter("ALL");
  };

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case "FATAL":
        return <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 text-[10px]">FATAL</span>;
      case "ERROR":
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 text-[10px]">ERROR</span>;
      case "WARN":
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 text-[10px]">WARN</span>;
      case "INFO":
        return <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/30 text-[10px]">INFO</span>;
      case "DEBUG":
        return <span className="px-1.5 py-0.5 rounded bg-[#1b2233] text-[#718096] font-medium border border-[#252e45] text-[10px]">DEBUG</span>;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Log Stream Explorer
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              High-throughput distributed log viewer with millisecond precision and trace linking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs font-mono"
            >
              {isPaused ? (
                <>
                  <Play className="h-3 w-3 mr-1 text-emerald-400" /> Resume Stream
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 mr-1 text-amber-400" /> Pause Stream
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="p-4 rounded-xl border border-[#1f2538] bg-[#0c0e18] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Query */}
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 text-[#6c7891] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search log messages, request IDs, trace IDs, errors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] placeholder-[#55617a] focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] font-mono focus:outline-none"
            >
              <option value="ALL">All Monitored Services</option>
              {INITIAL_SERVICES.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {(searchQuery || serviceFilter !== "ALL" || levelFilter !== "ALL" || envFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-[#8a94a6] hover:text-white"
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center justify-between pt-2 border-t border-[#171b28]">
            <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233] overflow-x-auto">
              {["ALL", "FATAL", "ERROR", "WARN", "INFO", "DEBUG"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                    levelFilter === lvl
                      ? "bg-[#1f2638] text-cyan-300"
                      : "text-[#718096] hover:text-[#f1f3f9]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#6c7891]">
              <span className="flex items-center gap-1.5">
                <Radio className={`h-3 w-3 ${isPaused ? "text-amber-400" : "text-emerald-400 animate-pulse"}`} />
                {isPaused ? "Stream Paused" : "Live Streaming"}
              </span>
              <span>•</span>
              <span>{filteredLogs.length} events</span>
            </div>
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="rounded-xl border border-[#1f2538] bg-[#07090e] shadow-2xl overflow-hidden font-mono text-xs">
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1017] border-b border-[#1b2133] text-[11px] text-[#6c7891]">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-white/80 font-bold">cloudpulse-log-stream://production</span>
            </div>
            <span>ANSI UTF-8</span>
          </div>

          {/* Logs rows */}
          <div className="divide-y divide-[#131620] max-h-[620px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-[#55617a]">
                No log lines matched the active filters.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    className={`hover:bg-[#0c0f18] transition-colors ${
                      isExpanded ? "bg-[#0b0e16]" : ""
                    }`}
                  >
                    <div
                      className="flex items-start gap-3 p-3 cursor-pointer group"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    >
                      <button className="text-[#55617a] group-hover:text-cyan-400 pt-0.5">
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            isExpanded ? "rotate-90 text-cyan-400" : ""
                          }`}
                        />
                      </button>

                      {/* Timestamp */}
                      <span className="text-[10px] text-[#64748b] shrink-0 pt-0.5">
                        {log.timestamp.replace("T", " ").slice(0, 23)}
                      </span>

                      {/* Level */}
                      <div className="shrink-0">{getLevelBadge(log.level)}</div>

                      {/* Service */}
                      <span className="text-cyan-400/90 shrink-0 font-semibold text-[11px] pt-0.5">
                        [{log.service}]
                      </span>

                      {/* Message */}
                      <span
                        className={`flex-1 break-all text-xs pt-0.5 ${
                          log.level === "ERROR" || log.level === "FATAL"
                            ? "text-rose-200"
                            : log.level === "WARN"
                            ? "text-amber-200"
                            : "text-[#cbd5e1]"
                        }`}
                      >
                        {log.message}
                      </span>

                      {/* Trace ID */}
                      <span className="text-[10px] text-[#55607a] shrink-0 hidden md:inline">
                        {log.traceId}
                      </span>
                    </div>

                    {/* Expanded detail drawer */}
                    {isExpanded && (
                      <div className="px-9 pb-3 pt-1 space-y-2 text-[11px] text-[#8a94a6] bg-[#090b12] border-t border-[#131620]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133]">
                          <div>
                            <span className="text-[#55607a] block text-[10px]">REQUEST ID</span>
                            <span className="text-white flex items-center gap-1">
                              {log.requestId}
                              <button
                                onClick={() => handleCopy(log.requestId, `req-${log.id}`)}
                                className="text-[#55607a] hover:text-cyan-400"
                              >
                                {copiedId === `req-${log.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </span>
                          </div>

                          <div>
                            <span className="text-[#55607a] block text-[10px]">TRACE ID</span>
                            <span className="text-white flex items-center gap-1">
                              {log.traceId}
                              <button
                                onClick={() => handleCopy(log.traceId, `tr-${log.id}`)}
                                className="text-[#55607a] hover:text-cyan-400"
                              >
                                {copiedId === `tr-${log.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </span>
                          </div>

                          <div>
                            <span className="text-[#55607a] block text-[10px]">ENVIRONMENT</span>
                            <span className="text-white">{log.environment}</span>
                          </div>

                          <div>
                            <span className="text-[#55607a] block text-[10px]">SERVICE SLUG</span>
                            <span className="text-white">{log.service}</span>
                          </div>
                        </div>

                        {log.metadata && (
                          <div className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133]">
                            <span className="text-[#55607a] block text-[10px] mb-1">STRUCTURED METADATA</span>
                            <pre className="text-[#cbd5e1] text-[10px] overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

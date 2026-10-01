"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Layers,
  Sparkles,
  Command,
} from "lucide-react";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  systemStatus?: "HEALTHY" | "DEGRADED" | "DOWN";
  selectedEnvironment?: string;
  onSelectEnvironment?: (env: string) => void;
}

export function Topbar({
  onOpenSidebar,
  onOpenSearch,
  systemStatus = "DEGRADED",
  selectedEnvironment = "Production",
  onSelectEnvironment,
}: TopbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  const environments = ["Production", "Staging", "Canary-US"];

  const notifications = [
    {
      id: "n1",
      title: "P99 Latency Anomaly Detected",
      message: "API Gateway latency spiked to 285ms. Anomaly correlation started.",
      time: "2m ago",
      type: "critical",
    },
    {
      id: "n2",
      title: "Deployment #4821 Successful",
      message: "API Gateway v2.14.0 rolled out to 100% production pods.",
      time: "14m ago",
      type: "info",
    },
    {
      id: "n3",
      title: "PgBouncer Pool Utilization > 90%",
      message: "PostgreSQL Primary connections saturated at 48/50 capacity.",
      time: "18m ago",
      type: "warning",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#171b28] bg-[#090b11]/90 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#8a94a6] hover:text-[#f1f3f9] hover:bg-[#141825]"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111420] border border-[#1e2436] hover:border-[#2d364f] hover:bg-[#151926] text-xs text-[#8a94a6] transition-all w-52 sm:w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span className="truncate">Search services, logs...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#181d2c] text-[#718096] rounded border border-[#23293d]">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Environment selector */}
        <div className="relative">
          <button
            onClick={() => setShowEnvDropdown(!showEnvDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111420] border border-[#1e2436] hover:border-[#2d364f] text-xs font-mono text-[#cbd5e1] transition-all"
          >
            <Layers className="h-3 w-3 text-cyan-400" />
            <span className="hidden sm:inline">{selectedEnvironment}</span>
            <ChevronDown className="h-3 w-3 text-[#6b768e]" />
          </button>

          {showEnvDropdown && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-lg border border-[#23293d] bg-[#0d1018] shadow-xl p-1 z-50 animate-in fade-in">
              {environments.map((env) => (
                <button
                  key={env}
                  onClick={() => {
                    onSelectEnvironment?.(env);
                    setShowEnvDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-left ${
                    selectedEnvironment === env
                      ? "bg-cyan-950/50 text-cyan-300 font-medium"
                      : "text-[#94a3b8] hover:bg-[#151926] hover:text-white"
                  }`}
                >
                  <span>{env}</span>
                  {selectedEnvironment === env && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Infrastructure Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#111420] border border-[#1e2436]">
          <StatusDot status={systemStatus} size="sm" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#cbd5e1]">
            {systemStatus === "HEALTHY" ? "System Healthy" : "Degraded Performance"}
          </span>
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#8a94a6] hover:text-[#f1f3f9] hover:bg-[#141825] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#23293d] bg-[#0d1018] shadow-2xl p-0 z-50 animate-in fade-in">
              <div className="flex items-center justify-between p-3 border-b border-[#1b2133]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#f1f3f9]">
                    Infrastructure Alerts
                  </span>
                  <Badge variant="destructive" size="sm">
                    3 new
                  </Badge>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#171b28]">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#121622] transition-colors">
                    <div className="flex items-start gap-2.5">
                      {n.type === "critical" ? (
                        <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : n.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-[#f1f3f9]">{n.title}</p>
                          <span className="text-[10px] font-mono text-[#64748b]">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8a94a6] leading-tight">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Copilot Quick Launch CTA */}
        <Button
          variant="secondary"
          size="sm"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-950/40 hover:text-purple-200"
          onClick={() => router.push("/ai-copilot")}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400 mr-1" />
          <span className="hidden sm:inline">Ask Copilot</span>
        </Button>
      </div>
    </header>
  );
}

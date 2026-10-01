"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  GitCommit,
  AlertOctagon,
  Terminal,
  Activity,
  Bot,
  Users,
  Settings,
  Radio,
  ChevronDown,
  Building2,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeIncidentsCount?: number;
}

export function Sidebar({ isOpen = false, onClose, activeIncidentsCount = 2 }: SidebarProps) {
  const pathname = usePathname();

  const mainNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Services", href: "/services", icon: Server },
    { label: "Deployments", href: "/deployments", icon: GitCommit },
    {
      label: "Incidents",
      href: "/incidents",
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount.toString() : undefined,
      badgeVariant: "destructive" as const,
    },
    { label: "Logs", href: "/logs", icon: Terminal },
    { label: "Metrics", href: "/metrics", icon: Activity },
    {
      label: "AI Copilot",
      href: "/ai-copilot",
      icon: Bot,
      isAi: true,
      badge: "GPT-4o",
      badgeVariant: "purple" as const,
    },
  ];

  const workspaceNav = [
    { label: "Team & Access", href: "/team", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 flex flex-col border-r border-[#191e2c] bg-[#090b11] transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo and Brand */}
        <div className="flex h-14 items-center justify-between px-5 border-b border-[#171b28]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.2)] group-hover:shadow-[0_0_16px_rgba(0,229,255,0.4)] transition-all">
              <Radio className="h-4 w-4 animate-pulse text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#f1f3f9]">
                  CloudPulse
                </span>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  v2.4
                </span>
              </div>
              <span className="text-[10px] text-[#6b768e] tracking-tight">
                Observability Core
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded text-[#8a94a6] hover:text-[#f1f3f9] hover:bg-[#141825]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Workspace Selector */}
        <div className="p-3 border-b border-[#141825]">
          <button className="w-full flex items-center justify-between p-2 rounded-lg bg-[#111420]/80 border border-[#1e2436] hover:border-[#2d364f] transition-all text-left">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-6 w-6 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-[#f1f3f9] truncate">
                  CloudPulse Eng
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  us-east-1
                </span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#6b768e] shrink-0" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#54607b] font-semibold">
              Telemetry & Ops
            </span>
            <nav className="mt-1 space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? item.isAi
                          ? "bg-purple-950/40 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                          : "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]"
                        : "text-[#9aa5ba] hover:text-[#f1f3f9] hover:bg-[#131724]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? item.isAi
                              ? "text-purple-400"
                              : "text-cyan-400"
                            : "text-[#6c7891] group-hover:text-[#cbd5e1]"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant={item.badgeVariant || "default"} size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#54607b] font-semibold">
              Organization
            </span>
            <nav className="mt-1 space-y-0.5">
              {workspaceNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                        : "text-[#9aa5ba] hover:text-[#f1f3f9] hover:bg-[#131724]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-cyan-400" : "text-[#6c7891] group-hover:text-[#cbd5e1]"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick incident alert teaser */}
          {activeIncidentsCount > 0 && (
            <div className="p-3 rounded-lg border border-rose-500/25 bg-rose-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>Active Incident</span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-tight">
                INC-8042: API Gateway connection pool exhaustion
              </p>
              <Link
                href="/incidents/inc-8042"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 hover:underline pt-1"
              >
                Inspect root cause <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          )}
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-[#141825] bg-[#080a0f]">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#121622] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-1 ring-white/10">
                SR
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-[#f1f3f9] truncate">
                  Sagar Singh Rajawat
                </span>
                <span className="text-[10px] text-[#6b768e] font-mono truncate">
                  sagar@cloudpulse.dev
                </span>
              </div>
            </div>
            <Badge variant="cyan" size="sm" className="shrink-0 text-[9px] uppercase">
              Owner
            </Badge>
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Server,
  GitCommit,
  AlertOctagon,
  Terminal,
  Activity,
  Bot,
  Users,
  Settings,
  ArrowRight,
  X,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent state or event
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard", group: "Navigation" },
    { label: "Services Explorer", icon: Server, href: "/services", group: "Navigation" },
    { label: "Deployments Timeline", icon: GitCommit, href: "/deployments", group: "Navigation" },
    { label: "Incident Command Center", icon: AlertOctagon, href: "/incidents", group: "Navigation" },
    { label: "Log Stream Explorer", icon: Terminal, href: "/logs", group: "Navigation" },
    { label: "Real-time Metrics", icon: Activity, href: "/metrics", group: "Navigation" },
    { label: "AI Incident Copilot", icon: Bot, href: "/ai-copilot", group: "Navigation" },
    { label: "Team & RBAC", icon: Users, href: "/team", group: "Workspace" },
    { label: "Settings & API Keys", icon: Settings, href: "/settings", group: "Workspace" },
    // Direct operational shortcuts
    { label: "API Gateway (Degraded)", icon: Server, href: "/services/srv-api-gateway", group: "Quick Jump" },
    { label: "PostgreSQL Primary (Degraded)", icon: Server, href: "/services/srv-postgresql-primary", group: "Quick Jump" },
    { label: "INC-8042: Connection Pool Exhaustion", icon: AlertOctagon, href: "/incidents/inc-8042", group: "Quick Jump" },
    { label: "Deployment #4821 (API Gateway)", icon: GitCommit, href: "/deployments/dep-4821", group: "Quick Jump" },
  ];

  const filtered = quickNav.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-xl border border-[#262e45] bg-[#0c0f18] shadow-2xl shadow-cyan-950/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[#1b2133] gap-3">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, service name, incident ID, or page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#f1f3f9] placeholder-[#64748b] focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748b] hover:text-[#f1f3f9] hover:bg-[#1a2030]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748b]">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigateTo(item.href)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-[#cbd5e1] hover:bg-[#161c2b] hover:text-cyan-400 group transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#8a94a6] group-hover:text-cyan-400 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#55607a] font-mono group-hover:text-cyan-500/80">
                      {item.group}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-[#090b12] border-t border-[#1b2133] text-[11px] text-[#64748b] font-mono">
          <span>Navigation: ↑ ↓ Enter</span>
          <span>Close: Esc</span>
        </div>
      </div>
    </div>
  );
}

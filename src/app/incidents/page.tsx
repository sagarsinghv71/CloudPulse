"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  User,
  Flame,
  ShieldAlert,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_INCIDENTS, INITIAL_SERVICES } from "@/lib/data/mock-store";
import { IncidentData, IncidentSeverity, IncidentStatus } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentData[]>(INITIAL_INCIDENTS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>("CRITICAL");
  const [selectedService, setSelectedService] = useState<string>("API Gateway");

  const filtered = incidents.filter((inc) => {
    const matchesStatus = statusFilter === "ALL" || inc.status === statusFilter;
    const matchesSeverity = severityFilter === "ALL" || inc.severity === severityFilter;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.affectedServices.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL" && i.status !== "RESOLVED").length;

  const handleDeclareIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newIncident: IncidentData = {
      id: `inc-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      description: newDesc,
      severity: newSeverity,
      status: "INVESTIGATING",
      affectedServices: [selectedService],
      assignedEngineer: "Sagar Singh Rajawat",
      assignedEngineerEmail: "sagar@cloudpulse.dev",
      startedAt: new Date().toISOString(),
      events: [
        {
          id: `evt-${Date.now().toString().slice(-4)}`,
          incidentId: "temp",
          type: "DETECTED",
          title: "Incident Declared by Operator",
          description: newDesc,
          authorName: "Sagar Singh Rajawat",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setIncidents([newIncident, ...incidents]);
    setIsDeclareModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return <Badge variant="destructive" size="sm">CRITICAL</Badge>;
      case "HIGH":
        return <Badge variant="warning" size="sm">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="cyan" size="sm">MEDIUM</Badge>;
      case "LOW":
        return <Badge variant="secondary" size="sm">LOW</Badge>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case "INVESTIGATING":
        return (
          <span className="text-rose-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            INVESTIGATING
          </span>
        );
      case "IDENTIFIED":
        return (
          <span className="text-amber-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            IDENTIFIED
          </span>
        );
      case "MONITORING":
        return (
          <span className="text-cyan-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            MONITORING
          </span>
        );
      case "RESOLVED":
        return (
          <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            RESOLVED
          </span>
        );
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Incident Command Center
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Live war-room triage, automated telemetry blast-radius detection, and RCA timelines.
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeclareModalOpen(true)}
            className="text-xs"
          >
            <Flame className="h-4 w-4 mr-1.5" />
            Declare Incident
          </Button>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-1">
            <span className="text-[11px] font-mono text-rose-400 uppercase flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Active Incidents
            </span>
            <div className="text-2xl font-bold font-mono text-rose-400">{activeCount}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
            <span className="text-[11px] font-mono text-amber-400 uppercase">Critical P0/P1</span>
            <div className="text-2xl font-bold font-mono text-amber-400">{criticalCount}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-1">
            <span className="text-[11px] font-mono text-cyan-400 uppercase">Avg MTTR</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">24m</div>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Resolved This Week</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">14</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-[#6c7891] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, title, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#111420] border border-[#1e2436] text-xs text-[#f1f3f9] placeholder-[#64748b] focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Status pills */}
            <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
              {["ALL", "INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? "bg-[#1c2233] text-cyan-300 font-semibold"
                      : "text-[#718096] hover:text-[#f1f3f9]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Severity pills */}
            <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                    severityFilter === sev
                      ? "bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/40"
                      : "text-[#718096] hover:text-[#f1f3f9]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="rounded-xl border border-[#1f2538] bg-[#0c0e17] overflow-hidden shadow-sm">
          <div className="divide-y divide-[#161a27]">
            {filtered.map((inc) => (
              <Link
                key={inc.id}
                href={`/incidents/${inc.id}`}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#121623] transition-colors group block"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-rose-400 group-hover:text-cyan-400 transition-colors">
                      {inc.id.toUpperCase()}
                    </span>
                    {getSeverityBadge(inc.severity)}
                    {getStatusBadge(inc.status)}
                    <span className="text-[10px] font-mono text-[#6c7891]">
                      Started {timeAgo(inc.startedAt)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#f1f3f9] line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {inc.title}
                  </h3>

                  <p className="text-xs text-[#8a94a6] line-clamp-2 max-w-3xl leading-relaxed">
                    {inc.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#64748b]">
                    <span className="text-[#8a94a6]">Affected:</span>
                    <div className="flex flex-wrap gap-1">
                      {inc.affectedServices.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-[#161b28] text-cyan-300 border border-[#22293e]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> Commander: {inc.assignedEngineer}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#171b28]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs group-hover:border-cyan-500/40"
                  >
                    Open War Room <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Declare Incident Modal */}
        {isDeclareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#0c0f18] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <div className="flex items-center gap-2 text-rose-400">
                  <Flame className="h-5 w-5" />
                  <h3 className="text-base font-bold text-[#f1f3f9]">Declare New Incident</h3>
                </div>
                <button
                  onClick={() => setIsDeclareModalOpen(false)}
                  className="text-[#64748b] hover:text-[#f1f3f9]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleDeclareIncident} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Incident Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ingress Latency Spike on API Gateway"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#cbd5e1]">Severity</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                      className="w-full h-9 px-2 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none font-mono"
                    >
                      <option value="CRITICAL">Critical (P0)</option>
                      <option value="HIGH">High (P1)</option>
                      <option value="MEDIUM">Medium (P2)</option>
                      <option value="LOW">Low (P3)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#cbd5e1]">Affected Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none font-mono"
                    >
                      {INITIAL_SERVICES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Description & Symptoms</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe symptoms, customer impact, and initial telemetry signals..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#171b28]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeclareModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" size="sm">
                    Declare & Open War Room
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

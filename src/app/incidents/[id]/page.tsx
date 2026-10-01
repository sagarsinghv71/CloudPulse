"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  GitCommit,
  Clock,
  Plus,
  Sparkles,
  ChevronRight,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { INITIAL_INCIDENTS, INITIAL_DEPLOYMENTS, INITIAL_LOGS } from "@/lib/data/mock-store";
import { IncidentData, IncidentEventType, IncidentStatus } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [incident, setIncident] = useState<IncidentData>(() => {
    return (
      INITIAL_INCIDENTS.find((i) => i.id.toLowerCase() === id.toLowerCase()) ||
      INITIAL_INCIDENTS[0]
    );
  });

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventType, setEventType] = useState<IncidentEventType>("NOTE_ADDED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Correlated deployment
  const relatedDeployment = INITIAL_DEPLOYMENTS.find(
    (d) => d.id === incident.relatedDeploymentId
  );

  // Relevant error logs
  const relevantLogs = INITIAL_LOGS.filter(
    (l) => l.level === "ERROR" || l.level === "FATAL" || l.level === "WARN"
  ).slice(0, 4);

  const handleUpdateStatus = async (newStatus: IncidentStatus) => {
    try {
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setIncident(data.incident);
      }
    } catch {
      // Local fallback
      setIncident((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDesc.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/incidents/${incident.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: eventType,
          title: eventTitle,
          description: eventDesc,
          authorName: "Sagar Singh Rajawat",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIncident(data.incident);
        setIsAddEventOpen(false);
        setEventTitle("");
        setEventDesc("");
      }
    } catch {
      // Local state fallback
      const newEvt = {
        id: `evt-${Date.now()}`,
        incidentId: incident.id,
        type: eventType,
        title: eventTitle,
        description: eventDesc,
        authorName: "Sagar Singh Rajawat",
        createdAt: new Date().toISOString(),
      };
      setIncident((prev) => ({
        ...prev,
        events: [...(prev.events || []), newEvt],
        status: eventType === "RESOLVED" ? "RESOLVED" : prev.status,
      }));
      setIsAddEventOpen(false);
      setEventTitle("");
      setEventDesc("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#718096]">
          <Link href="/incidents" className="hover:text-cyan-400 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Incidents
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{incident.id.toUpperCase()}</span>
        </div>

        {/* War Room Header Banner */}
        <div className="p-6 rounded-2xl border border-rose-500/30 bg-[#0c0f18] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-mono font-bold text-rose-400">
                {incident.id.toUpperCase()}
              </span>
              <Badge
                variant={incident.severity === "CRITICAL" ? "destructive" : "warning"}
                size="md"
              >
                {incident.severity}
              </Badge>
              <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
                {(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"] as IncidentStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                        incident.status === st
                          ? st === "RESOLVED"
                            ? "bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/40"
                            : "bg-rose-950 text-rose-300 font-bold border border-rose-800/40"
                          : "text-[#718096] hover:text-[#f1f3f9]"
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#f1f3f9]">
              {incident.title}
            </h1>

            <p className="text-xs text-[#cbd5e1] max-w-3xl leading-relaxed">
              {incident.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#6c7891]">
              <span>Started: <strong className="text-white">{timeAgo(incident.startedAt)}</strong></span>
              <span>•</span>
              <span>Assigned Commander: <strong className="text-white">{incident.assignedEngineer}</strong></span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span>Services:</span>
                {incident.affectedServices.map((s) => (
                  <span key={s} className="px-1.5 py-0.2 rounded bg-[#161b28] text-cyan-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/ai-copilot">
              <Button
                variant="secondary"
                size="sm"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-950/40 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                Launch Copilot RCA
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Root-Cause Investigation Card */}
        {incident.aiRootCause && (
          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-mono">
                <Bot className="h-4 w-4" />
                <span>CloudPulse AI Investigation Summary</span>
                <Badge variant="purple" size="sm">
                  96% Confidence
                </Badge>
              </div>
              <Link href="/ai-copilot" className="text-[11px] text-purple-300 hover:underline flex items-center gap-1 font-mono">
                Open Full Copilot Session <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-[#e2e8f0] leading-relaxed">
              {incident.aiRootCause}
            </p>
          </div>
        )}

        {/* Split Grid: Incident Timeline & Correlated Context */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Feed */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <CardTitle>Milestone Timeline & Events</CardTitle>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAddEventOpen(!isAddEventOpen)}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Event addition form */}
              {isAddEventOpen && (
                <form
                  onSubmit={handleAddEvent}
                  className="p-4 rounded-xl border border-[#23293d] bg-[#111420] space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-[#f1f3f9]">
                      Log New Timeline Event
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddEventOpen(false)}
                      className="text-xs text-[#8a94a6] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as IncidentEventType)}
                      className="h-8 px-2 rounded-lg bg-[#0a0d14] border border-[#23293d] text-xs text-[#f1f3f9] font-mono"
                    >
                      <option value="NOTE_ADDED">Note Added</option>
                      <option value="ACKNOWLEDGED">Acknowledged</option>
                      <option value="INVESTIGATION_STARTED">Investigation Started</option>
                      <option value="ROOT_CAUSE_IDENTIFIED">Root Cause Identified</option>
                      <option value="MITIGATION_APPLIED">Mitigation Applied</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Event Title..."
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="h-8 px-3 rounded-lg bg-[#0a0d14] border border-[#23293d] text-xs text-[#f1f3f9] font-mono"
                    />
                  </div>

                  <textarea
                    rows={2}
                    required
                    placeholder="Details or action taken..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#0a0d14] border border-[#23293d] text-xs text-[#f1f3f9] font-mono"
                  />

                  <div className="flex justify-end">
                    <Button type="submit" variant="cyanGlow" size="sm" isLoading={isSubmitting}>
                      Save Event
                    </Button>
                  </div>
                </form>
              )}

              {/* Timeline nodes */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1a2030]">
                {(incident.events || []).map((evt) => (
                  <div key={evt.id} className="relative space-y-1">
                    <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-cyan-400 ring-4 ring-[#08090d]" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-[#f1f3f9]">
                        {evt.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#6c7891]">
                        {timeAgo(evt.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-[#8a94a6] leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="text-[10px] font-mono text-[#525f7a]">
                      Logged by {evt.authorName}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Info: Correlated Deployment & Logs */}
          <div className="space-y-6">
            {/* Correlated Deployment */}
            {relatedDeployment ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-cyan-400" />
                    <CardTitle>Correlated Deployment</CardTitle>
                  </div>
                  <Badge variant="cyan" size="sm">
                    {relatedDeployment.version}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                  <p className="text-xs text-[#cbd5e1] font-mono">
                    {relatedDeployment.commitMessage}
                  </p>
                  <div className="text-[11px] font-mono text-[#6c7891] space-y-1">
                    <div>Commit: <strong className="text-cyan-400">{relatedDeployment.commitSha}</strong></div>
                    <div>Service: {relatedDeployment.serviceName}</div>
                    <div>Rollout: {timeAgo(relatedDeployment.createdAt)}</div>
                  </div>
                  <Link href={`/deployments/${relatedDeployment.id}`}>
                    <Button variant="secondary" size="sm" className="w-full text-xs mt-2">
                      Inspect Deployment & Rollback <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-xs text-[#64748b]">
                  No direct deployment correlation detected.
                </CardContent>
              </Card>
            )}

            {/* Relevant Error Logs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-rose-400" />
                  <CardTitle>Relevant Telemetry Errors</CardTitle>
                </div>
                <Link href="/logs" className="text-xs text-cyan-400 hover:underline">
                  All logs
                </Link>
              </CardHeader>
              <CardContent className="space-y-2 pt-3">
                {relevantLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[#08090f] border border-[#1b2031] text-[11px] font-mono text-[#94a3b8] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-rose-400 font-bold">{log.level}</span>
                      <span className="text-[#55617a]">{log.service}</span>
                    </div>
                    <p className="truncate text-white/90">{log.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

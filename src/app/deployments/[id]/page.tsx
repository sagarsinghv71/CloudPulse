"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  GitCommit,
  GitBranch,
  ArrowLeft,
  RotateCcw,
  FileCode,
  Terminal,
  AlertOctagon,
  ShieldAlert,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { INITIAL_DEPLOYMENTS, INITIAL_INCIDENTS } from "@/lib/data/mock-store";
import { DeploymentData } from "@/types";
import { formatDuration } from "@/lib/utils";

export default function DeploymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [deployment, setDeployment] = useState<DeploymentData>(() => {
    return (
      INITIAL_DEPLOYMENTS.find((d) => d.id === id) || INITIAL_DEPLOYMENTS[0]
    );
  });

  const [isRollbackDialogOpen, setIsRollbackDialogOpen] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState(false);

  // Associated incidents
  const associatedIncidents = INITIAL_INCIDENTS.filter(
    (inc) => inc.relatedDeploymentId === deployment.id
  );

  const handleExecuteRollback = async () => {
    setIsRollingBack(true);
    try {
      const res = await fetch(`/api/deployments/${deployment.id}/rollback`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setDeployment((prev) => ({
          ...prev,
          status: "ROLLED_BACK",
          buildLogs: [
            ...(prev.buildLogs || []),
            `[${new Date().toLocaleTimeString()}] ⚠️ Automated rollback requested by on-call operator.`,
            `[${new Date().toLocaleTimeString()}] 📦 Restoring previous healthy container tag...`,
            `[${new Date().toLocaleTimeString()}] ✅ Rollback shift verified 100%. Pods healthy.`,
          ],
        }));
        setRollbackSuccess(true);
      }
    } catch (err) {
      console.error("Rollback failed:", err);
    } finally {
      setIsRollingBack(false);
      setIsRollbackDialogOpen(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#718096]">
          <Link href="/deployments" className="hover:text-cyan-400 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Deployments
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{deployment.version}</span>
        </div>

        {/* Rollback Success Banner */}
        {rollbackSuccess && (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>
                <strong>Rollback Completed:</strong> Service restored to previous stable build.
                (Simulated Operation)
              </span>
            </div>
            <button
              onClick={() => setRollbackSuccess(false)}
              className="text-[#94a3b8] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Header Hero Banner */}
        <div className="p-6 rounded-2xl border border-[#23293d] bg-[#0c0f18] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <GitCommit className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold font-mono text-[#f1f3f9]">
                  {deployment.serviceName}
                </h1>
                <span className="text-sm font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40">
                  {deployment.version}
                </span>
                <Badge
                  variant={
                    deployment.status === "SUCCESSFUL"
                      ? "success"
                      : deployment.status === "ROLLED_BACK"
                      ? "warning"
                      : "destructive"
                  }
                  size="md"
                >
                  <StatusDot status={deployment.status} size="sm" pulse={false} />
                  <span className="ml-1">{deployment.status}</span>
                </Badge>
              </div>

              <p className="text-sm text-[#cbd5e1] font-mono">
                {deployment.commitMessage}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#6c7891] pt-1">
                <span>Commit: <strong className="text-cyan-400">{deployment.commitSha}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" /> {deployment.branch}</span>
                <span>•</span>
                <span>Author: {deployment.authorName}</span>
                <span>•</span>
                <span>Duration: {formatDuration(deployment.durationMs)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deployment.status !== "ROLLED_BACK" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsRollbackDialogOpen(true)}
                className="text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Rollback Deployment
              </Button>
            )}
          </div>
        </div>

        {/* Associated Incidents Warning */}
        {associatedIncidents.length > 0 && (
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono uppercase">
              <AlertOctagon className="h-4 w-4" />
              <span>Correlated Incidents Triggered By This Deployment</span>
            </div>
            {associatedIncidents.map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-rose-500/20"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {inc.id.toUpperCase()}
                    </span>
                    <Badge variant="destructive" size="sm">{inc.severity}</Badge>
                  </div>
                  <p className="text-xs text-[#cbd5e1] mt-0.5">{inc.title}</p>
                </div>
                <Link href={`/incidents/${inc.id}`}>
                  <Button variant="secondary" size="sm" className="text-xs text-rose-300">
                    Inspect Incident
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Split grid: Changed Files & Build Pipeline Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Changed Files */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <CardTitle>Changed Files ({deployment.changedFiles?.length || 0})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              {(deployment.changedFiles || []).map((file, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133] text-xs font-mono text-[#cbd5e1] flex items-center justify-between"
                >
                  <span className="truncate">{file}</span>
                  <span className="text-[10px] text-emerald-400 ml-2 shrink-0">+MOD</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Build Pipeline Logs */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <CardTitle>Build & Deploy Pipeline Logs</CardTitle>
              </div>
              <Badge variant="secondary" size="sm">
                OCI Container Runner
              </Badge>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="rounded-xl border border-[#1f2538] bg-[#07090e] p-4 font-mono text-xs text-[#9aa5ba] space-y-2 overflow-x-auto max-h-[380px]">
                {(deployment.buildLogs || []).map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rollback Confirmation Modal Dialog */}
        {isRollbackDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#0c0f18] shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#f1f3f9]">
                    Confirm Deployment Rollback
                  </h3>
                  <p className="text-[11px] text-[#8a94a6]">
                    Simulated Operation (Safe Developer Sandbox)
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#141825] border border-[#23293d] text-xs text-[#cbd5e1] space-y-2">
                <p>
                  Are you sure you want to rollback <strong>{deployment.serviceName} {deployment.version}</strong>?
                </p>
                <div className="text-[11px] text-[#8a94a6] pl-2 border-l-2 border-rose-500/40">
                  • Reverts cluster ingress traffic to previous stable revision.<br />
                  • Status will be updated to <code>ROLLED_BACK</code>.<br />
                  • Rollback event recorded in audit logs.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRollbackDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  isLoading={isRollingBack}
                  onClick={handleExecuteRollback}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Execute Rollback
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

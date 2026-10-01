"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Server,
  Plus,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INITIAL_SERVICES } from "@/lib/data/mock-store";
import { ServiceData } from "@/types";
import { formatNumber, timeAgo } from "@/lib/utils";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceData[]>(INITIAL_SERVICES);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filteredServices = services.filter((s) => {
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: services.length,
    healthy: services.filter((s) => s.status === "HEALTHY").length,
    degraded: services.filter((s) => s.status === "DEGRADED").length,
    down: services.filter((s) => s.status === "DOWN").length,
  };

  const handleRegisterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    const newService: ServiceData = {
      id: `srv-${newSlug.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: newName,
      slug: newSlug.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: newDesc || "Custom microservice registered via console",
      status: "HEALTHY",
      uptime: 100.0,
      latency: 48,
      requestsPerSec: 450,
      errorRate: 0.0,
      cpuUsage: 18.5,
      memoryUsage: 32.0,
      lastDeployment: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      environment: "production",
    };

    setServices([newService, ...services]);
    setIsRegisterModalOpen(false);
    setNewName("");
    setNewSlug("");
    setNewDesc("");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
              Services Explorer
            </h1>
            <p className="text-xs text-[#8a94a6] mt-0.5">
              Live status, throughput, p99 latency, and resource metrics across all registered services.
            </p>
          </div>

          <Button
            variant="cyanGlow"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            className="text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Register Service
          </Button>
        </div>

        {/* Quick status summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-[#1e2436] bg-[#0c0f18] space-y-1">
            <span className="text-[11px] font-mono text-[#718096] uppercase">Total Services</span>
            <div className="text-2xl font-bold font-mono text-[#f1f3f9]">{counts.total}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Healthy
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{counts.healthy}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
            <span className="text-[11px] font-mono text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Degraded
            </span>
            <div className="text-2xl font-bold font-mono text-amber-400">{counts.degraded}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
            <span className="text-[11px] font-mono text-rose-400 uppercase flex items-center gap-1.5">
              <AlertOctagon className="h-3.5 w-3.5" /> Down
            </span>
            <div className="text-2xl font-bold font-mono text-rose-400">{counts.down}</div>
          </div>
        </div>

        {/* Filters and search toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="h-3.5 w-3.5 text-[#6c7891] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter services by name, slug, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#111420] border border-[#1e2436] text-xs text-[#f1f3f9] placeholder-[#64748b] focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status pills */}
            <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
              {["ALL", "HEALTHY", "DEGRADED", "DOWN"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    statusFilter === st
                      ? "bg-[#1c2233] text-cyan-300 font-semibold"
                      : "text-[#718096] hover:text-[#f1f3f9]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-[#10131c] rounded-lg p-0.5 border border-[#1c2233]">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "table" ? "bg-[#1c2233] text-cyan-400" : "text-[#718096] hover:text-[#f1f3f9]"
                }`}
                title="Table view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "grid" ? "bg-[#1c2233] text-cyan-400" : "text-[#718096] hover:text-[#f1f3f9]"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Services Listing */}
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-[#23293d] bg-[#0c0e16]/40">
            <Server className="h-8 w-8 text-[#55607a] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#cbd5e1]">No services matched your query</p>
            <p className="text-xs text-[#64748b] mt-1">Try resetting the status filter or search text</p>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="rounded-xl border border-[#1f2538] bg-[#0c0e17] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111420] text-[#718096] border-b border-[#1b2133] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Uptime</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Throughput</th>
                    <th className="py-3 px-4">Error Rate</th>
                    <th className="py-3 px-4">CPU / Memory</th>
                    <th className="py-3 px-4">Last Deploy</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161a27] text-[#cbd5e1]">
                  {filteredServices.map((svc) => (
                    <tr
                      key={svc.id}
                      className="hover:bg-[#131724] transition-colors group cursor-pointer"
                      onClick={() => router.push(`/services/${svc.id}`)}
                    >
                      <td className="py-3.5 px-4 font-sans font-semibold text-[#f1f3f9]">
                        <div className="flex items-center gap-2.5">
                          <StatusDot status={svc.status} size="sm" />
                          <div>
                            <div className="group-hover:text-cyan-400 transition-colors">
                              {svc.name}
                            </div>
                            <span className="text-[10px] text-[#64748b] font-mono block">
                              {svc.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            svc.status === "HEALTHY"
                              ? "success"
                              : svc.status === "DEGRADED"
                              ? "warning"
                              : "destructive"
                          }
                          size="sm"
                        >
                          {svc.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">{svc.uptime}%</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={svc.latency > 200 ? "text-amber-400 font-bold" : "text-[#cbd5e1]"}
                        >
                          {svc.latency}ms
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{formatNumber(svc.requestsPerSec)} req/s</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={svc.errorRate > 1.0 ? "text-rose-400 font-bold" : "text-[#cbd5e1]"}
                        >
                          {svc.errorRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">
                        <span className={svc.cpuUsage > 80 ? "text-rose-400" : ""}>
                          {svc.cpuUsage}%
                        </span>{" "}
                        /{" "}
                        <span className={svc.memoryUsage > 85 ? "text-rose-400" : ""}>
                          {svc.memoryUsage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8a94a6] text-[11px]">
                        {svc.lastDeployment ? timeAgo(svc.lastDeployment) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/services/${svc.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          Inspect <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((svc) => (
              <Card
                key={svc.id}
                className="hover:border-cyan-500/40 transition-all cursor-pointer group"
                onClick={() => router.push(`/services/${svc.id}`)}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <StatusDot status={svc.status} size="md" />
                      <div>
                        <h3 className="text-sm font-bold text-[#f1f3f9] group-hover:text-cyan-300 transition-colors">
                          {svc.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#6c7891]">{svc.slug}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        svc.status === "HEALTHY"
                          ? "success"
                          : svc.status === "DEGRADED"
                          ? "warning"
                          : "destructive"
                      }
                      size="sm"
                    >
                      {svc.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#8a94a6] line-clamp-2 leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#171b28] text-center font-mono">
                    <div className="p-1.5 rounded bg-[#10131d]">
                      <span className="text-[9px] text-[#6b768e] block uppercase">Uptime</span>
                      <span className="text-xs font-semibold text-[#f1f3f9]">{svc.uptime}%</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#10131d]">
                      <span className="text-[9px] text-[#6b768e] block uppercase">Latency</span>
                      <span className={`text-xs font-semibold ${svc.latency > 200 ? "text-amber-400" : "text-[#f1f3f9]"}`}>
                        {svc.latency}ms
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-[#10131d]">
                      <span className="text-[9px] text-[#6b768e] block uppercase">Error</span>
                      <span className={`text-xs font-semibold ${svc.errorRate > 1.0 ? "text-rose-400" : "text-[#f1f3f9]"}`}>
                        {svc.errorRate}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#64748b]">
                    <span>CPU: {svc.cpuUsage}% | Mem: {svc.memoryUsage}%</span>
                    <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal dialog to register a new service */}
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-[#23293d] bg-[#0c0f18] shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-[#f1f3f9]">Register Monitored Service</h3>
                </div>
                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="text-[#64748b] hover:text-[#f1f3f9]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterService} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Search Indexer"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (!newSlug) {
                        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                      }
                    }}
                    className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Slug / Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. search-indexer"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#cbd5e1]">Description</label>
                  <textarea
                    rows={2}
                    placeholder="What does this service do?"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#171b28]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRegisterModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="cyanGlow" size="sm">
                    Register Service
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

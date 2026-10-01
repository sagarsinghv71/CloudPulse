"use client";

import React, { useState } from "react";
import {
  User,
  Building2,
  Key,
  Shield,
  Bell,
  Layers,
  Copy,
  Check,
  Plus,
  Trash2,
  Lock,
  Save,
  CheckCircle2,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<
    "profile" | "workspace" | "apikeys" | "security" | "notifications" | "environments"
  >("profile");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerateKeyOpen, setIsGenerateKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [freshlyGeneratedKey, setFreshlyGeneratedKey] = useState<string | null>(null);

  // Form states
  const [profileName, setProfileName] = useState("Sagar Singh Rajawat");
  const [profileEmail] = useState("sagar@cloudpulse.dev");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-1",
      name: "Production Ingestion Agent",
      masked: "cp_live_************************4f2a",
      createdAt: "2026-09-15",
      lastUsed: "2 mins ago",
    },
    {
      id: "key-2",
      name: "GitHub Actions CI/CD Webhook",
      masked: "cp_live_************************9b18",
      createdAt: "2026-08-01",
      lastUsed: "14 mins ago",
    },
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const plaintext = `cp_live_${randomSuffix}`;

    setFreshlyGeneratedKey(plaintext);
    setApiKeys([
      {
        id: `key-${Date.now()}`,
        name: newKeyName,
        masked: `cp_live_************************${plaintext.slice(-4)}`,
        createdAt: "Just now",
        lastUsed: "Never",
      },
      ...apiKeys,
    ]);
    setNewKeyName("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "workspace", label: "Workspace", icon: Building2 },
    { id: "apikeys", label: "API Keys", icon: Key },
    { id: "security", label: "Security & Sessions", icon: Shield },
    { id: "notifications", label: "Notifications & Pager", icon: Bell },
    { id: "environments", label: "Environments", icon: Layers },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
            Organization Settings
          </h1>
          <p className="text-xs text-[#8a94a6] mt-0.5">
            Manage your account preferences, secrets, access tokens, and infrastructure environments.
          </p>
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Subnav */}
          <div className="md:col-span-1 space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as typeof activeSection)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium font-mono text-left transition-all ${
                    isActive
                      ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                      : "text-[#8a94a6] hover:text-[#f1f3f9] hover:bg-[#121622]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-[#6c7891]"}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section content */}
          <div className="md:col-span-3">
            {/* PROFILE SECTION */}
            {activeSection === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {savedSuccess && (
                    <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Profile changes saved successfully.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-[#cbd5e1]">Full Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-[#cbd5e1]">Email Address</label>
                        <input
                          type="email"
                          disabled
                          value={profileEmail}
                          className="w-full h-9 px-3 rounded-lg bg-[#0e111a] border border-[#1b2133] text-xs text-[#6c7891] font-mono cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs font-mono text-[#8a94a6]">Role:</span>
                      <Badge variant="cyan" size="sm">
                        WORKSPACE OWNER
                      </Badge>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" variant="cyanGlow" size="sm">
                        <Save className="h-3.5 w-3.5 mr-1" /> Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* WORKSPACE SECTION */}
            {activeSection === "workspace" && (
              <Card>
                <CardHeader>
                  <CardTitle>Workspace Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-lg bg-[#0e111a] border border-[#1b2133] space-y-1">
                      <span className="text-[#6c7891]">WORKSPACE NAME</span>
                      <p className="text-sm font-bold text-white">CloudPulse Engineering</p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#0e111a] border border-[#1b2133] space-y-1">
                      <span className="text-[#6c7891]">SLUG / IDENTIFIER</span>
                      <p className="text-sm font-bold text-cyan-400">cloudpulse-eng</p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#0e111a] border border-[#1b2133] space-y-1">
                      <span className="text-[#6c7891]">PRIMARY REGION</span>
                      <p className="text-sm font-bold text-white">us-east-1 (AWS N. Virginia)</p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#0e111a] border border-[#1b2133] space-y-1">
                      <span className="text-[#6c7891]">TELEMETRY RETENTION</span>
                      <p className="text-sm font-bold text-emerald-400">30 Days (High Resolution)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API KEYS SECTION */}
            {activeSection === "apikeys" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle>API Ingestion Keys</CardTitle>
                    <p className="text-[11px] text-[#8a94a6] mt-0.5">
                      Bearer tokens used by agents and daemons to send telemetry into CloudPulse.
                    </p>
                  </div>
                  <Button
                    variant="cyanGlow"
                    size="sm"
                    onClick={() => {
                      setFreshlyGeneratedKey(null);
                      setIsGenerateKeyOpen(true);
                    }}
                    className="text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Generate New Key
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-3">
                  {/* Security Notice */}
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-center gap-2">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>
                      Keys are hashed with SHA-256 and never displayed in plaintext after creation.
                    </span>
                  </div>

                  {/* Keys list */}
                  <div className="space-y-3">
                    {apiKeys.map((k) => (
                      <div
                        key={k.id}
                        className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{k.name}</span>
                            <span className="text-[10px] text-[#6c7891]">{k.createdAt}</span>
                          </div>
                          <span className="text-xs text-[#8a94a6] tracking-wider block">
                            {k.masked}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-[#55617a]">Used: {k.lastUsed}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setApiKeys(apiKeys.filter((item) => item.id !== k.id))
                            }
                            className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SECURITY SECTION */}
            {activeSection === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security & Session Isolation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">HTTP-Only Cookie Sessions</span>
                      <p className="text-[11px] text-[#8a94a6] mt-0.5">
                        Client JavaScript cannot access session tokens (XSS protection).
                      </p>
                    </div>
                    <Badge variant="success" size="sm">
                      ENABLED
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Workspace Data Isolation</span>
                      <p className="text-[11px] text-[#8a94a6] mt-0.5">
                        Every service, log line, and metric is scoped to workspace ID.
                      </p>
                    </div>
                    <Badge variant="cyan" size="sm">
                      ENFORCED
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeSection === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Slack Webhook Sync</span>
                      <p className="text-[11px] text-[#8a94a6] mt-0.5">
                        Channel: #incidents-war-room (CloudPulse Bot)
                      </p>
                    </div>
                    <Badge variant="success" size="sm">
                      CONNECTED
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">PagerDuty Integration</span>
                      <p className="text-[11px] text-[#8a94a6] mt-0.5">
                        Triggers high-urgency page on P0/P1 incidents.
                      </p>
                    </div>
                    <Badge variant="cyan" size="sm">
                      ACTIVE
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ENVIRONMENTS SECTION */}
            {activeSection === "environments" && (
              <Card>
                <CardHeader>
                  <CardTitle>Infrastructure Environments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs font-mono">
                  {[
                    { name: "Production", slug: "production", isProd: true, services: 6 },
                    { name: "Staging", slug: "staging", isProd: false, services: 4 },
                    { name: "Canary-US", slug: "canary-us", isProd: false, services: 2 },
                  ].map((env) => (
                    <div
                      key={env.slug}
                      className="p-3.5 rounded-xl border border-[#1b2133] bg-[#0e111a] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-white font-bold">{env.name}</span>
                        {env.isProd && <Badge variant="destructive" size="sm">PROD</Badge>}
                        <span className="text-[10px] text-[#6c7891]">({env.slug})</span>
                      </div>
                      <span className="text-[#8a94a6]">{env.services} services routed</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Generate Key Modal */}
        {isGenerateKeyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#0c0f18] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Key className="h-4 w-4" />
                  <h3 className="text-base font-bold text-[#f1f3f9]">Generate New Ingestion Key</h3>
                </div>
                <button
                  onClick={() => setIsGenerateKeyOpen(false)}
                  className="text-[#64748b] hover:text-[#f1f3f9]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {freshlyGeneratedKey ? (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300">
                    <p className="font-bold">⚠️ Copy this key now:</p>
                    <p className="text-[11px] mt-0.5">
                      For security reasons, this key will never be displayed in plaintext again.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07090e] border border-[#23293d] flex items-center justify-between gap-2">
                    <span className="text-cyan-300 font-bold truncate">
                      {freshlyGeneratedKey}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(freshlyGeneratedKey, "fresh")}
                    >
                      {copiedKey === "fresh" ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="cyanGlow"
                      size="sm"
                      onClick={() => setIsGenerateKeyOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGenerateKey} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#cbd5e1]">Key Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS Lambda Ingestion Token"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-[#111420] border border-[#23293d] text-xs text-[#f1f3f9] focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#171b28]">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsGenerateKeyOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="cyanGlow" size="sm">
                      Generate Secret Key
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

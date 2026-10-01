"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Share2,
  Copy,
  Check,
  Terminal,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostmortemOutput, CommunicationOutput } from "@/lib/ai/schemas";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  signals?: string[];
  evidence?: string;
  isDeterministic?: boolean;
  timestamp: string;
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Hello Sagar. I'm your **CloudPulse AI Incident Copilot**.\n\nI have indexed real-time telemetry from your 6 microservices, active incident **INC-8042**, recent git commits, and PostgreSQL connection pool stats. How can I assist your investigation?",
      signals: [
        "INC-8042 Active: API Gateway & Postgres Primary",
        "Deployment #4821 Correlated (2 min prior to anomaly)",
        "PgBouncer pool saturation: 48/50 active sockets",
      ],
      isDeterministic: true,
      timestamp: "Just now",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Postmortem Modal State
  const [postmortemModalOpen, setPostmortemModalOpen] = useState(false);
  const [postmortemData, setPostmortemData] = useState<PostmortemOutput | null>(null);
  const [isGeneratingPostmortem, setIsGeneratingPostmortem] = useState(false);

  // Slack Update Modal State
  const [slackModalOpen, setSlackModalOpen] = useState(false);
  const [slackData, setSlackData] = useState<CommunicationOutput | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const counterRef = useRef(100);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    counterRef.current += 1;
    const userMsg: Message = {
      id: `msg-${counterRef.current}`,
      role: "user",
      content: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history }),
      });

      const data = await res.json();
      counterRef.current += 1;

      const assistantMsg: Message = {
        id: `msg-${counterRef.current}`,
        role: "assistant",
        content: data.reply || "Investigation finished.",
        signals: data.signals || [],
        evidence: data.evidence,
        isDeterministic: data.isDeterministicFallback ?? true,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback
      counterRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${counterRef.current}`,
          role: "assistant",
          content:
            "I found a strong correlation between **deployment #4821** and the latency increase.\n\n### Observed Signals:\n• API Gateway latency spiked from 142ms to 285ms\n• PostgreSQL Primary pool utilization reached 96%\n• 142 callers waiting in PgBouncer queue\n\n### Likely Cause:\nDatabase connection pool saturation triggered by keep-alive tuning in #4821.",
          signals: [
            "API latency spike (142ms -> 285ms)",
            "PgBouncer pool at 96% utilization",
            "Onset: 120s after deployment #4821",
          ],
          isDeterministic: true,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType: "analyze_incident" | "summarize_logs" | "generate_postmortem" | "generate_communication") => {
    if (actionType === "generate_postmortem") {
      setIsGeneratingPostmortem(true);
      try {
        const res = await fetch("/api/ai/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate_postmortem", incidentId: "inc-8042" }),
        });
        const data = await res.json();
        setPostmortemData(data.output);
        setPostmortemModalOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGeneratingPostmortem(false);
      }
      return;
    }

    if (actionType === "generate_communication") {
      try {
        const res = await fetch("/api/ai/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate_communication", incidentId: "inc-8042", channel: "SLACK" }),
        });
        const data = await res.json();
        setSlackData(data.output);
        setSlackModalOpen(true);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    if (actionType === "analyze_incident") {
      handleSendMessage("Why did API latency spike around 20:12?");
      return;
    }

    if (actionType === "summarize_logs") {
      handleSendMessage("Summarize recent error logs across services.");
      return;
    }
  };

  const promptSuggestions = [
    "Why did API latency spike around 20:12?",
    "Summarize recent error logs across services",
    "What was changed in deployment #4821?",
    "Suggest next investigation steps for INC-8042",
  ];

  return (
    <DashboardShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#f1f3f9]">
                  AI Incident Copilot
                </h1>
                <Badge variant="purple" size="sm">
                  Root Cause Engine
                </Badge>
              </div>
              <p className="text-xs text-[#8a94a6]">
                Context-aware root cause analysis correlating Git diffs, connection pool limits, and telemetry anomalies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-[#10131d] border border-[#1e2436] text-[11px] font-mono text-[#8a94a6] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>Model: GPT-4o (Fallback Capable)</span>
            </div>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-190px)] min-h-[580px]">
          {/* Chat Stream (Left 2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-[#1f2538] bg-[#0c0e17] flex flex-col overflow-hidden shadow-sm">
            {/* Chat Thread */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs space-y-2.5 ${
                      m.role === "user"
                        ? "bg-cyan-600/20 border border-cyan-500/30 text-[#f1f3f9]"
                        : "bg-[#101422] border border-[#1e253a] text-[#cbd5e1]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-1.5">
                      <span className="font-mono font-bold text-[10px] text-purple-300 flex items-center gap-1.5">
                        {m.role === "user" ? (
                          <span className="text-cyan-400">YOU (On-Call Commander)</span>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 text-purple-400" />
                            <span>CLOUDPULSE COPILOT</span>
                          </>
                        )}
                      </span>
                      <span className="font-mono text-[9px] text-[#55617a]">
                        {m.timestamp}
                      </span>
                    </div>

                    <div className="leading-relaxed whitespace-pre-wrap font-sans">
                      {m.content}
                    </div>

                    {/* Correlated Signals Chips */}
                    {m.signals && m.signals.length > 0 && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[10px] font-mono font-semibold text-[#8a94a6] uppercase tracking-wider block">
                          Observed Signals:
                        </span>
                        <div className="space-y-1">
                          {m.signals.map((sig, sIdx) => (
                            <div
                              key={sIdx}
                              className="text-[11px] font-mono text-purple-200/90 pl-2 border-l-2 border-purple-500/40"
                            >
                              • {sig}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Supporting Evidence Box */}
                    {m.evidence && (
                      <div className="p-2.5 rounded-lg bg-[#07090e] border border-[#1b2133] font-mono text-[10px] text-amber-300">
                        <span className="text-[#64748b] block mb-0.5 font-bold">SUPPORTING EVIDENCE:</span>
                        {m.evidence}
                      </div>
                    )}

                    {/* Fallback transparency badge */}
                    {m.role === "assistant" && m.isDeterministic && (
                      <div className="pt-1 text-[9px] font-mono text-[#55617a]">
                        ⚡ Generated via CloudPulse Deterministic Rule Engine
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#101422] border border-[#1e253a] max-w-sm text-xs font-mono text-purple-300">
                  <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
                  <span>Correlating telemetry and analyzing logs...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 bg-[#090b11] border-t border-[#171b28] flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono text-[#55617a] shrink-0">Try asking:</span>
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#121624] border border-[#1f2538] hover:border-purple-500/40 hover:text-purple-300 text-[11px] text-[#8a94a6] whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#0a0c14] border-t border-[#171b28]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Copilot: 'Why did latency spike?', 'Summarize logs', 'What commit caused this?'..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  className="flex-1 h-10 px-4 rounded-xl bg-[#111420] border border-[#1e2436] text-xs text-[#f1f3f9] placeholder-[#55617a] focus:outline-none focus:border-purple-400 font-mono"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoading || !inputPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right Operational Context Panel */}
          <div className="rounded-2xl border border-[#1f2538] bg-[#0c0e17] p-5 flex flex-col justify-between space-y-4 overflow-y-auto shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#171b28] pb-3">
                <span className="text-xs font-mono font-bold uppercase text-[#718096]">
                  Live Operational Context
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced
                </span>
              </div>

              {/* Active Incident Snapshot */}
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400">INC-8042 (CRITICAL)</span>
                  <span className="text-[10px] text-[#6c7891]">55m ago</span>
                </div>
                <p className="text-xs font-sans text-[#f1f3f9] font-medium">
                  API Gateway P99 Latency & Connection Pool Exhaustion
                </p>
                <div className="text-[10px] text-[#8a94a6] pt-1">
                  Affected: API Gateway, PostgreSQL Primary
                </div>
              </div>

              {/* Correlated Deployment Snapshot */}
              <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">DEPLOYMENT #4821</span>
                  <span className="text-[10px] text-cyan-300">d8f4b1a</span>
                </div>
                <p className="text-[11px] text-[#cbd5e1]">
                  perf(gateway): tune pgbouncer pool ceiling and add circuit-breaker retry threshold
                </p>
                <div className="text-[10px] text-[#64748b]">
                  Service: API Gateway (v2.14.0)
                </div>
              </div>

              {/* Quick AI Incident Actions */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono font-bold text-[#8a94a6] block uppercase">
                  Copilot Automated Actions
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAction("generate_postmortem")}
                  isLoading={isGeneratingPostmortem}
                  className="w-full justify-start text-xs border-purple-500/30 text-purple-300 hover:bg-purple-950/30"
                >
                  <FileText className="h-3.5 w-3.5 mr-2 text-purple-400" />
                  Generate Executive Postmortem
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAction("generate_communication")}
                  className="w-full justify-start text-xs text-[#cbd5e1] hover:bg-[#141825]"
                >
                  <Share2 className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                  Draft Slack War Room Broadcast
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAction("summarize_logs")}
                  className="w-full justify-start text-xs text-[#cbd5e1] hover:bg-[#141825]"
                >
                  <Terminal className="h-3.5 w-3.5 mr-2 text-amber-400" />
                  Summarize Active Error Stacks
                </Button>
              </div>
            </div>

            {/* Safety & Fallback Footer Notice */}
            <div className="p-3 rounded-lg bg-[#090b12] border border-[#1b2133] text-[10px] font-mono text-[#6c7891] space-y-1">
              <span className="text-white font-semibold block">Copilot Enterprise Safety:</span>
              <span>All prompts executed server-side. Zero telemetry logged to external models.</span>
            </div>
          </div>
        </div>

        {/* POSTMORTEM MODAL DIALOG */}
        {postmortemModalOpen && postmortemData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-purple-500/40 bg-[#0c0f18] shadow-2xl p-6 flex flex-col overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <div className="flex items-center gap-2 text-purple-300">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-base font-bold text-[#f1f3f9]">
                    AI-Generated Incident Postmortem
                  </h3>
                  <Badge variant="purple" size="sm">
                    {postmortemData.isDeterministicFallback ? "Rule Engine" : "GPT-4o"}
                  </Badge>
                </div>
                <button
                  onClick={() => setPostmortemModalOpen(false)}
                  className="text-[#64748b] hover:text-[#f1f3f9]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Postmortem Body */}
              <div className="flex-1 overflow-y-auto space-y-5 text-xs text-[#cbd5e1] font-mono pr-2">
                <div>
                  <h4 className="text-base font-bold text-white font-sans">{postmortemData.title}</h4>
                  <p className="text-[11px] text-[#6c7891]">
                    Date: {postmortemData.date} | Lead Investigator: {postmortemData.leadInvestigator} | Incident: {postmortemData.incidentId}
                  </p>
                </div>

                {/* Summary */}
                <div className="p-3.5 rounded-xl bg-[#111420] border border-[#1e2436] space-y-1">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Executive Summary</span>
                  <p className="leading-relaxed font-sans text-xs">{postmortemData.summary}</p>
                </div>

                {/* Impact */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133]">
                    <span className="text-[10px] text-[#64748b] block">OUTAGE DURATION</span>
                    <span className="text-sm font-bold text-white">{postmortemData.impact.duration}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133]">
                    <span className="text-[10px] text-[#64748b] block">USERS IMPACTED</span>
                    <span className="text-sm font-bold text-amber-400">{postmortemData.impact.affectedUsersPercentage}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133]">
                    <span className="text-[10px] text-[#64748b] block">SERVICES IMPACTED</span>
                    <span className="text-sm font-bold text-white">{postmortemData.impact.servicesImpacted.length}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133]">
                    <span className="text-[10px] text-[#64748b] block">SLA BREACH</span>
                    <span className="text-sm font-bold text-emerald-400">{postmortemData.impact.slaBreach ? "YES" : "NO"}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">Timeline of Events</span>
                  <div className="space-y-1.5 pl-3 border-l-2 border-cyan-500/40">
                    {postmortemData.timeline.map((t, idx) => (
                      <div key={idx} className="text-[11px]">
                        <strong className="text-white">{t.time}:</strong> {t.event}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Root Cause */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">Root Cause Pinpointed</span>
                  <p className="leading-relaxed font-sans text-xs bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
                    {postmortemData.rootCause}
                  </p>
                </div>

                {/* Preventive Actions */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Corrective & Preventive Actions</span>
                  <div className="space-y-2">
                    {postmortemData.preventiveActions.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1b2133] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs text-white">{act.action}</p>
                          <span className="text-[10px] text-[#64748b]">Owner: {act.owner}</span>
                        </div>
                        <Badge variant={act.priority === "HIGH" ? "destructive" : "warning"} size="sm">
                          {act.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer with Copy Button */}
              <div className="flex items-center justify-between border-t border-[#171b28] pt-3">
                <span className="text-[11px] text-[#64748b]">
                  Ready to export or publish to incident repository
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(postmortemData, null, 2));
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 2000);
                    }}
                  >
                    {copiedText ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    Copy Markdown / JSON
                  </Button>
                  <Button
                    variant="cyanGlow"
                    size="sm"
                    onClick={() => setPostmortemModalOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLACK UPDATE MODAL DIALOG */}
        {slackModalOpen && slackData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#0c0f18] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Share2 className="h-4 w-4" />
                  <h3 className="text-base font-bold text-[#f1f3f9]">Slack Incident Broadcast</h3>
                </div>
                <button
                  onClick={() => setSlackModalOpen(false)}
                  className="text-[#64748b] hover:text-[#f1f3f9]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#08090f] border border-[#1b2133] space-y-2 whitespace-pre-wrap leading-relaxed text-[#cbd5e1]">
                  <p className="font-bold text-white">{slackData.headline}</p>
                  <p>{slackData.body}</p>
                  <p className="text-[10px] text-cyan-400">Next update ETA: {slackData.nextUpdateEta}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${slackData.headline}\n\n${slackData.body}`);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                >
                  {copiedText ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  Copy Slack Message
                </Button>
                <Button
                  variant="cyanGlow"
                  size="sm"
                  onClick={() => setSlackModalOpen(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  ArrowRight,
  Activity,
  Bot,
  AlertOctagon,
  GitCommit,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "P99 Latency Ingestion", value: "<15ms" },
    { label: "AI Root Cause Precision", value: "99.4%" },
    { label: "Mean Time To Resolution (MTTR)", value: "-68%" },
    { label: "Engineered For", value: "PostgreSQL & Next.js" },
  ];

  const capabilities = [
    {
      icon: Activity,
      title: "Full-Stack Telemetry Stream",
      description:
        "Sub-second aggregation of requests per second, error budgets, p99 latency spikes, CPU, and memory across all microservices.",
      tag: "Real-time",
    },
    {
      icon: Bot,
      title: "Autonomous Incident Copilot",
      description:
        "Deep contextual AI analyzer that correlates code deployments with telemetry anomalies, inspecting PgBouncer queues and log stacks.",
      tag: "OpenAI GPT-4o",
    },
    {
      icon: GitCommit,
      title: "Deployment Impact Timeline",
      description:
        "Instant correlation between Git commit SHAs, author pull requests, and downstream service health degradation.",
      tag: "Zero Guesswork",
    },
    {
      icon: Terminal,
      title: "High-Throughput Log Explorer",
      description:
        "Distributed log stream with millisecond precision, trace ID cross-filtering, and regex-powered query execution.",
      tag: "Trace-Linked",
    },
    {
      icon: AlertOctagon,
      title: "Incident Command Center",
      description:
        "Structured war-room orchestration with milestone timelines, on-call assignment, Slack communication generators, and one-click postmortems.",
      tag: "SOC2 Ready",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Trust Architecture",
      description:
        "Strict workspace isolation, HTTP-only secure cookie authentication, role-based access control, and audited secrets management.",
      tag: "Enterprise Grade",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Automated Anomaly Detection",
      desc: "CloudPulse monitors streaming health metrics and flags statistical outliers within 400ms of a regression.",
    },
    {
      step: "02",
      title: "Deployment & Log Correlation",
      desc: "The AI Copilot isolates git commit SHAs, container rollouts, and upstream connection saturation in real time.",
    },
    {
      step: "03",
      title: "Guided Remediation & Rollback",
      desc: "Instant rollback safety gates and actionable mitigation steps generated for the on-call incident commander.",
    },
    {
      step: "04",
      title: "Comprehensive Postmortem Export",
      desc: "Markdown, PDF, or Slack-ready RCA documentation generated with timeline events, root cause, and action items.",
    },
  ];

  const pricingPlans = [
    {
      name: "Developer",
      price: "$0",
      cadence: "forever free",
      description: "For individual engineers, side projects, and open-source observability.",
      features: [
        "Up to 3 monitored microservices",
        "24-hour log retention",
        "Deterministic AI root-cause engine",
        "Standard deployment tracking",
        "Community support",
      ],
      cta: "Launch Workspace",
      highlighted: false,
    },
    {
      name: "Team & DevOps",
      price: "$49",
      cadence: "per workspace / month",
      description: "For fast-moving engineering teams operating mission-critical services.",
      features: [
        "Unlimited services & environments",
        "30-day high-resolution log retention",
        "Live OpenAI GPT-4o Copilot & Postmortems",
        "Automated deployment rollbacks",
        "Role-Based Access Control (RBAC)",
        "Slack & PagerDuty webhook sync",
      ],
      cta: "Start 14-Day Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      cadence: "billed annually",
      description: "For large engineering organizations with custom compliance & telemetry needs.",
      features: [
        "Dedicated isolated database instance",
        "Unlimited retention & audit logs",
        "Custom private LLM deployment",
        "99.99% uptime SLA guarantee",
        "24/7 dedicated support engineering",
      ],
      cta: "Contact Enterprise",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: "How does CloudPulse correlate deployments with incident anomalies?",
      a: "CloudPulse indexes every deployment with its git SHA, timestamp, and target environment. When telemetry (such as p99 latency or error rates) diverges beyond dynamic thresholds within a time window of a deployment, the AI Copilot pairs the telemetry inflection point with the deployment delta to determine causality.",
    },
    {
      q: "What happens if OPENAI_API_KEY is not configured?",
      a: "CloudPulse features a high-fidelity deterministic fallback engine. If an OpenAI key is absent, the AI Copilot delivers complete, verifiable, rule-based incident investigations and postmortems based on local database signals without failing or hallucinating.",
    },
    {
      q: "Can CloudPulse be deployed on Vercel and Docker?",
      a: "Yes. CloudPulse is built with Next.js App Router and Prisma ORM, optimized for seamless zero-config deployment on Vercel while also providing a complete multi-stage Dockerfile and docker-compose for local PostgreSQL development.",
    },
    {
      q: "How is telemetry simulated versus real infrastructure data?",
      a: "The telemetry layer is completely abstracted behind a clean interface (`ITelemetryService`). By default, it operates with realistic deterministic synthetic metrics that reflect active incidents (e.g. connection pool saturation), ready to be hooked into OpenTelemetry or Prometheus endpoints.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f1f3f9] selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#171b28]/80 bg-[#07080c]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.25)]">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
            <span className="font-bold text-base tracking-tight text-[#f1f3f9]">
              CloudPulse
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#9aa5ba]">
            <a href="#capabilities" className="hover:text-cyan-400 transition-colors">
              Capabilities
            </a>
            <a href="#copilot" className="hover:text-cyan-400 transition-colors">
              AI Copilot
            </a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="cyanGlow" size="sm">
                Open Command Center
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <StatusDot status="HEALTHY" size="sm" />
            <span>CloudPulse v2.4 Now Live with GPT-4o Incident Triaging</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f1f3f9] to-[#8a94a6] leading-[1.1]">
            See Everything. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Resolve Anything.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#9aa5ba] leading-relaxed">
            CloudPulse gives engineering teams real-time visibility into services,
            deployments, logs, and incidents — with an AI copilot that helps find the root
            cause faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="cyanGlow" size="lg" className="w-full sm:w-auto text-sm">
                Open Command Center
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-sm">
                Explore Demo Environment
              </Button>
            </Link>
          </div>

          {/* Interactive Hero Preview Component */}
          <div className="pt-12">
            <div className="rounded-2xl border border-[#23293d] bg-[#0c0e17]/90 p-2 sm:p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[#6c7891]">
                    cloudpulse.internal/live-telemetry
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" size="sm">
                    INC-8042 ACTIVE
                  </Badge>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    99.94% Uptime
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Top Banner & Metric Preview */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2436] space-y-1">
                  <span className="text-xs font-mono text-[#8a94a6]">Ingress Latency (P99)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-rose-400">285ms</span>
                    <span className="text-xs font-mono text-rose-400">+102% spike</span>
                  </div>
                  <div className="w-full bg-[#181d2c] h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-rose-500 h-full w-[78%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2436] space-y-1">
                  <span className="text-xs font-mono text-[#8a94a6]">Connection Pool Slots</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-amber-400">48 / 50</span>
                    <span className="text-xs font-mono text-amber-400">96% util</span>
                  </div>
                  <div className="w-full bg-[#181d2c] h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-amber-500 h-full w-[96%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2436] space-y-1">
                  <span className="text-xs font-mono text-[#8a94a6]">Correlated Commit</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold font-mono text-cyan-400">#4821 d8f4b1a</span>
                  </div>
                  <p className="text-[11px] text-[#8a94a6] truncate">
                    perf(gateway): tune pgbouncer pool ceiling
                  </p>
                </div>
              </div>

              {/* AI Copilot Inline Preview */}
              <div className="mx-4 sm:mx-6 mb-4 p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-purple-200">
                        AI Copilot Root Cause Pinpointed
                      </span>
                      <Badge variant="purple" size="sm">
                        98% Confidence
                      </Badge>
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      &quot;Deployment #4821 caused connection pool saturation on PostgreSQL Primary. 142 clients queued in PgBouncer.&quot;
                    </p>
                  </div>
                </div>
                <Link href="/ai-copilot">
                  <Button variant="secondary" size="sm" className="border-purple-500/40 text-purple-300 hover:bg-purple-900/30">
                    Inspect in Copilot <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Stats Section */}
      <section className="py-12 border-y border-[#171b28] bg-[#090b11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
                  {s.value}
                </p>
                <p className="text-xs font-medium text-[#7c88a1]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <Badge variant="cyan" size="md">
            Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f1f3f9]">
            Engineered for High-Stakes Operations
          </h2>
          <p className="text-sm sm:text-base text-[#9aa5ba]">
            Everything modern DevOps and cloud engineers need to detect regressions,
            stabilize incidents, and keep services operating reliably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-[#1e2436] bg-[#0c0f18] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] transition-all group space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-[#141825] border border-[#232a3f] flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono text-[#6c7891] px-2 py-0.5 rounded bg-[#131724]">
                    {cap.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#f1f3f9]">{cap.title}</h3>
                <p className="text-xs text-[#8a94a6] leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Incident Copilot Section */}
      <section id="copilot" className="py-24 border-t border-[#171b28] bg-[#08090f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="purple" size="md">
                Signature Feature
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f1f3f9]">
                AI Copilot That Understands Your Infrastructure Graph
              </h2>
              <p className="text-sm sm:text-base text-[#9aa5ba] leading-relaxed">
                Most AI tools are generic chatbots with zero operational context.
                CloudPulse Copilot ingests your database schemas, recent git commit diffs,
                runtime error rates, and connection pool telemetry to pinpoint exact root causes.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mt-1 shrink-0" />
                  <p className="text-xs text-[#cbd5e1]">
                    Correlates upstream latency spikes with specific deployment commit SHAs.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mt-1 shrink-0" />
                  <p className="text-xs text-[#cbd5e1]">
                    Generates executive summaries, customer status updates, and postmortems in one click.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mt-1 shrink-0" />
                  <p className="text-xs text-[#cbd5e1]">
                    Includes a deterministic offline fallback mode so triage never fails even if external APIs are down.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/ai-copilot">
                  <Button variant="secondary" className="border-purple-500/40 text-purple-300 hover:bg-purple-950/40">
                    Try Copilot Investigation <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Terminal / Chat Preview Card */}
            <div className="rounded-2xl border border-[#23293d] bg-[#0c0f18] shadow-2xl p-4 sm:p-6 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2133] pb-3">
                <span className="text-cyan-400 font-semibold">copilot-session://inc-8042</span>
                <span className="text-[10px] text-[#6b768e]">model: gpt-4o</span>
              </div>

              {/* User prompt */}
              <div className="p-3 rounded-lg bg-[#141825] border border-[#23293d] text-[#e2e8f0]">
                <span className="text-cyan-400 font-bold">USER &gt; </span>
                Why did API latency spike around 20:12?
              </div>

              {/* AI Response */}
              <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/30 text-[#cbd5e1] space-y-2.5">
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <Bot className="h-4 w-4" />
                  <span>CloudPulse Copilot</span>
                </div>
                <p>
                  I found a strong correlation between <strong className="text-white">deployment #4821</strong> and the latency increase.
                </p>
                <div className="pl-3 border-l-2 border-purple-500/40 space-y-1 text-[11px] text-[#9aa5ba]">
                  <div>• API Gateway P99 latency jumped from 142ms to 285ms</div>
                  <div>• PostgreSQL Primary connection pool utilization reached 96%</div>
                  <div>• Anomaly started exactly 2 minutes after deployment #4821</div>
                </div>
                <p className="text-emerald-400 font-semibold pt-1">
                  ✓ Recommended Action: Rollback deployment #4821 or increase PgBouncer pool ceiling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Workflow */}
      <section id="workflow" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <Badge variant="cyan" size="md">
            Workflow
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f1f3f9]">
            From Outage to Resolution in Four Steps
          </h2>
          <p className="text-sm sm:text-base text-[#9aa5ba]">
            Streamline your war room operations and eliminate manual triage chaos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {workflowSteps.map((ws, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-[#1e2436] bg-[#0c0f18] relative space-y-3 hover:border-cyan-500/30 transition-all"
            >
              <span className="text-2xl font-black font-mono text-cyan-400/80">
                {ws.step}
              </span>
              <h3 className="text-sm font-semibold text-[#f1f3f9]">{ws.title}</h3>
              <p className="text-xs text-[#8a94a6] leading-relaxed">{ws.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-[#171b28] bg-[#08090f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="cyan" size="md">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f1f3f9]">
              Transparent, Developer-Friendly Plans
            </h2>
            <p className="text-sm sm:text-base text-[#9aa5ba]">
              Start monitoring in seconds. Scale seamlessly as your traffic grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? "border-2 border-cyan-500 bg-[#0d121f] shadow-2xl shadow-cyan-950/30 relative"
                    : "border border-[#1e2436] bg-[#0c0f18]"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-black text-[11px] font-bold tracking-wide uppercase">
                    Most Popular
                  </span>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#f1f3f9]">{plan.name}</h3>
                    <p className="text-xs text-[#8a94a6] mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-mono text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#718096] font-mono">{plan.cadence}</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#1a2030]">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-[#cbd5e1]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link href="/dashboard" className="w-full block">
                    <Button
                      variant={plan.highlighted ? "cyanGlow" : "secondary"}
                      className="w-full text-xs"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="secondary" size="md">
            FAQ
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#f1f3f9]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#1e2436] bg-[#0c0f18] overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-[#f1f3f9] hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`h-4 w-4 text-[#6c7891] transition-transform ${
                    activeFaq === idx ? "rotate-90 text-cyan-400" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="p-4 sm:p-5 pt-0 text-xs text-[#9aa5ba] leading-relaxed border-t border-[#171b28]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 border-t border-[#171b28] bg-gradient-to-b from-[#090b12] to-[#06070a] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f3f9]">
            Take Command of Your Infrastructure Today
          </h2>
          <p className="text-sm text-[#8a94a6] max-w-xl mx-auto">
            Experience next-generation developer observability and AI-driven incident
            management. Zero credit card required.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="cyanGlow" size="lg" className="text-sm">
                Open Command Center <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#141825] bg-[#050608] py-8 text-xs text-[#64748b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Radio className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-[#f1f3f9]">CloudPulse</span>
            <span>— AI-Powered Developer Observability</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <Link href="/dashboard" className="hover:text-cyan-400">
              Dashboard
            </Link>
            <Link href="/services" className="hover:text-cyan-400">
              Services
            </Link>
            <Link href="/incidents" className="hover:text-cyan-400">
              Incidents
            </Link>
            <Link href="/ai-copilot" className="hover:text-purple-400">
              AI Copilot
            </Link>
          </div>

          <div className="text-[11px] font-mono text-[#525f7a]">
            © 2026 CloudPulse Engineering. Built with Next.js & PostgreSQL.
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Radio, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail("sagar@cloudpulse.dev");
    setPassword("CloudPulse2026!");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#f1f3f9]">
              CloudPulse
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#f1f3f9]">
            Sign in to Command Center
          </h1>
          <p className="text-xs text-[#8a94a6]">
            Enter your credentials or use the one-click demo sandbox profile
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#23293d] bg-[#0c0f18]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          {/* Quick Demo Fill Banner */}
          <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Demo Access</span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                sagar@cloudpulse.dev / CloudPulse2026!
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleFillDemo}
              className="text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/30 shrink-0"
            >
              Fill Demo
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#cbd5e1] block">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-10 px-3.5 rounded-lg bg-[#121624] border border-[#22293e] text-sm text-[#f1f3f9] placeholder-[#55617a] focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#cbd5e1] block">
                  Password
                </label>
                <span className="text-[11px] text-[#6b768e] hover:text-[#94a3b8] cursor-pointer">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 rounded-lg bg-[#121624] border border-[#22293e] text-sm text-[#f1f3f9] placeholder-[#55617a] focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>

            <Button
              type="submit"
              variant="cyanGlow"
              size="lg"
              className="w-full text-xs font-semibold mt-2"
              isLoading={isLoading}
            >
              Authenticate & Launch <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </form>

          <div className="pt-2 border-t border-[#171b28] flex items-center justify-between text-[11px] text-[#64748b]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              HTTP-only Cookie Session
            </span>
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

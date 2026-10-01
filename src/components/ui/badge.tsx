import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "cyan"
    | "purple";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#161a26] text-[#d2d7e5] border-[#22283a]",
    secondary: "bg-[#1b2030] text-[#9ba5b9] border-[#262d42]",
    outline: "bg-transparent text-[#a6b1c7] border-[#2a324b]",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px] font-medium tracking-wide",
    md: "px-2.5 py-0.5 text-xs font-medium tracking-wide",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

export function StatusDot({
  status,
  size = "md",
  pulse = true,
}: {
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "MAINTENANCE" | "SUCCESSFUL" | "BUILDING" | "FAILED" | "ROLLED_BACK";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}) {
  const colorMap = {
    HEALTHY: "bg-emerald-400 ring-emerald-500/40",
    SUCCESSFUL: "bg-emerald-400 ring-emerald-500/40",
    DEGRADED: "bg-amber-400 ring-amber-500/40",
    DOWN: "bg-rose-500 ring-rose-500/40",
    FAILED: "bg-rose-500 ring-rose-500/40",
    ROLLED_BACK: "bg-orange-400 ring-orange-500/40",
    MAINTENANCE: "bg-blue-400 ring-blue-500/40",
    BUILDING: "bg-cyan-400 ring-cyan-500/40",
  };

  const sizeMap = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };

  const colorClass = colorMap[status] || "bg-gray-400 ring-gray-500/40";

  return (
    <span className="relative flex items-center justify-center">
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex rounded-full opacity-75 animate-ping-slow",
            sizeMap[size],
            colorClass
          )}
        />
      )}
      <span className={cn("relative inline-flex rounded-full", sizeMap[size], colorClass)} />
    </span>
  );
}

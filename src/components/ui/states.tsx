import React from "react";
import { AlertTriangle, RefreshCw, FolderSearch, PlusCircle } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#161b28]", className)}
      {...props}
    />
  );
}

export function DataTableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4 border-b border-[#1f2538] pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} className="h-4 w-28 bg-[#1a2030]" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`row-${r}`}
          className="flex items-center gap-4 py-3.5 border-b border-[#151926]"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={`cell-${r}-${c}`}
              className={cn("h-4", c === 0 ? "w-36" : c === 1 ? "w-20" : "w-24")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      {/* Top Banner Skeleton */}
      <Skeleton className="h-12 w-full rounded-lg bg-[#141825]" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-2 w-12" />
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="p-6 h-[340px] flex flex-col justify-between">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-[220px] w-full" />
      </Card>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = FolderSearch,
}: {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-[#23293d] bg-[#0c0e16]/40">
      <div className="h-12 w-12 rounded-full bg-[#151a28] flex items-center justify-center text-cyan-400 mb-4 border border-[#222a3e]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#f1f3f9] mb-1">{title}</h3>
      <p className="text-sm text-[#8a94a6] max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          <PlusCircle className="h-4 w-4 mr-1 text-cyan-400" />
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Failed to load telemetry",
  message = "An error occurred while fetching real-time infrastructure data.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-500/30 bg-rose-500/5">
      <AlertTriangle className="h-10 w-10 text-rose-400 mb-3" />
      <h3 className="text-base font-semibold text-[#f1f3f9] mb-1">{title}</h3>
      <p className="text-sm text-rose-200/70 max-w-md mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { telemetryService, TelemetrySnapshot } from "@/lib/telemetry/telemetry-service";

export function useTelemetry(initialRange: string = "1h", autoRefresh: boolean = true) {
  const [timeRange, setTimeRange] = useState(initialRange);
  const [data, setData] = useState<TelemetrySnapshot>(() =>
    telemetryService.getSnapshot(initialRange)
  );
  const [isPaused, setIsPaused] = useState(!autoRefresh);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update snapshot when user changes time range
  const handleRangeChange = useCallback((newRange: string) => {
    setTimeRange(newRange);
    setData(telemetryService.getSnapshot(newRange));
  }, []);

  const refetch = useCallback(() => {
    setData(telemetryService.getSnapshot(timeRange));
  }, [timeRange]);

  // Live interval tick simulator
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setData((prev) => {
        if (!prev || prev.metrics.length === 0) return prev;
        const last = prev.metrics[prev.metrics.length - 1];
        const next = telemetryService.getNextDataPoint(last);
        const updatedMetrics = [...prev.metrics.slice(1), next];

        return {
          ...prev,
          metrics: updatedMetrics,
          lastUpdated: next.timestamp,
        };
      });
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const togglePause = () => setIsPaused((p) => !p);

  return {
    data,
    loading: false,
    error: null,
    timeRange,
    setTimeRange: handleRangeChange,
    isPaused,
    togglePause,
    refetch,
  };
}

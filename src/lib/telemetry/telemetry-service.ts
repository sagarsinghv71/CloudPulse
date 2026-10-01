import { MetricPointData, ServiceData } from "@/types";
import { INITIAL_SERVICES, generateInitialTelemetryPoints } from "@/lib/data/mock-store";

export interface TelemetrySnapshot {
  services: ServiceData[];
  metrics: MetricPointData[];
  summary: {
    uptime: number;
    requestsPerSec: number;
    errorRate: number;
    latency: number;
    activeIncidents: number;
    deploymentsToday: number;
  };
  isSimulated: boolean;
  lastUpdated: string;
}

export interface ITelemetryService {
  getSnapshot(timeRange?: string): TelemetrySnapshot;
  getNextDataPoint(currentMetric: MetricPointData): MetricPointData;
}

export class TelemetryService implements ITelemetryService {
  private static instance: TelemetryService;

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public getSnapshot(timeRange: string = "1h"): TelemetrySnapshot {
    const pointsMap: Record<string, number> = {
      "15m": 12,
      "1h": 24,
      "6h": 36,
      "24h": 48,
      "7d": 56,
    };
    const count = pointsMap[timeRange] || 24;
    const metrics = generateInitialTelemetryPoints(count);

    // Calculate dynamic aggregates from the active metrics and services
    const totalRequests = INITIAL_SERVICES.reduce((acc, s) => acc + s.requestsPerSec, 0);
    const avgLatency = Math.round(
      INITIAL_SERVICES.reduce((acc, s) => acc + s.latency, 0) / INITIAL_SERVICES.length
    );
    const avgErrorRate = parseFloat(
      (INITIAL_SERVICES.reduce((acc, s) => acc + s.errorRate, 0) / INITIAL_SERVICES.length).toFixed(2)
    );
    const avgUptime = parseFloat(
      (INITIAL_SERVICES.reduce((acc, s) => acc + s.uptime, 0) / INITIAL_SERVICES.length).toFixed(2)
    );

    return {
      services: INITIAL_SERVICES,
      metrics,
      summary: {
        uptime: avgUptime,
        requestsPerSec: totalRequests,
        errorRate: avgErrorRate,
        latency: avgLatency,
        activeIncidents: 2,
        deploymentsToday: 7,
      },
      isSimulated: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  public getNextDataPoint(lastPoint: MetricPointData): MetricPointData {
    const now = new Date();
    // Deterministic jitter around active values
    const jitter = (Math.random() - 0.48) * 40;
    const latencyJitter = (Math.random() - 0.45) * 12;
    const errorJitter = (Math.random() - 0.48) * 0.15;
    const cpuJitter = (Math.random() - 0.5) * 2;
    const memJitter = (Math.random() - 0.5) * 1.5;

    return {
      timestamp: now.toISOString(),
      requests: Math.max(1200, Math.round(lastPoint.requests + jitter)),
      latency: Math.max(60, Math.round(lastPoint.latency + latencyJitter)),
      errorRate: Math.max(0.01, parseFloat((lastPoint.errorRate + errorJitter).toFixed(2))),
      cpu: Math.min(99, Math.max(10, parseFloat((lastPoint.cpu + cpuJitter).toFixed(1)))),
      memory: Math.min(99, Math.max(20, parseFloat((lastPoint.memory + memJitter).toFixed(1)))),
    };
  }
}

export const telemetryService = TelemetryService.getInstance();

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TelemetryService } from "../src/lib/telemetry/telemetry-service";
import { MetricPointData } from "../src/types";

describe("Telemetry & Metric Streaming Abstraction Suite", () => {
  const telemetry = TelemetryService.getInstance();

  it("should generate a consistent telemetry snapshot with realistic bounds", () => {
    const snapshot = telemetry.getSnapshot("1h");

    assert.strictEqual(snapshot.isSimulated, true, "Simulated telemetry flag must be true");
    assert.ok(snapshot.metrics.length > 0, "Snapshot must contain telemetry points");
    assert.strictEqual(snapshot.metrics.length, 24, "1h time range should generate 24 5-min intervals");

    // Verify summary values
    assert.ok(snapshot.summary.uptime >= 99.0 && snapshot.summary.uptime <= 100.0, "Uptime should be realistic");
    assert.ok(snapshot.summary.requestsPerSec > 1000, "Requests/sec should reflect cluster throughput");
    assert.ok(snapshot.summary.latency > 0, "Latency should be positive");
    assert.ok(snapshot.summary.errorRate >= 0, "Error rate cannot be negative");
  });

  it("should handle multiple time range granularities correctly", () => {
    const r15m = telemetry.getSnapshot("15m");
    assert.strictEqual(r15m.metrics.length, 12);

    const r24h = telemetry.getSnapshot("24h");
    assert.strictEqual(r24h.metrics.length, 48);

    const r7d = telemetry.getSnapshot("7d");
    assert.strictEqual(r7d.metrics.length, 56);
  });

  it("should generate next streaming data point bounded within operational limits", () => {
    const basePoint: MetricPointData = {
      timestamp: new Date().toISOString(),
      requests: 2800,
      latency: 145,
      errorRate: 0.12,
      cpu: 45.2,
      memory: 60.1,
    };

    const nextPoint = telemetry.getNextDataPoint(basePoint);

    assert.ok(typeof nextPoint.timestamp === "string");
    assert.ok(nextPoint.requests >= 1200, "Requests floor should be respected");
    assert.ok(nextPoint.latency >= 60, "Latency floor should be respected");
    assert.ok(nextPoint.errorRate >= 0.01, "Error rate floor should be respected");
    assert.ok(nextPoint.cpu >= 10 && nextPoint.cpu <= 99, "CPU should be bounded between 10% and 99%");
    assert.ok(nextPoint.memory >= 20 && nextPoint.memory <= 99, "Memory should be bounded between 20% and 99%");
  });

  it("should provide a singleton instance", () => {
    const inst1 = TelemetryService.getInstance();
    const inst2 = TelemetryService.getInstance();
    assert.strictEqual(inst1, inst2, "TelemetryService must be a singleton");
  });
});

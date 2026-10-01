import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Live API Integration Suite", () => {
  it("GET /api/services should return 200 and initial service list", async () => {
    const res = await fetch(`${BASE_URL}/api/services`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.services));
    assert.ok(data.services.length >= 6);
    assert.ok(data.services.some((s: { slug: string }) => s.slug === "api-gateway"));
  });

  it("POST /api/services should reject invalid schema with 400", async () => {
    const res = await fetch(`${BASE_URL}/api/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "X" }), // name too short, missing slug
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  it("GET /api/deployments should return 200 and deployments list", async () => {
    const res = await fetch(`${BASE_URL}/api/deployments`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.deployments));
    assert.ok(data.deployments.length >= 5);
  });

  it("GET /api/incidents should return 200 and active incidents", async () => {
    const res = await fetch(`${BASE_URL}/api/incidents`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.incidents));
    assert.ok(data.incidents.length >= 3);
  });

  it("GET /api/metrics should return 200 with summary and telemetry points", async () => {
    const res = await fetch(`${BASE_URL}/api/metrics?range=1h`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.summary);
    assert.ok(Array.isArray(data.metrics));
    assert.ok(data.metrics.length > 0);
    assert.strictEqual(data.isSimulated, true);
  });

  it("POST /api/ai/actions should return 200 with structured analysis", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "analyze_incident",
        incidentId: "inc-8042",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.output);
    assert.ok(data.output.summary);
  });

  it("POST /api/auth/login should reject invalid credentials with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "unknown@cloudpulse.dev",
        password: "IncorrectPassword123!",
      }),
    });
    assert.strictEqual(res.status, 401);
  });

  it("POST /api/auth/login should authenticate demo credentials and return session", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sagar@cloudpulse.dev",
        password: "CloudPulse2026!",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, "sagar@cloudpulse.dev");
    assert.strictEqual(data.user.role, "OWNER");

    // Verify Set-Cookie header exists
    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie && setCookie.includes("cp_session="));
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CreateServiceSchema,
  CreateIncidentSchema,
  UpdateIncidentStatusSchema,
  CreateIncidentEventSchema,
} from "../src/lib/validation";

describe("Services & Incidents Validation Suite", () => {
  describe("Service Schema Validation", () => {
    it("should accept valid service registration payload", () => {
      const validPayload = {
        name: "Order Processing Service",
        slug: "order-processing-service",
        description: "Handles checkout transactions and payment intent orchestration",
        environment: "production",
      };

      const result = CreateServiceSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.name, validPayload.name);
        assert.strictEqual(result.data.slug, validPayload.slug);
      }
    });

    it("should reject invalid service slug formats", () => {
      const invalidPayload = {
        name: "Order Processing",
        slug: "Order_Processing Service!", // Uppercase, spaces, invalid chars
      };

      const result = CreateServiceSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.slug && errors.slug.length > 0, "Slug should fail regex check");
      }
    });

    it("should default environment to production when omitted", () => {
      const payload = {
        name: "Cache Worker",
        slug: "cache-worker",
      };

      const result = CreateServiceSchema.safeParse(payload);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.environment, "production");
      }
    });
  });

  describe("Incident Schema Validation", () => {
    it("should accept valid incident creation payload", () => {
      const validIncident = {
        title: "Redis Cluster Shard 3 Read Replica Failover Stalled",
        description:
          "Read replica failed to promote after primary disk full notification. Read throughput dropped 40%.",
        severity: "CRITICAL",
        affectedServices: ["API Gateway", "User Service"],
        assignedEngineer: "Sagar Singh Rajawat",
      };

      const result = CreateIncidentSchema.safeParse(validIncident);
      assert.strictEqual(result.success, true);
    });

    it("should reject incident with empty affected services list", () => {
      const invalidIncident = {
        title: "Unexplained Latency Spike",
        description: "Investigating network packet loss across internal mesh.",
        severity: "HIGH",
        affectedServices: [], // Empty array violates min(1)
      };

      const result = CreateIncidentSchema.safeParse(invalidIncident);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.affectedServices);
      }
    });

    it("should validate allowed incident lifecycle status updates", () => {
      const validStatuses = ["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"];
      for (const status of validStatuses) {
        const res = UpdateIncidentStatusSchema.safeParse({ status, note: "Status transition" });
        assert.strictEqual(res.success, true);
      }

      const invalidStatus = UpdateIncidentStatusSchema.safeParse({ status: "CLOSED" });
      assert.strictEqual(invalidStatus.success, false, "Unknown status 'CLOSED' must be rejected");
    });

    it("should validate incident timeline event creation", () => {
      const validEvent = {
        type: "ROOT_CAUSE_IDENTIFIED",
        title: "Connection pool deadlock identified",
        description: "Postgres thread dumps indicate 50 concurrent transactions locked on table locks.",
        authorName: "Sagar Singh Rajawat",
      };

      const res = CreateIncidentEventSchema.safeParse(validEvent);
      assert.strictEqual(res.success, true);

      const invalidEvent = {
        type: "INVALID_EVENT_TYPE",
        title: "Test",
        description: "Test description",
        authorName: "Author",
      };
      const badRes = CreateIncidentEventSchema.safeParse(invalidEvent);
      assert.strictEqual(badRes.success, false);
    });
  });
});

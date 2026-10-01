import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
  getDemoUser,
} from "../src/lib/auth/session";
import { UserSession } from "../src/types";

describe("Authentication & Session Security Suite", () => {
  it("should hash and verify passwords correctly using bcrypt", async () => {
    const rawPassword = "CloudPulseSecure2026!";
    const hashedPassword = await hashPassword(rawPassword);

    assert.ok(hashedPassword.startsWith("$2"), "Password hash should use bcrypt $2 format");
    assert.notStrictEqual(hashedPassword, rawPassword, "Hashed password must not match plaintext");

    const isValid = await verifyPassword(rawPassword, hashedPassword);
    assert.strictEqual(isValid, true, "Valid password should verify successfully");

    const isInvalid = await verifyPassword("WrongPassword123!", hashedPassword);
    assert.strictEqual(isInvalid, false, "Invalid password should fail verification");
  });

  it("should sign and verify valid JWT session tokens", async () => {
    const mockUser: UserSession = {
      id: "usr-test-99",
      email: "engineer@cloudpulse.dev",
      name: "Test Staff Engineer",
      role: "ENGINEER",
      workspaceId: "ws-test-101",
      workspaceName: "Acme Test Infrastructure",
    };

    const token = await signSessionToken(mockUser);
    assert.ok(typeof token === "string", "Token should be a string");
    assert.ok(token.split(".").length === 3, "JWT should have header, payload, and signature parts");

    const verified = await verifySessionToken(token);
    assert.ok(verified !== null, "Verified session should not be null");
    assert.strictEqual(verified.id, mockUser.id);
    assert.strictEqual(verified.email, mockUser.email);
    assert.strictEqual(verified.role, mockUser.role);
    assert.strictEqual(verified.workspaceId, mockUser.workspaceId);
  });

  it("should reject invalid or tampered JWT session tokens", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature";
    const verified = await verifySessionToken(invalidToken);
    assert.strictEqual(verified, null, "Tampered or invalid token should return null");

    const emptyToken = "";
    const emptyVerified = await verifySessionToken(emptyToken);
    assert.strictEqual(emptyVerified, null, "Empty token string should return null");
  });

  it("should provide valid demo user configuration for zero-friction evaluation", () => {
    const demo = getDemoUser();
    assert.strictEqual(demo.email, "sagar@cloudpulse.dev");
    assert.strictEqual(demo.role, "OWNER");
    assert.ok(demo.workspaceId.length > 0);
  });
});

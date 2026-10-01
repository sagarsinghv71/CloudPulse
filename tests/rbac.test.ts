import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasPermission, validateWorkspaceIsolation } from "../src/lib/auth/rbac";
import { UserRole } from "../src/types";

describe("RBAC & Multi-Tenant Workspace Isolation Suite", () => {
  it("should enforce OWNER privileges correctly", () => {
    const ownerRole: UserRole = "OWNER";
    assert.strictEqual(hasPermission(ownerRole, "canManageTeam"), true);
    assert.strictEqual(hasPermission(ownerRole, "canModifyRole"), true);
    assert.strictEqual(hasPermission(ownerRole, "canCreateService"), true);
    assert.strictEqual(hasPermission(ownerRole, "canRollbackDeployment"), true);
    assert.strictEqual(hasPermission(ownerRole, "canDeleteResource"), true);
    assert.strictEqual(hasPermission(ownerRole, "canManageApiKeys"), true);
  });

  it("should enforce ADMIN privileges without allowing role modification or hard deletion", () => {
    const adminRole: UserRole = "ADMIN";
    assert.strictEqual(hasPermission(adminRole, "canManageTeam"), true);
    assert.strictEqual(hasPermission(adminRole, "canModifyRole"), false, "Admin cannot reassign owner roles");
    assert.strictEqual(hasPermission(adminRole, "canCreateService"), true);
    assert.strictEqual(hasPermission(adminRole, "canRollbackDeployment"), true);
    assert.strictEqual(hasPermission(adminRole, "canDeleteResource"), false, "Admin cannot hard delete resources");
    assert.strictEqual(hasPermission(adminRole, "canManageApiKeys"), true);
  });

  it("should grant ENGINEER operational powers while restricting administrative settings", () => {
    const engRole: UserRole = "ENGINEER";
    assert.strictEqual(hasPermission(engRole, "canCreateService"), true);
    assert.strictEqual(hasPermission(engRole, "canRollbackDeployment"), true);
    assert.strictEqual(hasPermission(engRole, "canCreateIncident"), true);
    assert.strictEqual(hasPermission(engRole, "canChangeIncidentStatus"), true);
    assert.strictEqual(hasPermission(engRole, "canManageTeam"), false);
    assert.strictEqual(hasPermission(engRole, "canManageApiKeys"), false);
    assert.strictEqual(hasPermission(engRole, "canManageSettings"), false);
  });

  it("should restrict VIEWER to read-only observability access", () => {
    const viewerRole: UserRole = "VIEWER";
    assert.strictEqual(hasPermission(viewerRole, "canCreateService"), false);
    assert.strictEqual(hasPermission(viewerRole, "canRollbackDeployment"), false);
    assert.strictEqual(hasPermission(viewerRole, "canCreateIncident"), false);
    assert.strictEqual(hasPermission(viewerRole, "canChangeIncidentStatus"), false);
    assert.strictEqual(hasPermission(viewerRole, "canManageTeam"), false);
    // Viewer is still permitted to interact with the AI copilot to read/investigate
    assert.strictEqual(hasPermission(viewerRole, "canTriggerAiActions"), true);
  });

  it("should validate workspace isolation to prevent cross-tenant data leakage", () => {
    const userWorkspace = "ws-cloudpulse-eng";
    const sameWorkspace = "ws-cloudpulse-eng";
    const foreignWorkspace = "ws-competitor-corp";

    const allowedCheck = validateWorkspaceIsolation(userWorkspace, sameWorkspace);
    assert.strictEqual(allowedCheck.allowed, true);

    const rejectedCheck = validateWorkspaceIsolation(userWorkspace, foreignWorkspace);
    assert.strictEqual(rejectedCheck.allowed, false);
    assert.ok(rejectedCheck.reason?.includes("Unauthorized cross-workspace"));

    const emptyCheck = validateWorkspaceIsolation("", sameWorkspace);
    assert.strictEqual(emptyCheck.allowed, false);
  });
});

import { UserRole } from "@/types";

export interface PermissionCheck {
  canManageTeam: boolean;
  canModifyRole: boolean;
  canCreateService: boolean;
  canRollbackDeployment: boolean;
  canCreateIncident: boolean;
  canChangeIncidentStatus: boolean;
  canDeleteResource: boolean;
  canManageApiKeys: boolean;
  canManageSettings: boolean;
  canTriggerAiActions: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionCheck> = {
  OWNER: {
    canManageTeam: true,
    canModifyRole: true,
    canCreateService: true,
    canRollbackDeployment: true,
    canCreateIncident: true,
    canChangeIncidentStatus: true,
    canDeleteResource: true,
    canManageApiKeys: true,
    canManageSettings: true,
    canTriggerAiActions: true,
  },
  ADMIN: {
    canManageTeam: true,
    canModifyRole: false,
    canCreateService: true,
    canRollbackDeployment: true,
    canCreateIncident: true,
    canChangeIncidentStatus: true,
    canDeleteResource: false,
    canManageApiKeys: true,
    canManageSettings: true,
    canTriggerAiActions: true,
  },
  ENGINEER: {
    canManageTeam: false,
    canModifyRole: false,
    canCreateService: true,
    canRollbackDeployment: true,
    canCreateIncident: true,
    canChangeIncidentStatus: true,
    canDeleteResource: false,
    canManageApiKeys: false,
    canManageSettings: false,
    canTriggerAiActions: true,
  },
  VIEWER: {
    canManageTeam: false,
    canModifyRole: false,
    canCreateService: false,
    canRollbackDeployment: false,
    canCreateIncident: false,
    canChangeIncidentStatus: false,
    canDeleteResource: false,
    canManageApiKeys: false,
    canManageSettings: false,
    canTriggerAiActions: true,
  },
};

/**
 * Checks if a given role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: keyof PermissionCheck): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) {
    return false;
  }
  return !!permissions[permission];
}

/**
 * Validates that an authenticated user's workspace matches the target resource workspace.
 * Prevents cross-tenant / cross-workspace data leakage.
 */
export function validateWorkspaceIsolation(
  userWorkspaceId: string,
  targetWorkspaceId: string
): { allowed: boolean; reason?: string } {
  if (!userWorkspaceId || !targetWorkspaceId) {
    return { allowed: false, reason: "Missing workspace identifier" };
  }
  if (userWorkspaceId !== targetWorkspaceId) {
    return {
      allowed: false,
      reason: `Unauthorized cross-workspace access attempt. User workspace: ${userWorkspaceId}, Target workspace: ${targetWorkspaceId}`,
    };
  }
  return { allowed: true };
}

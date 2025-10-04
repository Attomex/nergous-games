export type ROLES = keyof typeof Roles;
type PERMISSIONS = (typeof Roles)[ROLES][number];

const Roles = {
    admin: ["view", "edit", "delete", "create"],
    user: ["view"],
} as const;


export function hasPermission (userRole: ROLES, permission: PERMISSIONS) {
    return (Roles[userRole] as readonly PERMISSIONS[]).includes(permission);
}
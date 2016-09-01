import {User} from "../api/users";

export function HasPermission(user: User, permission: string, context: { [id: string]: string; } = {}) {
  if (!user) return false;
  if (~user.permissions.indexOf(permission)) return true;

  const filledPermission = permission.replace(/\:(\w+)/g, (match, id) => {
    return context[id] || match;
  });

  return !!~user.permissions.indexOf(filledPermission);
}

export interface PermissionLevel {
  permissions: string[];
  title: string;
  description: string;

  icon?: {
    glyph: string;
    activeColour: string;
  };

  assign?: (user: User, context: { [id: string]: string; }) => void;
}

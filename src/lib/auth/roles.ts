export const Roles = {
  VISITOR: "visitor",
  CUSTOMER: "customer",
  STAFF: "staff",
  OWNER: "owner",
};

export type Role = (typeof Roles)[keyof typeof Roles];

export function normalizeRole(raw?: string) {
  const r = (raw || "").toLowerCase();
  if (r === "owner") return Roles.OWNER;
  if (r === "staff") return Roles.STAFF;
  if (r === "customer" || r === "user") return Roles.CUSTOMER;
  return Roles.VISITOR;
}

export function isAdminRole(role: Role) {
  return role === Roles.OWNER || role === Roles.STAFF;
}

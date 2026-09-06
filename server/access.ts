export interface DiscordAccessPolicy {
  adultRoleIds: ReadonlySet<string>;
  creatorRoleIds: ReadonlySet<string>;
}

export interface AccessDecision {
  isGuildMember: boolean;
  canViewAdult: boolean;
  canCreate: boolean;
}

const hasAnyRole = (roles: readonly string[], accepted: ReadonlySet<string>) => roles.some((role) => accepted.has(role));

export function decideAccess(isGuildMember: boolean, roles: readonly string[], policy: DiscordAccessPolicy): AccessDecision {
  if (!isGuildMember) return { isGuildMember: false, canViewAdult: false, canCreate: false };

  return {
    isGuildMember: true,
    canViewAdult: hasAnyRole(roles, policy.adultRoleIds) || hasAnyRole(roles, policy.creatorRoleIds),
    canCreate: hasAnyRole(roles, policy.creatorRoleIds),
  };
}

import { describe, expect, it } from 'vitest';
import { decideAccess } from '../server/access';

const policy = {
  adultRoleIds: new Set(['adult-role']),
  creatorRoleIds: new Set(['adult-role', 'moderator-role']),
};

describe('Discord access policy', () => {
  it('keeps non-members on SFW read-only access', () => {
    expect(decideAccess(false, ['adult-role'], policy)).toEqual({ isGuildMember: false, canViewAdult: false, canCreate: false });
  });

  it('keeps members without an accepted role on SFW read-only access', () => {
    expect(decideAccess(true, ['ordinary-role'], policy)).toEqual({ isGuildMember: true, canViewAdult: false, canCreate: false });
  });

  it('allows verified adults to view and create', () => {
    expect(decideAccess(true, ['adult-role'], policy)).toEqual({ isGuildMember: true, canViewAdult: true, canCreate: true });
  });

  it('allows explicitly configured adult staff roles', () => {
    expect(decideAccess(true, ['moderator-role'], policy)).toEqual({ isGuildMember: true, canViewAdult: true, canCreate: true });
  });
});

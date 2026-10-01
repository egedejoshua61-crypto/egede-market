export const ROLES = {
  GUEST: 'GUEST',
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const DEFAULT_ROLE = ROLES.BUYER;

export const isAdminRole = (role) => [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
export const isSellerRole = (role) => [ROLES.SELLER, ROLES.SUPER_ADMIN].includes(role);

export const getAssignedRole = (email, requestedRole = DEFAULT_ROLE) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (normalizedEmail === 'egedejoshua61@gmail.com') {
    return ROLES.SUPER_ADMIN;
  }

  return requestedRole;
};

export const ROLES = {
  EMPLOYEE: 'employee',
  IT_STAFF: 'it_staff',
  ADMIN: 'admin'
};

export const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

export const isAdmin = roleCheck(ROLES.ADMIN);
export const isITStaff = roleCheck(ROLES.IT_STAFF, ROLES.ADMIN);
export const isITStaffOrAdmin = roleCheck(ROLES.IT_STAFF, ROLES.ADMIN);

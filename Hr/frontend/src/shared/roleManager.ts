export const getDashboardPath = (role: string) => {
  switch (role.toUpperCase()) {
    case 'HR':
    case 'CEO':
    case 'ADMIN':
      return '/hr/dashboard';
    case 'EMPLOYEE':
      return '/employee/dashboard';
    case 'LEAD':
    case 'TECH_LEAD':
      return '/tech/dashboard';
    default:
      return '/dashboard';
  }
}

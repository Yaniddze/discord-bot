export const checkAdminPermissions = (toCheck) => toCheck.member.permissions.has('ADMINISTRATOR');

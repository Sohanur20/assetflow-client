import useCurrentUser from './useCurrentUser';

// Convenience hook: returns 'hr' | 'employee' | null plus loading state.
const useUserRole = () => {
  const { dbUser, dbUserLoading } = useCurrentUser();
  return { role: dbUser?.role || null, dbUser, isRoleLoading: dbUserLoading };
};

export default useUserRole;

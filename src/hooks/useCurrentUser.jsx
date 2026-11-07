import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

// Fetches the database user (role, company, package, affiliation) for the
// currently signed-in Firebase user. This drives role-based UI and guards.
const useCurrentUser = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: dbUser = null,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['db-user', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user.email}`);
      return res.data;
    },
  });

  return { dbUser, dbUserLoading: isLoading, refetchDbUser: refetch };
};

export default useCurrentUser;

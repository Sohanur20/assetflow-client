import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCurrentUser from '../hooks/useCurrentUser';
import LoadingSpinner from '../components/LoadingSpinner';

const HRRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { dbUser, dbUserLoading } = useCurrentUser();
  const location = useLocation();

  if (loading || (user && dbUserLoading)) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (dbUser?.role === 'hr') return children;
  return <Navigate to="/" replace />;
};

export default HRRoute;

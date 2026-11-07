import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for Firebase auth state so a page reload on a private route
  // does not bounce a signed-in user back to the login page.
  if (loading) return <LoadingSpinner />;
  if (user) return children;
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;

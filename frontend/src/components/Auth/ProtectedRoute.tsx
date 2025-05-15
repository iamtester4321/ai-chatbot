import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../actions/user.actions';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { success } = await fetchUserProfile();
        setIsAuthenticated(success);
      } catch (error) {
        console.error(error)
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    console.log(isLoading)
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
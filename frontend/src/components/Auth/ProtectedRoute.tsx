import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../actions/user.actions';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

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
    return null;
  }

  if (isAuthenticated) {
    const validPaths = ["/", "/chat", "/chat/"];
    const isValidPath = validPaths.some(path => location.pathname === path) || 
                       location.pathname.match(/^\/chat\/[\w-]+$/);
    
    if (!isValidPath) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  return <Navigate to="/login" replace />;
};
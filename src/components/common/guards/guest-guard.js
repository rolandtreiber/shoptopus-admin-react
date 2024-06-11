import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../../hooks/use-auth';

export const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

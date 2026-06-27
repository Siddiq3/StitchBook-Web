import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../api/authApi.js';

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getAuthToken()) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`/login?redirect=${redirect}`} />;
  }

  return children;
}

export default ProtectedRoute;

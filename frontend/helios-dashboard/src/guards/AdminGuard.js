import { Navigate, Outlet, useLocation } from "react-router-dom";

import { auth } from "../firebase.js";

const AdminGuard = ({ expectedAuth }) => {
  const location = useLocation();

  const isAuth = auth.currentUser != null;

  if (isAuth && !expectedAuth) {
    return <Navigate to="/admin" />;
  } else if (!isAuth && expectedAuth) {
    return (
      <Navigate
        to={`/auth/log-in?redirect=${encodeURIComponent(location.pathname)}`}
      />
    );
  }

  return <Outlet />;
};

export default AdminGuard;

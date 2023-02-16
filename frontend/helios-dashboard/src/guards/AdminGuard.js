import { Navigate, Outlet } from "react-router-dom";

import { auth } from "../firebase.js";

const AdminGuard = ({ expectedAuth }) => {
  //console.log(auth.currentUser != null && !expectedAuth);
  //console.log(!auth.currentUser && expectedAuth);

  const isAuth = auth.currentUser != null;
  console.log("Auth: " + isAuth);
  console.log(JSON.stringify(auth));

  if (isAuth && !expectedAuth) {
    return <Navigate to="/admin" />;
  } else if (!isAuth && expectedAuth) {
    return <Navigate to="/auth/log-in" />;
  }

  return <Outlet />;
};

export default AdminGuard;

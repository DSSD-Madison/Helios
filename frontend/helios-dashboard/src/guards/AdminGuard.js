import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.js";
import { collection, doc, getDoc } from "@firebase/firestore";

import { useEffect } from "react";

const AdminGuard = ({ expectedAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuth = auth.currentUser != null;

  const getAdminStatus = async () => {
    const notAdmin = () => {
      if (auth.currentUser && expectedAuth) navigate("/auth/not-admin");
    };

    if (!auth.currentUser) {
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const userRef = doc(usersRef, auth.currentUser.uid);

      const userDoc = await getDoc(userRef);

      if (!userDoc.data().isAdmin) {
        notAdmin();
      }
    } catch (e) {
      // Not admin
      notAdmin();
    }
  };

  useEffect(() => {
    getAdminStatus();

    // eslint-disable-next-line
  }, [location, auth.currentUser]);

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

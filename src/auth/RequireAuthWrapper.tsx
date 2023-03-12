import { useAuth } from "./auth-context";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RequireAuth() {
  let auth = useAuth();
  let location = useLocation();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    auth.signin(() => setIsFetched(true));
  }, []);

  if (!isFetched) return null;

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

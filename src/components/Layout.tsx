import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import AuthStatus from "../auth/AuthStatus";

export default function Layout() {
  let auth = useAuth();
  useEffect(() => {}, [auth]);

  return (
    <div className="p-4">
      <AuthStatus />

      <ul className="text-blue-500 underline py-4 flex w-full">
        {auth.user && (
          <>
            <li className="flex-1 flex justify-center">
              <Link to="/campaign">Campaigns</Link>
            </li>
          </>
        )}
        {!auth.user && (
          <>
            <>
              <li className="flex-1 flex justify-center">
                <Link to="/">Home Page</Link>
              </li>
            </>
            <li className="flex-1 flex justify-center">
              <Link to="/login">Login</Link>
            </li>
            <li className="flex-1 flex justify-center">
              <Link to="/registration">Registration</Link>
            </li>
          </>
        )}
      </ul>

      <Outlet />
    </div>
  );
}

import { Link, Outlet } from "react-router-dom";
import AuthStatus from "./AuthStatus";

export default function Layout() {
  return (
    <div className="p-4">
      <AuthStatus />

      <ul className="text-blue-500 underline py-4 flex w-full">
        <li className="flex-1 flex justify-center">
          <Link to="/">Home Page</Link>
        </li>
        {/* <li>
          <Link to="/public-page">Public Page</Link>
        </li> */}
        <li className="flex-1 flex justify-center">
          <Link to="/map">Map</Link>
        </li>
        <li className="flex-1 flex justify-center">
          <Link to="/login">Login</Link>
        </li>
        <li className="flex-1 flex justify-center">
          <Link to="/registration">Registration</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

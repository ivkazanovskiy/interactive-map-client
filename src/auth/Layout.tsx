import { Link, Outlet } from "react-router-dom";
import AuthStatus from "./AuthStatus";

export default function Layout() {
  return (
    <div className="p-4">
      <AuthStatus />

      <ul className="text-blue-500 underline py-4">
        <li>
          <Link to="/">Home Page</Link>
        </li>
        <li>
          <Link to="/public-page">Public Page</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

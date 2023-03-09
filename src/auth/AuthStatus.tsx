import { useAuth } from "./auth-context";
import { useNavigate } from "react-router-dom";

export default function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <p className="text-red-500">You are not logged in :/</p>;
  }

  return (
    <p>
      Welcome{" "}
      <span className="font-semibold text-green-600">{auth.user}! </span>
      <button
        type="button"
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
        className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2"
      >
        Sign out
      </button>
    </p>
  );
}

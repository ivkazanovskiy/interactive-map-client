import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

export default function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username") as string;

    auth.signin(username, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <div>
      <p>
        You must log in to view the page at{" "}
        <span className="text-purple-500 underline">{from}</span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-40 my-6 p-2 border rounded"
      >
        <label>
          Username:{" "}
          <input
            className="bg-blue-100 rounded w-full border-2 border-sky-500"
            name="username"
            type="text"
          />
        </label>{" "}
        <button
          type="submit"
          className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}

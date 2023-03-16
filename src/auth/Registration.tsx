import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { client } from "../api/client";
import { config } from "../config";
import { TCredentials } from "../types/credentials.type";
import { TTokens } from "../types/tokens.type";
import { useAuth } from "./auth-context";
import googleSvg from "../assets/google.svg";

export default function RegistrationPage() {
  let navigate = useNavigate();
  let auth = useAuth();

  const loginMutation = useMutation(
    (data: TCredentials & { username: string }) =>
      client.post<TTokens>("/auth/sign-up", data),
    {
      onSuccess: ({ data }) => {
        // TODO: validate data with zod validation
        // TODO: change strings 'at' and 'rt' with enum
        localStorage.setItem("at", data.accessToken);
        localStorage.setItem("rt", data.refreshToken);
        client.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;
        // setIsAuthorized(true);
        auth.signin(() => {
          navigate("/campaign");
        });
      },
      onError: (err: AxiosError) => {
        console.error(err.response?.data);
        // TODO: add correct error handling
      },
    },
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let email = formData.get("email");
    let password = formData.get("password");
    let username = formData.get("username");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof username !== "string"
    ) {
      console.error("Invalid input type"); // TODO: set alert
      return;
    }

    loginMutation.mutate({ email, password, username });
  }

  return (
    <div>
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
        <label>
          Email:{" "}
          <input
            className="bg-blue-100 rounded w-full border-2 border-sky-500"
            name="email"
            type="email"
          />
        </label>{" "}
        <label>
          Password:{" "}
          <input
            className="bg-blue-100 rounded w-full border-2 border-sky-500"
            name="password"
            type="password"
          />
        </label>{" "}
        <button
          type="submit"
          className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2"
        >
          Registration
        </button>
      </form>

      <button
        className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
      >
        {" "}
        <a href={`${config.backendUrl}/auth/google`}>
          Registration with{" "}
          <img src={googleSvg} alt="Google" style={{ display: "inline" }} />{" "}
        </a>
      </button>
    </div>
  );
}

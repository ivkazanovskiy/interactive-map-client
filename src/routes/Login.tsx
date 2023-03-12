import { AxiosError } from "axios";
import { MouseEventHandler, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { TTokens } from "../types/tokens.type";
import { useNavigate } from "react-router-dom";
import { client } from "../api/client";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const mutation = useMutation(
    (data: { email: string; password: string }) =>
      client.post<TTokens>("/auth/login", data),
    {
      onSuccess: ({ data }) => {
        // TODO: validate data with zod validation
        // TODO: change strings 'at' and 'rt' with enum
        localStorage.setItem("at", data.accessToken);
        localStorage.setItem("rt", data.refreshToken);
        client.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;
        // setIsAuthorized(true);
        navigate("/");
      },
      onError: (err: AxiosError) => {
        console.error(err.response?.data);
        // TODO: change strings 'at' and 'rt' with enum
        localStorage.removeItem("at");
        localStorage.removeItem("rt");
        // setIsAuthorized(false);
      },
    },
  );

  const login: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;
    if (!email || !password) {
      // TODO: add client-side validation
      console.error("enter credentials");
      return;
    }

    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="email">Email</label>
      <input ref={emailRef} type="email" name="email" className="border-2" />
      <label htmlFor="password">Password</label>
      <input
        ref={passwordRef}
        type="password"
        name="password"
        className="border-2"
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

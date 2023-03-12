import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { client } from "../api/client";
import { TTokens } from "../types/tokens.type";

export default function GoogleCallback() {
  const { search } = useLocation();

  const {
    isLoading,
    isError,
    error,
    data: response,
  } = useQuery({
    queryFn: () => client.get<TTokens>("/auth/google/callback" + search),
    retry: 0,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    console.error(error);
    return <Navigate to="/login" />;
  }

  // TODO: validate data with zod
  localStorage.setItem("at", response.data.accessToken);
  localStorage.setItem("rt", response.data.refreshToken);
  client.defaults.headers[
    "Authorization"
  ] = `Bearer ${response.data.accessToken}`;
  return <Navigate to="/" />;
}

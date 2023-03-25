import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEventHandler } from "react";
import { Navigate, useParams } from "react-router-dom";
import { client } from "../api/client";
import Button from "../components/Button";
import { TMap } from "../types/map.type";
import { TSession } from "../types/session.type";

export default function Session() {
  let { id: sessionId } = useParams();

  const queryClient = useQueryClient();

  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(
    ["session", sessionId],
    () => client.get<TSession>(`/session/${sessionId}`),
    {
      retry: false,
    },
  );

  const inviteUserMutation = useMutation(
    (data: { id: number }) =>
      client.post<TSession>(`/session/${sessionId}/user`, { ...data }),
    {
      // TODO: handle error
      onError: console.error,
      // TODO: add enum
      onSuccess: (data) => {
        queryClient.invalidateQueries(["session", sessionId]);
      },
    },
  );

  const kickUserMutation = useMutation(
    ({ id }: { id: number }) =>
      client.delete<TSession>(`/session/${sessionId}/user`, { data: { id } }),
    {
      // TODO: handle error
      onError: console.error,
      // TODO: add enum
      onSuccess: (data) => {
        queryClient.invalidateQueries(["session", sessionId]);
      },
    },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let id = formData.get("id");

    if (typeof id !== "string" || !Number(id)) {
      console.error("Invalid input type"); // TODO: set alert
      return;
    }

    inviteUserMutation.mutate({ id: Number(id) });
  };

  if (!sessionId) return <Navigate to="campaigns"></Navigate>;
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;
  const session = response.data;

  return (
    <>
      <h1>
        Session <b>{session.name}</b>
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="userId">Invite user to the session</label>
        <input type="text" name="id" id="userId" className="border-2" />
        <button
          type="submit"
          className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
        >
          Send invitation
        </button>
      </form>
      <div>
        {session.userList.map(({ id, isAccepted }) => (
          <div key={sessionId! + id} className="flex flex-col">
            <Button
              text={id.toString()}
              title={isAccepted ? "accepted" : "invited"}
            />

            <button
              onClick={() => kickUserMutation.mutate({ id })}
              className="focus:outline-none w-max text-white bg-red-600 hover:bg-red-700
      focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
            >
              Kick user
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

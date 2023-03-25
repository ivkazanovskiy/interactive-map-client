import { FormEventHandler } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import { TMap } from "../types/map.type";
import Button from "./Button";
import { TMultipleResponse } from "../types/multiple-response.type";
import { TSession } from "../types/session.type";

type TProps = { campaignId: number };

export default function Sessions({ campaignId }: TProps) {
  const queryClient = useQueryClient();

  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(["sessions", campaignId], () =>
    client.get<TMultipleResponse<TSession>>(`/session`, {
      params: { campaignId },
    }),
  );

  const newSession = useMutation(
    (data: { name: string }) =>
      client.post<TMap>("/session", { ...data, campaignId }),
    {
      // TODO: handle error
      onError: console.error,
      // TODO: add enum
      onSuccess: (data) => {
        queryClient.invalidateQueries(["sessions", campaignId]);
      },
    },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let name = formData.get("name");

    if (typeof name !== "string") {
      console.error("Invalid input type"); // TODO: set alert
      return;
    }

    newSession.mutate({ name });
  };

  if (isSuccess) {
    // TODO: add pagination
    const { result: sessions } = response.data;

    return (
      <>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label htmlFor="sessionName">New session name </label>
          <input
            type="text"
            name="name"
            id="sessionName"
            className="border-2"
          />
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
          >
            Create new session
          </button>
        </form>
        <div>
          {sessions.map(({ id, name }) => (
            <Button
              key={id}
              text={name}
              title="session"
              to={`/session/${id}`}
            />
          ))}
        </div>
      </>
    );
  }

  //error case
  return <div>Sessions</div>;
}

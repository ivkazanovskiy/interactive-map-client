import { FormEventHandler } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import { TMap } from "../types/map.type";
import Button from "./Button";

type TProps = { campaignId: number };

export default function Maps({ campaignId }: TProps) {
  const queryClient = useQueryClient();

  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(["maps", campaignId], () =>
    client.get<[TMap[], number]>(`/map`, { params: { campaignId } }),
  );

  const newMap = useMutation(
    (data: { name: string }) =>
      client.post<TMap>("/map", { ...data, campaignId }),
    {
      // TODO: handle error
      onError: console.error,
      // TODO: add enum
      onSuccess: (data) => {
        queryClient.invalidateQueries(["maps", campaignId]);
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

    newMap.mutate({ name });
  };

  if (isSuccess) {
    // TODO: add pagination
    const [maps, count] = response.data;

    return (
      <>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label htmlFor="mapName">New map name </label>
          <input type="text" name="name" id="mapName" className="border-2" />
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
          >
            Create new map
          </button>
        </form>
        <div>
          {maps.map(({ id, name }) => (
            <Button key={id} text={name} to={`/map/${id}`} />
          ))}
        </div>
      </>
    );
  }

  return <div>Maps</div>;
}

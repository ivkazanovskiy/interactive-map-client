import { FormEventHandler } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { client } from "../api/client";
import { TMap } from "../types/map.type";
import Button from "./button";

type TProps = { campaignId: number };

export default function Maps({ campaignId }: TProps) {
  const queryClient = useQueryClient();

  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery("getMaps" + campaignId, () =>
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
        queryClient.invalidateQueries("getMaps" + campaignId);
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
        <form onSubmit={handleSubmit}>
          <label>
            New map name
            <input
              type="text"
              name="name"
              id="campaignName"
              className="border-2"
            />
          </label>
          <button type="submit">Create new map</button>
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

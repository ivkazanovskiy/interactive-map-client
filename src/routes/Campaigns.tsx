import { FormEventHandler, MouseEventHandler } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import Button from "../components/Button";
import { TCampaign } from "../types/campaign.type";
import { TMultipleResponse } from "../types/multiple-response.type";

export default function Campaigns() {
  const queryClient = useQueryClient();
  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(["campaigns"], () =>
    client.get<TMultipleResponse<TCampaign>>("/campaign"),
  );

  const newCampaign = useMutation(
    (data: { name: string }) => client.post<TCampaign>("/campaign", data),
    {
      // TODO: handle error
      onError: console.error,
      // TODO: add enum
      onSuccess: (data) => queryClient.invalidateQueries(["campaigns"]),
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

    newCampaign.mutate({ name });
  };

  if (isLoading) return <>Loading ...</>;

  if (isSuccess) {
    // TODO: add pagination
    const { result: campaigns } = response.data;

    return (
      <>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label htmlFor="campaignName">New campaign name</label>
          <input
            type="text"
            name="name"
            id="campaignName"
            className="border-2"
          />
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
          >
            Create new campaign
          </button>
        </form>
        <div>
          {campaigns.map(({ id, name }) => (
            <Button
              key={id}
              text={name}
              to={`/campaign/${id}`}
              title="campaign"
            />
          ))}
        </div>
      </>
    );
  }

  // TODO: add error handling
  return <></>;
}

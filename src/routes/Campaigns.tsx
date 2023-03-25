import { FormEventHandler, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import Button from "../components/Button";
import { TCampaign } from "../types/campaign.type";
import { TMultipleResponse } from "../types/multiple-response.type";

export default function Campaigns() {
  const [campaignName, setCampaignName] = useState("");
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
      onSuccess: () => {
        queryClient.invalidateQueries(["campaigns"]);
        setCampaignName("");
      },
    },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!campaignName?.length) return;

    newCampaign.mutate({ name: campaignName });
  };

  if (isLoading) return <>Loading ...</>;

  if (isError) return <>Error</>;

  // TODO: add pagination
  const { result: campaigns } = response.data;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        <label htmlFor="campaignName">New campaign name</label>
        <input
          type="text"
          placeholder="Campaign name"
          name="name"
          id="campaignName"
          className="border-2"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <button
          type="submit"
          disabled={!campaignName.length}
          className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2 disabled:opacity-50"
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

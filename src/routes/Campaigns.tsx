import { FormEventHandler, MouseEventHandler } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { client } from "../api/client";
import Button from "../components/Button";
import { TCampaign } from "../types/campaign.type";

export default function Campaigns() {
  const queryClient = useQueryClient();
  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery("getCampaigns", () =>
    client.get<[TCampaign[], number]>("/campaign"),
  );

  const newCampaign = useMutation(
    (data: { name: string }) => client.post<TCampaign>("/campaign", data),
    {
      // TODO: handle error
      onError: console.error,
      // TODO: add enum
      onSuccess: (data) => queryClient.invalidateQueries("getCampaigns"),
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
    const [campaigns, count] = response.data;

    return (
      <>
        <form onSubmit={handleSubmit}>
          <label htmlFor="campaignName">New campaign name</label>
          <input
            type="text"
            name="name"
            id="campaignName"
            className="border-2"
          />
          <button type="submit">Create new campaign</button>
        </form>
        <div>
          {campaigns.map(({ id, name }) => (
            <Button key={id} text={name} to={`/campaign/${id}`} />
          ))}
        </div>
      </>
    );
  }

  // TODO: add error handling
  return <></>;
}

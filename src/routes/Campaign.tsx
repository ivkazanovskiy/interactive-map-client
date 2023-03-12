import { AxiosError } from "axios";
import { FormEventHandler, MouseEventHandler } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { client } from "../api/client";
import Maps from "../components/Maps";
import { TCampaign } from "../types/campaign.type";
import { TMap } from "../types/map.type";

export default function Campaign() {
  let { id } = useParams();
  const queryClient = useQueryClient();

  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(["getCampaign" + id], () =>
    client.get<TCampaign>(`/campaign/${id}`),
  );

  if (!id) <Navigate to="campaign"></Navigate>;

  if (isError) return <Navigate to="campaign"></Navigate>;

  if (isLoading) return <>Loading ...</>;

  if (isSuccess) {
    return (
      <>
        <h1>{response.data.name}</h1>
        <Maps campaignId={Number(id)}></Maps>
      </>
    );
  }

  // TODO: add error handling
  return <></>;
}

import { AxiosError } from "axios";
import { FormEventHandler, MouseEventHandler, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { client } from "../api/client";
import Maps from "../components/Maps";
import { TCampaign } from "../types/campaign.type";
import { TMap } from "../types/map.type";
import Sessions from "../components/Sessions";

export default function Campaign() {
  let { id } = useParams();
  const [mapsOrSessions, setMapsOrSessions] = useState<"maps" | "sessions">(
    "maps",
  );
  const queryClient = useQueryClient();

  // TODO: add enum
  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(["campaign", id], () =>
    client.get<TCampaign>(`/campaign/${id}`),
  );

  if (!id) <Navigate to="campaign"></Navigate>;

  if (isError) return <Navigate to="campaign"></Navigate>;

  if (isLoading) return <>Loading ...</>;

  if (isSuccess) {
    return (
      <>
        <h1>{response.data.name}</h1>
        <button
          onClick={() => setMapsOrSessions("sessions")}
          className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
        >
          Sessions
        </button>
        <button
          onClick={() => setMapsOrSessions("maps")}
          className="focus:outline-none text-white bg-green-600 hover:bg-green-700
      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1
      mr-2 mb-2"
        >
          Maps
        </button>
        {mapsOrSessions === "maps" ? (
          <Maps campaignId={Number(id)}></Maps>
        ) : (
          <Sessions campaignId={Number(id)}></Sessions>
        )}
      </>
    );
  }

  // TODO: add error handling
  return <></>;
}

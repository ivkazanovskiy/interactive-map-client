import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { client } from "../api/client";
import Canvas from "../components/Canvas/Canvas";
import { TMap } from "../types/map.type";

export default function Map() {
  let { id } = useParams();
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(20);
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  const {
    isError,
    isLoading,
    isSuccess,
    data: response,
  } = useQuery(["map", id], () => client.get<TMap>(`/map/${id}`), {
    retry: false,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setImageSrc(imageURL);
  };

  if (isError) return <Navigate to="/campaign"></Navigate>;

  return (
    <div
      className=" w-full h-full flex-col border-2 border-cyan-500 flex justify-center items-center"
      style={{ overflow: "hidden" }}
    >
      {/* <label htmlFor="vol" className=" text-green-500 ">
        Zoom (between 1 and 3):
      </label>
      <input
        type="range"
        id="vol"
        name="vol"
        min="10"
        max="50"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      /> */}
      <label htmlFor="fieldWidth" className=" text-green-500 ">
        Width:
      </label>
      <input
        type="number"
        id="fieldWidth"
        name="width"
        min="2"
        max="100"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <label htmlFor="fieldHeight" className=" text-green-500 ">
        Height:
      </label>
      <input
        type="number"
        id="fieldHeight"
        name="height"
        min="2"
        max="100"
        value={height}
        onChange={(e) => setHeight(Number(e.target.value))}
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <input />
      <input />
      <Canvas
        width={width}
        height={height}
        // zoom={zoom}
        backgroundImage={imageSrc}
        className="border-2"
      />
    </div>
  );
}

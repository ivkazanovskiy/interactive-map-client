import { useState } from "react";
import Canvas from "./Canvas";

export default function Map() {
  const [zoom, setZoom] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setImageSrc(imageURL);
  };

  return (
    <div className=" w-[500px] h-[500px] flex-col border-2 border-cyan-500 flex items-center justify-center">
      <label htmlFor="vol" className=" text-green-500 ">
        Zoom (between 1 and 3):
      </label>
      <input
        type="range"
        id="vol"
        name="vol"
        min="1"
        max="3"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Canvas
        width={450}
        height={350}
        cellSize={15}
        zoom={zoom}
        backgroundImage={imageSrc}
      />
    </div>
  );
}

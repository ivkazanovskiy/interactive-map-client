import { useEffect, useRef, MouseEventHandler, useState } from "react";
import { Field } from "./Field";
import { TCoord, TMapData } from "./types/map.types";
import io from "socket.io-client";
import { config } from "../../config";

const socket = io(config.backendUrl, {
  transports: ["websocket"],
  path: "/socket.io",
});

type CanvasProps = {
  width: number;
  height: number;
  cellSize: number;
  zoom: number;
  backgroundImage?: string;
};

/**
 * converts canvas coordinates to map coordinates
 */
const getCurrentCellId = (
  mouse: TCoord,
  offset: TCoord,
  cellSize: number,
  zoom: number,
): TCoord => {
  const x = Math.floor((mouse.x - offset.x) / (zoom * cellSize));
  const y = Math.floor((mouse.y - offset.y) / (zoom * cellSize));

  return { x, y };
};

const areEqualCoords = (first: TCoord, second: TCoord): boolean => {
  return first.x === second.x && first.y === second.y;
};

export default function Canvas({
  width,
  height,
  cellSize,
  zoom,
  backgroundImage,
}: CanvasProps) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [bgImagePosition, setBgImagePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const defaultCoord = { x: 0, y: 0 };

  const [mapData, setMapData] = useState<TMapData>({
    char: defaultCoord,
    mouse: defaultCoord,
    offset: defaultCoord,
  });

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pong", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const field = new Field(width, height, cellSize, zoom);
    field.draw({ ctx, mapData });
  }, [mapData, zoom]);

  const moveMouse: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvasCoord = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    const fieldCoord = getCurrentCellId(
      canvasCoord,
      mapData.offset,
      cellSize,
      zoom,
    );

    switch (event.buttons) {
      case 0:
        // without pushed button
        setMapData({
          ...mapData,
          mouse: fieldCoord,
        });
        break;
      case 2: {
        if (!mapData.dragMemo) return;
        if (!mapData.offsetMemo) return;

        const diffX = canvasCoord.x - mapData.dragMemo.x;
        const diffY = canvasCoord.y - mapData.dragMemo.y;

        const newBgImagePosition = {
          x: mapData.offsetMemo.x + diffX,
          y: mapData.offsetMemo.y + diffY,
        };

        setMapData({
          ...mapData,
          offset: {
            x: mapData.offsetMemo.x + diffX,
            y: mapData.offsetMemo.y + diffY,
          },
          mouse: fieldCoord,
        });

        setBgImagePosition(newBgImagePosition);
      }
    }
  };

  const clickCell: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvasCoord = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    const fieldCoord = getCurrentCellId(
      canvasCoord,
      mapData.offset,
      cellSize,
      zoom,
    );

    if (!mapData.charMemo && areEqualCoords(fieldCoord, mapData.char)) {
      setMapData({ ...mapData, charMemo: fieldCoord });
    }

    if (mapData.charMemo && !areEqualCoords(fieldCoord, mapData.charMemo)) {
      socket.emit("ping", "test");
      setMapData({ ...mapData, charMemo: null, char: fieldCoord });
    }
  };

  const saveDragCoord: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const coord = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    if (event.buttons === 2) {
      setMapData({
        ...mapData,
        dragMemo: {
          x: coord.x,
          y: coord.y,
        },
        offsetMemo: {
          x: mapData.offset.x,
          y: mapData.offset.y,
        },
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: `${width}px`,
        height: `${height}px`,
        border: "2px solid teal",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${bgImagePosition.y}px`,
          left: `${bgImagePosition.x}px`,
          backgroundSize: "cover",
          backgroundImage: `url(${backgroundImage})`,
          width: `${width * zoom}px`,
          height: `${height * zoom}px`,
        }}
      />
      <canvas
        ref={canvasRef}
        onMouseMove={moveMouse}
        onClick={clickCell}
        onContextMenu={(e) => e.preventDefault()} // disable right click context menu
        onMouseDown={saveDragCoord}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

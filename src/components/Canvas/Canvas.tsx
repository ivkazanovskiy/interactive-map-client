import { useEffect, useRef, MouseEventHandler, useState } from "react";
import { Field } from "./Field";
import { TCoord, TMapData } from "./types/map.types";

const ind = (coord: TCoord, cellSize: number) =>
  `${Math.floor(coord.x / cellSize) * cellSize}:${
    Math.floor(coord.y / cellSize) * cellSize
  }`;

export function Canvas(props: {
  width: number;
  height: number;
  cellSize: number;
  zoom: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const defaultCoord = { x: 0, y: 0 };

  const [mapData, setMapData] = useState<TMapData>({
    char: defaultCoord,
    mouse: defaultCoord,
    offset: defaultCoord,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = props.width;
    canvas.height = props.height;

    const field = new Field(
      canvas.width,
      canvas.height,
      props.cellSize,
      props.zoom
    );
    field.draw({ ctx, mapData });
  }, [mapData, props.zoom]);

  const moveMouse: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const coord = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    switch (event.buttons) {
      case 0:
        // without pushed button
        setMapData({
          ...mapData,
          mouse: coord,
        });
        break;
      case 2: {
        if (!mapData.dragMemo) return;
        if (!mapData.offsetMemo) return;

        const diffX = coord.x - mapData.dragMemo.x;
        const diffY = coord.y - mapData.dragMemo.y;

        setMapData({
          ...mapData,
          offset: {
            x: mapData.offsetMemo.x + diffX,
            y: mapData.offsetMemo.y + diffY,
          },
          mouse: coord,
        });
      }
    }
  };

  const clickCell: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const coord = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    if (
      !mapData.charMemo &&
      ind(coord, props.cellSize) === ind(mapData.char, props.cellSize)
    ) {
      setMapData({ ...mapData, charMemo: coord });
    }

    if (
      mapData.charMemo &&
      ind(coord, props.cellSize) !== ind(mapData.charMemo, props.cellSize)
    ) {
      setMapData({ ...mapData, charMemo: null, char: coord });
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
    <canvas
      ref={canvasRef}
      className="border-2"
      onMouseMove={moveMouse}
      onClick={clickCell}
      onContextMenu={(e) => e.preventDefault()} // disable right click context menu
      onMouseDown={saveDragCoord}
    />
  );
}

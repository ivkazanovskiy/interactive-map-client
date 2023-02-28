import {
  useEffect,
  useRef,
  MouseEventHandler,
  useState,
  DragEventHandler,
} from "react";
type TCoord = { x: number; y: number };

type TDrawOption = {
  ctx: CanvasRenderingContext2D;
  mapData: TMapData;
};
type TKeys = "mouse" | "char" | "offset";
type TCacheKeys = "charMemo" | "dragMemo" | "offsetMemo";

type TMapData = Record<TKeys, TCoord> &
  Partial<Record<TCacheKeys, TCoord | null>>;

const ind = (coord: TCoord, cellSize: number) =>
  `${Math.floor(coord.x / cellSize) * cellSize}:${
    Math.floor(coord.y / cellSize) * cellSize
  }`;

class Cell {
  id: string;

  constructor(
    public startX: number,
    public startY: number,
    public cellSize: number
  ) {
    this.id = `${startX}:${startY}:${cellSize}`;
  }

  draw({ ctx, mapData }: TDrawOption, zoom: number) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    if (this.doesIncludeCoords(mapData.char, mapData.offset, zoom)) {
      ctx.strokeStyle = "green";
    } else if (
      mapData.charMemo &&
      this.doesIncludeCoords(mapData.charMemo, mapData.offset, zoom)
    ) {
      ctx.strokeStyle = "black";
    } else if (this.doesIncludeCoords(mapData.mouse, mapData.offset, zoom)) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "gray";
    }

    ctx.rect(
      this.startX * zoom + mapData.offset.x,
      this.startY * zoom + mapData.offset.y,
      this.cellSize * zoom,
      this.cellSize * zoom
    );
    ctx.stroke();
    ctx.closePath();
  }

  private doesIncludeCoords(
    coord: TCoord,
    offset: TCoord,
    zoom: number
  ): boolean {
    if (!coord) return false;

    const fieldX = (coord.x - offset.x) / zoom;
    const fieldY = (coord.y - offset.y) / zoom;
    return (
      this.startX <= fieldX &&
      this.startY <= fieldY &&
      this.startX + this.cellSize > fieldX &&
      this.startY + this.cellSize > fieldY
    );
  }
}

class Field {
  width: number;
  height: number;
  cells: Cell[][] = [];

  constructor(
    parentWidth: number,
    parentHeight: number,
    public cellSize: number,
    public zoom: number
  ) {
    this.width = Math.floor(parentWidth / cellSize) * cellSize;
    this.height = Math.floor(parentHeight / cellSize) * cellSize;
    this.addCells();
  }

  private addCells() {
    const rows = this.height / this.cellSize;
    const columns = this.width / this.cellSize;

    for (let i = 0; i < rows; i += 1) {
      const row: Cell[] = [];
      for (let j = 0; j < columns; j += 1) {
        row.push(new Cell(j * this.cellSize, i * this.cellSize, this.cellSize));
      }
      this.cells.push(row);
    }
  }

  draw(options: TDrawOption) {
    this.cells.forEach((row) =>
      row.forEach((cell) => cell.draw(options, this.zoom))
    );
  }
}

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

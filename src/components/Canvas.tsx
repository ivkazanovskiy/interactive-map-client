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
type TCacheKeys = "charMemo" | "dragMemo";

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

    if (this.doesIncludesCoords(mapData.char, mapData.offset)) {
      ctx.strokeStyle = "green";
    } else if (
      mapData.charMemo &&
      this.doesIncludesCoords(mapData.charMemo, mapData.offset)
    ) {
      ctx.strokeStyle = "black";
    } else if (this.doesIncludesCoords(mapData.mouse, mapData.offset)) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "gray";
    }

    ctx.rect(
      (this.startX + mapData.offset.x) * zoom,
      (this.startY + mapData.offset.y) * zoom,
      this.cellSize * zoom,
      this.cellSize * zoom
    );
    ctx.stroke();
    ctx.closePath();
  }

  private doesIncludesCoords(coord: TCoord, offset: TCoord): boolean {
    if (!coord) return false;

    return (
      this.startX + offset.x <= coord.x &&
      this.startY + offset.y <= coord.y &&
      this.startX + offset.x + this.cellSize > coord.x &&
      this.startY + offset.y + this.cellSize > coord.y
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
        if (mapData.dragMemo) {
          setMapData({
            ...mapData,
            offset: {
              // TODO: set correct flow for zoom
              x: coord.x - mapData.dragMemo.x,
              y: coord.y - mapData.dragMemo.y,
              // x: (coord.x - mapData.dragMemo.x) / props.zoom,
              // y: (coord.y - mapData.dragMemo.y) / props.zoom,
            },
            mouse: coord,
          });
        }
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
          x: coord.x - mapData.offset.x,
          y: coord.y - mapData.offset.y,
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

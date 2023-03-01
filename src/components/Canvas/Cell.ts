import { TCoord, TDrawOption } from "./types/map.types";

export class Cell {
  id: string;

  constructor(
    public startX: number,
    public startY: number,
    public cellSize: number
  ) {
    this.id = `${startX}:${startY}:${cellSize}`;
  }

  default({ ctx, mapData }: TDrawOption) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
    ctx.rect(
      this.startX + mapData.offset.x,
      this.startY + mapData.offset.y,
      this.cellSize,
      this.cellSize
    );
    ctx.stroke();
    ctx.closePath();
  }

  hover({ ctx, mapData }: TDrawOption) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.rect(
      this.startX + mapData.offset.x,
      this.startY + mapData.offset.y,
      this.cellSize,
      this.cellSize
    );
    ctx.stroke();
    ctx.closePath();
  }

  memo({ ctx, mapData }: TDrawOption) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "red";
    ctx.rect(
      this.startX + mapData.offset.x,
      this.startY + mapData.offset.y,
      this.cellSize,
      this.cellSize
    );
    ctx.stroke();
    ctx.closePath();
  }

  occupied({ ctx, mapData }: TDrawOption) {
    ctx.beginPath();
    ctx.fillStyle = "cyan";
    ctx.fillRect(
      this.startX + mapData.offset.x,
      this.startY + mapData.offset.y,
      this.cellSize,
      this.cellSize
    );

    ctx.closePath();
  }
}

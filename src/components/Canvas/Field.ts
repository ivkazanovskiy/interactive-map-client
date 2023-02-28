import { Cell } from "./Cell";
import { TDrawOption } from "./types/map.types";

export class Field {
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

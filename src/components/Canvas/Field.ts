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
    public zoom: number,
  ) {
    this.width = Math.floor(parentWidth / cellSize) * cellSize;
    this.height = Math.floor(parentHeight / cellSize) * cellSize;
    this.addCells();
  }

  private addCells() {
    const rows = this.height / this.cellSize;
    const columns = this.width / this.cellSize;

    const scale = this.cellSize * this.zoom;

    for (let i = 0; i < rows; i += 1) {
      const row: Cell[] = [];
      for (let j = 0; j < columns; j += 1) {
        row.push(new Cell(j * scale, i * scale, scale));
      }
      this.cells.push(row);
    }
  }

  draw(options: TDrawOption) {
    const {
      mapData: { mouse, char, charMemo },
    } = options;

    this.cells.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (mouse.x === x && mouse.y === y) {
          cell.hover(options);
        } else {
          cell.default(options);
        }

        if (charMemo && charMemo.x === x && charMemo.y === y) {
          cell.memo(options);
        }

        if (char.x === x && char.y === y) {
          cell.occupied(options);
        }
      }),
    );
  }
}

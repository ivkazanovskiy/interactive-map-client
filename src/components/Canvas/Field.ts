import { Cell } from "./Cell";
import { TDrawOption } from "./types/map.types";

export class Field {
  cells: Cell[][] = [];

  constructor(
    public width: number,
    public height: number,
    public zoom: number,
  ) {
    this.addCells();
  }

  private addCells() {
    for (let i = 0; i < this.height; i += 1) {
      const row: Cell[] = [];
      for (let j = 0; j < this.width; j += 1) {
        row.push(new Cell(j * this.zoom, i * this.zoom, this.zoom));
      }
      this.cells.push(row);
    }
  }

  draw(options: TDrawOption) {
    const {
      mapData: { mouse, char, charMemo },
    } = options;

    // default net
    this.cells.forEach((row) =>
      row.forEach((cell) => {
        cell.default(options);
      }),
    );

    this.cells.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (mouse.x === x && mouse.y === y) {
          cell.hover(options);
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

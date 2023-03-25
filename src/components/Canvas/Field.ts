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
      mapData: { mouse, tokens, tokenMemo },
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

        if (tokenMemo && tokenMemo.x === x && tokenMemo.y === y) {
          cell.memo(options);
        }

        tokens.forEach((token) => {
          if (token.x === x && token.y === y) {
            cell.occupied(options, token.color);
          }
        });
      }),
    );
  }
}

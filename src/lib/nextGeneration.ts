import { Grid } from "../types";
import { countNeighbors } from "./countNeighbors";

export function nextGeneration(grid: Grid): Grid {
  const newGrid = grid.map((row) => [...row]);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const neighbors = countNeighbors(grid, x, y);
      if (grid[y][x]) {
        newGrid[y][x] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[y][x] = neighbors === 3;
      }
    }
  }

  return newGrid;
}

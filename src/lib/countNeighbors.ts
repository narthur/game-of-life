import { Grid } from "../types";

export function countNeighbors(grid: Grid, x: number, y: number): number {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newY = y + i;
      const newX = x + j;
      const wrappedY = (newY + grid.length) % grid.length;
      const wrappedX = (newX + grid[0].length) % grid[0].length;
      count += grid[wrappedY][wrappedX] ? 1 : 0;
    }
  }
  return count;
}

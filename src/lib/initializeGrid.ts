import { Grid } from "../types";

export function initializeGrid(width: number, height: number): Grid {
  return Array(height)
    .fill(0)
    .map(() => Array(width).fill(false));
}

import { countNeighbors } from "./lib/countNeighbors";
import { getEmoji } from "./lib/getEmoji";
import { initializeGrid } from "./lib/initializeGrid";
import { nextGeneration } from "./lib/nextGeneration";

const CELL_SIZE = 20; // px
const TICK_RATE = 200; // ms

let lastUpdateTime = 0;
let isPaused = false;
let unpauseTimeout: number;

function pause() {
  isPaused = true;
  if (unpauseTimeout) clearTimeout(unpauseTimeout);
  unpauseTimeout = setTimeout(() => {
    isPaused = false;
  }, 3000);
}

function createGrid() {
  const width = Math.floor((window.innerWidth - 2) / CELL_SIZE);
  const height = Math.floor((window.innerHeight - 2) / CELL_SIZE);

  const gridElement = document.createElement("div");
  gridElement.style.display = "grid";
  gridElement.style.gridTemplateColumns = `repeat(${width}, ${CELL_SIZE}px)`;
  gridElement.style.gap = "1px";

  const gameState = initializeGrid(width, height);
  let isDrawing = false;

  document.addEventListener("mousedown", () => (isDrawing = true));
  document.addEventListener("mouseup", () => (isDrawing = false));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("button");
      cell.style.width = `${CELL_SIZE}px`;
      cell.style.height = `${CELL_SIZE}px`;
      cell.textContent = "";
      cell.addEventListener("click", () => {
        gameState[y][x] = !gameState[y][x];
        const neighbors = countNeighbors(gameState, x, y);
        cell.textContent = gameState[y][x] ? getEmoji(neighbors) : " ";
        pause();
      });

      cell.addEventListener("mouseover", () => {
        if (isDrawing && !gameState[y][x]) {
          gameState[y][x] = true;
          const neighbors = countNeighbors(gameState, x, y);
          cell.textContent = getEmoji(neighbors);
          pause();
        }
      });

      gridElement.appendChild(cell);
    }
  }

  function update(timestamp: number) {
    if (timestamp - lastUpdateTime >= TICK_RATE && !isPaused) {
      lastUpdateTime = timestamp;

      const nextState = nextGeneration(gameState);
      const cells = gridElement.querySelectorAll("button");

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          gameState[y][x] = nextState[y][x];
          const cell = cells[y * width + x] as HTMLButtonElement;
          if (nextState[y][x]) {
            const neighbors = countNeighbors(nextState, x, y);
            cell.textContent = getEmoji(neighbors);
          } else {
            cell.textContent = "";
          }
        }
      }
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);

  return gridElement;
}

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = "";
app.appendChild(createGrid());

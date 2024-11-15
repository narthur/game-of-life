import './style.css'

const CELL_SIZE = 20; // px
const TICK_RATE = 200; // ms

type Grid = boolean[][];

function initializeGrid(width: number, height: number): Grid {
  return Array(height).fill(0).map(() => 
    Array(width).fill(false)
  );
}

function countNeighbors(grid: Grid, x: number, y: number): number {
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

function nextGeneration(grid: Grid): Grid {
  const newGrid = grid.map(row => [...row]);
  
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

function createGrid() {
  const width = Math.floor((window.innerWidth - 2) / CELL_SIZE);
  const height = Math.floor((window.innerHeight - 2) / CELL_SIZE);
  
  const gridElement = document.createElement('div');
  gridElement.style.display = 'grid';
  gridElement.style.gridTemplateColumns = `repeat(${width}, ${CELL_SIZE}px)`;
  gridElement.style.gap = '1px';
  
  const gameState = initializeGrid(width, height);
  let isDrawing = false;
  
  document.addEventListener('mousedown', () => isDrawing = true);
  document.addEventListener('mouseup', () => isDrawing = false);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('button');
      cell.style.width = `${CELL_SIZE}px`;
      cell.style.height = `${CELL_SIZE}px`;
      cell.style.padding = '0';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.border = '1px solid rgba(255, 255, 255, 0.05)';
      cell.style.background = 'none';
      cell.style.cursor = 'pointer';
      cell.textContent = '⬜';
      cell.addEventListener('click', () => {
        gameState[y][x] = !gameState[y][x];
        const neighbors = countNeighbors(gameState, x, y);
        cell.textContent = gameState[y][x] ? 
          (neighbors <= 2 ? '🌱' : neighbors <= 4 ? '🌿' : '🌳') : 
          ' ';
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
        }, 3000);
      });
      
      cell.addEventListener('mouseover', () => {
        if (isDrawing && !gameState[y][x]) {
          gameState[y][x] = true;
          const neighbors = countNeighbors(gameState, x, y);
          cell.textContent = neighbors <= 2 ? '🌱' : 
                            neighbors <= 4 ? '🌿' : '🌳';
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
          }, 3000);
        }
      });
      
      gridElement.appendChild(cell);
    }
  }
  
  let isPaused = false;
  
  // Start game loop
  setInterval(() => {
    if (isPaused) return;
    const nextState = nextGeneration(gameState);
    const cells = gridElement.querySelectorAll('button');
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        gameState[y][x] = nextState[y][x];
        const cell = cells[y * width + x] as HTMLButtonElement;
        if (nextState[y][x]) {
          const neighbors = countNeighbors(nextState, x, y);
          cell.textContent = neighbors <= 2 ? '🌱' : 
                            neighbors <= 4 ? '🌿' : '🌳';
        } else {
          cell.textContent = '';
        }
      }
    }
  }, TICK_RATE);
  
  return gridElement;
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = '';
app.appendChild(createGrid());

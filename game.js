const SIZE = 4;
let board = [];
let prevBoard = [];
let gameContainer = document.getElementById("game-container");

function initBoard() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  addTile();
  addTile();
  render();
}

function render() {
  gameContainer.innerHTML = "";
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      const val = board[row][col];
      if (val) {
        tile.textContent = val;
        tile.setAttribute("data-val", val);
      }
      gameContainer.appendChild(tile);
    }
  }
}

function addTile() {
  let empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function cloneBoard(b) {
  return b.map(row => row.slice());
}

function move(dir) {
  prevBoard = cloneBoard(board);
  let changed = false;

  // Correct rotation logic: rotate to left, then back
  for (let i = 0; i < dir; i++) rotate();

  for (let row of board) {
    let arr = row.filter(x => x);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        changed = true;
      }
    }
    arr = arr.filter(x => x);
    while (arr.length < SIZE) arr.push(0);
    row.splice(0, SIZE, ...arr);
  }

  for (let i = 0; i < (4 - dir) % 4; i++) rotate();

  if (JSON.stringify(board) !== JSON.stringify(prevBoard)) {
    changed = true;
    addTile();
  }
  render();
}

function rotate() {
  let newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newBoard[c][SIZE - 1 - r] = board[r][c];
    }
  }
  board = newBoard;
}

function undo() {
  board = cloneBoard(prevBoard);
  render();
}

function resetGame() {
  initBoard();
}

initBoard();

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": move(3); break;    // rotate 3 times before processing (simulate up)
    case "ArrowRight": move(2); break; // rotate 2 times before processing (simulate right)
    case "ArrowDown": move(1); break;  // rotate 1 time before processing (simulate down)
    case "ArrowLeft": move(0); break;  // no rotation needed (simulate left)
  }
});

let touchStartX = 0, touchStartY = 0;
gameContainer.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: false });

gameContainer.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

gameContainer.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absX = Math.abs(dx), absY = Math.abs(dy);
  if (Math.max(absX, absY) > 20) {
    if (absX > absY) move(dx > 0 ? 2 : 0); // right: 2, left: 0
    else move(dy > 0 ? 1 : 3);             // down: 1, up: 3
  }
});

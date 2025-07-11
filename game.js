const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
let score = 0;
let board = [];

// 建立空白棋盤
function initBoard() {
  board = [];
  for (let row = 0; row < 4; row++) {
    board[row] = [];
    for (let col = 0; col < 4; col++) {
      board[row][col] = 0;
    }
  }
}

// 隨機產生 2 或 4
function spawnTile() {
  let empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  let { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// 繪製棋盤
function drawBoard() {
  gameContainer.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = document.createElement("div");
      const val = board[r][c];
      tile.className = "tile tile-" + val;
      tile.textContent = val === 0 ? "" : val;
      gameContainer.appendChild(tile);
    }
  }
  scoreDisplay.textContent = score;
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

// 移動邏輯通用函式
function operate(row) {
  row = row.filter(x => x !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row.filter(x => x !== 0).concat(Array(4 - row.filter(x => x !== 0).length).fill(0));
}

// 各方向移動
function moveLeft() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    let newRow = operate(board[r]);
    if (!arraysEqual(board[r], newRow)) moved = true;
    board[r] = newRow;
  }
  if (moved) {
    spawnTile();
    drawBoard();
  }
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    let reversed = board[r].slice().reverse();
    let newRow = operate(reversed).reverse();
    if (!arraysEqual(board[r], newRow)) moved = true;
    board[r] = newRow;
  }
  if (moved) {
    spawnTile();
    drawBoard();
  }
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    let col = [];
    for (let r = 0; r < 4; r++) col.push(board[r][c]);
    let newCol = operate(col);
    for (let r = 0; r < 4; r++) {
      if (board[r][c] !== newCol[r]) moved = true;
      board[r][c] = newCol[r];
    }
  }
  if (moved) {
    spawnTile();
    drawBoard();
  }
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    let col = [];
    for (let r = 0; r < 4; r++) col.push(board[r][c]);
    let newCol = operate(col.reverse()).reverse();
    for (let r = 0; r < 4; r++) {
      if (board[r][c] !== newCol[r]) moved = true;
      board[r][c] = newCol[r];
    }
  }
  if (moved) {
    spawnTile();
    drawBoard();
  }
}

// 鍵盤控制
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

// 開始遊戲
function startGame() {
  score = 0;
  initBoard();
  spawnTile();
  spawnTile();
  drawBoard();
}

startGame();

const boardSize = 10; // Tamanho do tabuleiro
const bombCount = 5; // Número de bombas

let board = [];

// Inicializa o tabuleiro
function initBoard() {
    for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push({ bomb: false, revealed: false });
        }
        board.push(row);
    }
    // Coloca as bombas aleatoriamente
    for (let i = 0; i < bombCount; i++) {
        let x = Math.floor(Math.random() * boardSize);
        let y = Math.floor(Math.random() * boardSize);
        if (!board[x][y].bomb) {
            board[x][y].bomb = true;
        } else {
            i--;
        }
    }
}
// Atualiza o tabuleiro HTML
function updateBoard() {
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.addEventListener("click", revealCell);
            if (board[i][j].revealed) {
                if (board[i][j].bomb) {
                    cell.textContent = "*"; // Bomba
                } else {
                    let bombsAround = countBombsAround(i, j);
                    cell.textContent = bombsAround > 0 ? bombsAround : ""; // Número de bombas ao redor
                }
            }
            boardElement.appendChild(cell);
        }
        boardElement.appendChild(document.createElement("br"));
    }
}
// Conta o número de bombas ao redor de uma célula
function countBombsAround(x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (x + dx >= 0 && x + dx < boardSize && y + dy >= 0 && y + dy < boardSize) {
                if (board[x + dx][y + dy].bomb) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Revela uma célula
function revealCell(e) {
    let x = parseInt(e.target.dataset.x);
    let y = parseInt(e.target.dataset.y);
    if (!board[x][y].revealed) {
        board[x][y].revealed = true;
        if (!board[x][y].bomb) {
            if (countBombsAround(x, y) === 0) {
                // Se não há bombas ao redor, revela as células vizinhas
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (x + dx >= 0 && x + dx < boardSize && y + dy >= 0 && y + dy < boardSize) {
                            revealCell({ target: { dataset: { x: x + dx, y: y + dy } } });
                        }
                    }
                }
            }
        } else {
            // Se é uma bomba, o jogo acaba
            alert("Você perdeu!");
            initBoard();
            updateBoard();
        }
    }
    updateBoard();
}

// Inicializa o jogo
initBoard();
updateBoard();
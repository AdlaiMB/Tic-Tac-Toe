const gameBoardCells = document.getElementsByClassName("gameboard-cell-img");
const gameBoard = createGameBoard(gameBoardCells);
const params = (new URL(document.location)).searchParams;
const players = ["x-player", "o-player"];
let currentPlayer = params.get("startingPlayer") === "x-player" ? 0 : 1;
let adversary = currentPlayer === 1 ? 0 : 1;
let scores = {
    x: currentPlayer === 0 ? -1 : 1,
    o: currentPlayer === 0 ? 1 : -1,
    tie: 0,
};

// due to the way we wrote the algorithm
// the current player is always the minimizing palyer

function minimax(gameState, isMaximizing) {

    let result = checkWinnerEncrypted(gameState); 

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {

        let bestScore = -Infinity;
        let score;

        for (let row = 0; row < 3; row++) {

            for (let colm = 0; colm < 3; colm++) {

                if (gameState[row][colm] !== null) continue;

                gameState[row][colm] = adversary;
                score = minimax(gameState, false);
                gameState[row][colm] = null; 

                bestScore = Math.max(bestScore, score)
            }

        }

        return bestScore;
    } else {

        let bestScore = Infinity;
        let score;
        
        for (let row = 0; row < 3; row++) {

            for (let colm = 0; colm < 3; colm++) {

                if (gameState[row][colm] !== null) continue; 

                gameState[row][colm] = currentPlayer;
                score = minimax(gameState, true);
                gameState[row][colm] = null;

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}

function nextMove() {

    let score;
    let bestMove;
    let bestScore = -Infinity;
    let gameBoardState = encryptGameBoard(gameBoard);


    for (let row = 0; row < 3; row++) {

        for (let colm = 0; colm < 3; colm++) {

            if (gameBoardState[row][colm] !== null) continue;

            gameBoardState[row][colm] = adversary; // ai making a move
            score = minimax(gameBoardState, false); // player is next
            gameBoardState[row][colm] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = { row, colm };
            }
        }
    }

    if (!bestMove) return;

    gameBoardState[bestMove.row][bestMove.colm] = adversary;
    decryptGameBoard(gameBoardState, gameBoard);

    if (isWinner(gameBoard, players[adversary])) {
        removeEventListeners(gameBoardCells);
    } 
}

function gameBoardLogicAI(gameBoardCells) {

    for (cell of gameBoardCells) {

        let item = cell;

        cell.addEventListener("click", () => {

            if (item.classList.contains("used") || item.classList.contains("gameOver")) return;

            const player = document.createElement("a");
            player.dataset.img = players[currentPlayer];

            item.appendChild(player);
            item.classList.add("used");

            if (isWinner(gameBoard, players[currentPlayer])) {
                removeEventListeners(gameBoardCells);
            }

            nextMove();
        });
    }
};

gameBoardLogicAI(gameBoardCells);
const gameBoardCells = document.getElementsByClassName("gameboard-cell-img");
const gameBoard = createGameBoard(gameBoardCells);
const params = (new URL(document.location)).searchParams;
const adversaryId = params.get("room-id");
const players = ["x-player", "o-player"]
let currentPlayer = null;
let adversary = null;
let isTurn = false;

const socket = io("ws://localhost:8080");

socket.on("connect", () => {
    socket.emit("handshake", adversaryId);
});

socket.on("complete-handshake", (player) => {
    currentPlayer = player;
    adversary = player === 1 ? 0 : 1;
});

socket.on("game-move", (gameState, isNext) => {
    isTurn = isNext;

    decryptGameBoard(gameState, gameBoard);

    if (isWinner(gameBoard, players[adversary])) {
        removeEventListeners(gameBoardCells);
    }
});

function gameBoardLogicMultiplayer(gameBoardCells) {

    for (cell of gameBoardCells) {

        let item = cell;

        cell.addEventListener("click", () => {
            
            if (item.classList.contains("used") || item.classList.contains("gameOver") || adversaryId === null || !isTurn) return;

            const player = document.createElement("a");
            player.dataset.img = players[currentPlayer];

            item.appendChild(player);
            item.classList.add("used");

            // create a gameBoardState of 0's and 1's: This is what we are going to be sending to the other socket 
            const gameState = encryptGameBoard(gameBoard);

            // emit a game-move event
            socket.emit("game-move", adversaryId, gameState, true);
            isTurn = false;

            if (isWinner(gameBoard, players[currentPlayer])) {
                removeEventListeners(gameBoardCells) 
            }
        });
    }
}

gameBoardLogicMultiplayer(gameBoardCells);
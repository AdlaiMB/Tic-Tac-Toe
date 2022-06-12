const gameBoardCells = document.getElementsByClassName("gameboard-cell-img");
const roomIdBtn = document.getElementById("roomId");
const gameBoard = createGameBoard(gameBoardCells);
const params = (new URL(document.location)).searchParams;
const players = ["x-player", "o-player"];
let currentPlayer = params.get("startingPlayer") === "x-player" ? 0 : 1;
let adversary = currentPlayer === 1 ? 0 : 1;
let isTurn = false;

const socket = io("ws://localhost:8080");
let roomId = null;
let adversaryId = null;

socket.on("connect", () => {
    roomId = socket.id;
});

socket.on("handshake", (anotherSocketId) => {
    adversaryId = anotherSocketId;
    isTurn = true;

    socket.emit("complete-handshake", adversaryId, adversary);
});

socket.on("game-move", (gameState, isNext) => {
    isTurn = isNext;

    decryptGameBoard(gameState, gameBoard);

    if (isWinner(gameBoard, players[adversary])) {
        removeEventListeners(gameBoardCells);
    }
});

roomIdBtn.addEventListener("click", () => {
    if (roomId) {
        navigator.clipboard.writeText(roomId);
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
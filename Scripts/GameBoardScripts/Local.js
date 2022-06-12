const gameBoardCells = document.getElementsByClassName("gameboard-cell-img");
const gameBoard = createGameBoard(gameBoardCells);
const params = (new URL(document.location)).searchParams;
const players = ["x-player", "o-player"];
let currentPlayer = params.get("startingPlayer") === "x-player" ? 0 : 1;

function gameBoardLogicLocal(gameBoardCells) {

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

            currentPlayer = currentPlayer === 1 ? 0 : 1;
        });
    }
};

gameBoardLogicLocal(gameBoardCells);



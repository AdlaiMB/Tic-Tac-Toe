function addWinAnimation(list) {
    let order = 1;

    for (let item of list) {
        item.style.cssText = `--order: ${order}`;
        item.classList.add("win-animation");
        order++;
    }
}

function createGameBoard(gameBoardCells) {

    const gameBoard = [];
    let cell = 0;
    let row = [];

    while (cell < gameBoardCells.length) {

        for (let indx = 0; indx < 3; indx++) {
            row[indx] = gameBoardCells[cell + indx];
        }

        gameBoard.push(row);
        cell += 3;
        row = [];
    }

    return gameBoard;
}

function isSelfSame(list, target) {

    for (let item of list) {

        let children = item.childNodes;

        if (children.length <= 1) return false;

        if (children[1].dataset.img !== target) return false;
    }

    addWinAnimation(list);

    return true;
}

function checkRow(row, player) {
    return isSelfSame(row, player);
}

function checkColums(colm, player) {
    return isSelfSame(colm, player);
}

function checkDiagnoal(diagnoal, player) {
    return isSelfSame(diagnoal, player);
}

function isWinner(gameBoard, player) {

    for (let row of gameBoard) {

        if (checkRow(row, player)) {

            return true;
        }
    }

    for (let indx = 0; indx < 3; indx++) {

        let colm = [gameBoard[0][indx], gameBoard[1][indx], gameBoard[2][indx]];

        if (checkColums(colm, player)) {

            return true;
        }

    }

    const mainDiagonal = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
    const secondDiagonal = [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]];

    if (checkDiagnoal(mainDiagonal, player) || checkDiagnoal(secondDiagonal, player)) {

        return true;
    }


    return false;
}

function checkTie(gameState) {

    for (let row = 0; row < 3; row++) {

        for (let colm = 0; colm < 3; colm++) {

            if (gameState[row][colm] === null) return false;
        }
    }

    return true;
}

function isSelfSameEncrypted(list, target) {

    for (let item of list) {

        if (item !== target) return false;
    }

    return true;
}

function checkRowEncrypted(row, player) {
    return isSelfSameEncrypted(row, player);
}

function checkColumsEncrypted(colm, player) {
    return isSelfSameEncrypted(colm, player);
}

function checkDiagnoalEncrypted(diagnoal, player) {
    return isSelfSameEncrypted(diagnoal, player);
}

function isWinnerEncrypted(gameBoard, player) {

    for (let row of gameBoard) {

        if (checkRowEncrypted(row, player)) {
            return true;
        }
    }

    for (let indx = 0; indx < 3; indx++) {

        let colm = [gameBoard[0][indx], gameBoard[1][indx], gameBoard[2][indx]];

        if (checkColumsEncrypted(colm, player)) {

            return true;
        }

    }

    const mainDiagonal = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
    const secondDiagonal = [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]];

    if (checkDiagnoalEncrypted(mainDiagonal, player) || checkDiagnoalEncrypted(secondDiagonal, player)) {

        return true;
    }


    return false;
}

function checkWinnerEncrypted(gameState) {
    // TODO: create a function to check for a winner for binary state 
    if (isWinnerEncrypted(gameState, 0)) return "x";
    if (isWinnerEncrypted(gameState, 1)) return "o";
    if (checkTie(gameState)) return "tie";

    return null;
}

function removeEventListeners(gameBoardCells) {

    for (let cell of gameBoardCells) {
        cell.classList.add("gameOver");
    }
}

function encryptGameBoard(gameBoard) {

    const gameState = [[null, null, null], [null, null, null], [null, null, null]];

    for (let row = 0; row < 3; row++) {

        for (let colm = 0; colm < 3; colm++) {

            cell = gameBoard[row][colm].childNodes;

            if (cell.length <= 1) continue;

            if (cell[1].dataset.img === "x-player") {
                gameState[row][colm] = 0;
            }
            else if (cell[1].dataset.img === "o-player") {
                gameState[row][colm] = 1;
            }
        }
    }

    return gameState;
}

function decryptGameBoard(gameState, gameBoard) {

    for (let row = 0; row < 3; row++) {

        for (let colm = 0; colm < 3; colm++) {

            cell = gameBoard[row][colm];

            if (gameState[row][colm] === null || cell.classList.contains("used")) continue;

            const player = document.createElement("a");
            player.dataset.img = gameState[row][colm] === 0 ? "x-player" : "o-player";

            cell.appendChild(player);
            cell.classList.add("used");
        }
    }
}
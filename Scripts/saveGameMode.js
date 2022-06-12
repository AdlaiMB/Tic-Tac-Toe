const params = (new URL(document.location)).searchParams;
const form = document.getElementById("form");
const gameMode = params.get("gameMode");

if (gameMode === "Multiplayer") {
    form.action = "./GameBoards/Multiplayer/gameBoardMultiplayer.html";
}
else {
    form.action = `./GameBoards/gameBoard${gameMode}.html`;
}
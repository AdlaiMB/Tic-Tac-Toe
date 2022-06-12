const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {origin: "*"}
});

io.on("connection", (socket) => {

    console.log("connected");

    socket.on("handshake", (anotherSocketId) => {
        socket.to(anotherSocketId).emit("handshake", socket.id);
    });

    socket.on("complete-handshake", (anotherSocketId, adversary) => {
       socket.to(anotherSocketId).emit("complete-handshake", adversary);
    });

    socket.on("game-move", (anotherSocketId, gameState, isTurn) => {
        socket.to(anotherSocketId).emit("game-move", gameState, isTurn);
    });

});

server.listen(8080, () => {
    console.log("server is up");
});
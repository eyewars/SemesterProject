"use strict";
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { drawGame} from "./draw.mjs";
import { createUI, gameTemplate, gameOverTemplate } from "./templateManager.mjs";
import { getPlayer, player, gameHasStarted, changeGameState } from "./getInfo.mjs";
import { emitLeaveRoom } from "./socketEmitHandler.mjs";

export let socket;

if (location.hostname == "localhost"){
    socket = io("http://localhost:8080");
}
else {
    socket = io("https://semesterproject-24ul.onrender.com/");
}

export let game = {};

socket.on("connect", () => {
    console.log("Client connected: " + socket.id);
});

socket.on("loadGame", async (data) => {
    game = data;
    if (!gameHasStarted){
        document.querySelector("#queueText").innerText = "Loading...";
    }
    await getPlayer();
    createUI(gameTemplate);
    changeGameState(true);
    requestAnimationFrame(drawGame);
})

socket.on("updateGame", (data) => {
    if (gameHasStarted){
        game = data;
        requestAnimationFrame(drawGame);
    }
})

socket.on("leaveRoom", (room) => {
    emitLeaveRoom(room);
})

socket.on("gameOver", (data) => {
    createUI(gameOverTemplate);
    changeGameState(false);

    if (data == player){
        document.querySelector("#gameOverText").innerText = "You won!";
    } else{
        document.querySelector("#gameOverText").innerText = "You lost...";
    }
})
"use strict";
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { drawGame } from "./draw.mjs";
import { createUI, gameTemplate, startTemplate } from "./templateManager.mjs";
import { getPlayer } from "./getInfo.mjs";
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
    await getPlayer();
    createUI(gameTemplate);
    requestAnimationFrame(drawGame);
})

socket.on("updateGame", (data) => {
    game = data;
    requestAnimationFrame(drawGame);
})

socket.on("leaveRoom", (room) => {
    emitLeaveRoom(room);
    createUI(startTemplate);
})

"use strict";
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { drawGame } from "./draw.mjs";
import { createUI, gameTemplate, startTemplate } from "./templateManager.mjs";
import { getPlayer } from "./getInfo.mjs";

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

socket.on("loadGame", (data) => {
    createUI(gameTemplate);
    game = data;
    getPlayer();
    requestAnimationFrame(drawGame);
    console.log("Nå loada jeg!");
})

socket.on("updateGame", (data) => {
    game = data;
    requestAnimationFrame(drawGame);
})

socket.on("leaveRoom", (room) => {
    socket.emit("leaveRoom", room);
    console.log("Nå leavea jeg!");
    createUI(startTemplate);
})

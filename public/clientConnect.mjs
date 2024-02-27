"use strict";
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { drawGame } from "./draw.mjs";
import { createUI, gameTemplate } from "./templateManager.mjs";

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
    requestAnimationFrame(drawGame);
})

socket.on("updateGame", (data) => {
    game = data;
    requestAnimationFrame(drawGame);
})











/*
socket.addEventListener("open", (event) => {
    console.log("Connected to WS Server!");
})

socket.addEventListener("message", (event) => {
    console.log("Message from server: " + event.data);
})

function sendMessage(){
    socket.send("YOOOOOOOOOOOOOOOO");
}
document.getElementById("testMessageButton").addEventListener("click", sendMessage);
*/
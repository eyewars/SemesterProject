"use strict";
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { drawGame } from "./draw.mjs";
//import { createFriend, createEnemy} from "./draw.mjs";

export const socket = io("http://localhost:8080");
//const socket = new WebSocket("ws://localhost:8080");

export let game = {};

socket.on("connect", () => {
    console.log("Client connected: " + socket.id);
});

const startGameButton = document.getElementById("startGameButton");

startGameButton.addEventListener("click", async () => {
    const requestOptions = {
		method: "POST"
	}

    try {
		let response = await fetch("/game", requestOptions);

		if (response.status != 200) {
			console.log("FEIL I START GAME");
			throw new Error("Error: " + response.status);
		}

		let data = await response.json();
		console.log(data);

        socket.emit("loadGame");
	} catch (error) {
		console.log(error);
	}
})

socket.on("loadGame", (data) => {
    game = data;
    requestAnimationFrame(drawGame);
})

socket.on("updateGame", (data) => {
    game = data;
    requestAnimationFrame(drawGame);
})

socket.on("message", (data) => {
    document.getElementById("testMessage").innerText = data;
})

function sendMessage(){
    socket.emit("message", "YOOOOOOOOOOOOOOOO");
}
document.getElementById("testMessageButton").addEventListener("click", sendMessage);

function sendFriendSocket(){
    socket.emit("friend");
}

function sendEnemySocket(){
    socket.emit("enemy");
}

document.getElementById("spawnFriendButton").addEventListener("click", sendFriendSocket);
document.getElementById("spawnEnemyButton").addEventListener("click", sendEnemySocket);



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
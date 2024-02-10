"use strict";
import "dotenv/config";
import express from "express" 
import USER_API from "./routes/usersRoute.mjs";
import GAME_API from "./routes/gameRoute.mjs";
import { Server } from "socket.io"; 
import {createServer} from "http"; 
import { games } from "./routes/gameRoute.mjs";
//import WebSocket, {WebSocketServer} from "ws"; // HUSK Å UNINSTALLE SENERE HVIS DU ENDER OPP MED Å IKKE BRUKE DET


const server = express();
const superServer = createServer(server);
const io = new Server(superServer);
//const wss = new WebSocketServer({server: superServer});

const port = (process.env.PORT || 8080);
server.set("port", port);

server.use(express.static("public"));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/user", USER_API);

server.use("/game", GAME_API);

server.get("/", (req, res, next) => {
	res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

// Start the server (Bytta til superServer)
superServer.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});

export function emitUpdate(game){
	io.sockets.emit("updateGame", game);
}

io.on("connection", (socket) =>{
	console.log("User connected: " + socket.id);

	socket.on("message", (data) => {
		socket.broadcast.emit("message", data);
	})

	socket.on("friend", () => {
		if (games.length > 0){
			games[0].createFriend();

			io.sockets.emit("updateGame", games[0]);
		}
	})

	socket.on("enemy", () => {
		if (games.length > 0){
			games[0].createEnemy();

			io.sockets.emit("updateGame", games[0]);
		}
	})

	socket.on("loadGame", () => {
		if (games.length > 0){
			io.sockets.emit("loadGame", games[0]);
		}
	})
	
	

	/*ws.send("Welcome new client!");

	ws.on("message", (data, isBinary) => {
		console.log("The message is: " + data);
		
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
			  client.send(data, { binary: isBinary });
			}
		});
	})

	ws.on("close", () => {
		console.log("User disconnected!");
	})*/
})
"use strict";
import express from "express" 
import USER_API from "./routes/usersRoute.mjs";
import { Server } from "socket.io"; 
import {createServer} from "http"; 
import myGame from "./modules/game.mjs";
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
		myGame.createFriend();

		io.sockets.emit("updateGame", myGame);
	})

	socket.on("enemy", () => {
		myGame.createEnemy();

		io.sockets.emit("updateGame", myGame);
	})

	socket.on("onLoad", () => {
		socket.emit("onLoad", myGame);
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
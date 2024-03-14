"use strict";
import "dotenv/config";
import express from "express" 
import USER_API from "./routes/usersRoute.mjs";
import GAME_API from "./routes/gameRoute.mjs";
import { Server } from "socket.io"; 
import {createServer} from "http"; 
import { startIo } from "./modules/socket.mjs";

const server = express();
const superServer = createServer(server);
export const io = new Server(superServer);

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

startIo();

/*

TODO:

1. Fjern unødvendig kode, kommentarer, og logs (på både client og server) (DETTE INKLUDERER ROUTES SOM BLE BRUKT FOR TESTING OG IKKE LENGER BRUKES)
2. Add basic offline greier (han hadde en repo om det på github)

*/
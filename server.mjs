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

1. Fjern unødvendig kode, kommentarer, og logs (på både client og server)
2. Øk lengden tokenen varer (er lav for testing nå)
3. Lag bedre UI, gjør det mulig å navigere seg rundt bedre
4. Gjør sånn at email og username må være unike (tror ikke det er sånn lenger etter jeg kobla opp mot database)
5. Jobb videre på selve spillet
6. Gjør sånn at man kan komme inn i spillet igjen hvis man allerede var med i et (si browseren crasha eller du refresha med et uhell eller noe)
7. Fiks det greiene med at canvasen ikke loader i riktig rekkefølge så du får masse errors i sånn 2 frames
8. Det er en bug som gjør at unitsa stopper å bevege seg av og til (til du sender en enemy for å fikse ting), tror kanskje det er har noe med at hvilke tiles som er opptatt blir fucka på en eller anna må
9. Gjør sånn at vinnere vet hvem som vant ordentlig (vis det og ikke bare insta hopp til menyen, og  lagre i databasen hvor mange spill du har spillt, og hvor mange du har vunnet/tapt)

*/
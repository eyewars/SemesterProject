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
2. Øk lengden tokenen varer (er lav for testing nå)
4. Gjør sånn at når man trykker på start game kommer man til en ny skjerm, der må det være en knapp for å trekke seg ut hvis man ikke vil spille alikavel (så går man tilbake til den forrige plassen). Du burde også bli hevet ut av queuen hvis det var så og så lenge siden du trykka play. 
5. Gjør sånn at når spillet finner en match så må begge spillere trykke accept (man har si 15 sek på seg), hvis ikke så blir spillet aborta
6. Add basic offline greier (han hadde en repo om det på github)
7. Kanskje lag flere mapper for å sortere litt




LISTE OVER TING SOM BURDE ADDES TIL SPILLET:

1. Mye av teksten tar veldig lang tid før den loader når du er på nettsiden, sikkert fordi det tar ekstra lang tid å sende data fra server til klient (så du får bare masse errors om at verdiene ikke fins før det) TROR IKKE OM DET ER NOE DU KAN GJØRE SÅ MYE MED
2. Fiks den buggen som gjør at unitsa noen ganger bare stopper (til det kommer en enemy og de fighter) (virker som om det alltid er samme plass også) (har ikke fått buggen på en stund nå så vet ikke om det har randomly blitt fiksa eller ei av noen avde andre endringene jeg gjorde)
3. Gjør sånn at vinnere vet hvem som vant ordentlig (vis det og ikke bare insta hopp til menyen)
4. Fiks det greiene med at canvasen ikke loader i riktig rekkefølge så du får masse errors i sånn 2 frames
5. Er en bug som gjør at games bare av og til ikke starter (tror kanskje det skjer når du akkurat lager en ny bruker og logger inn uten å refreshe men idk, finn ut av det)

*/
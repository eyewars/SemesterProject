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
5. Prøv å adde "Bearer" inni authorization
6. Kanskje add sånn at du må skrive passordet ditt 2 ganger
7. Kanskje gjør sånn at du får en ny valid token hver gang du gjør noe shit hvor du bruker en token, da vil du aldri møte på problemet at du er logga inn og så plutselig forsvinner tokenen din mens du holder på med noe og alt klikker
8. Add en limit til brukernavn lengde (sånn at det passer i spillet, kanskje 12 tegn)
9. Gjør sånn at når man trykker på start game kommer man til en ny skjerm, der må det være en knapp for å trekke seg ut hvis man ikke vil spille alikavel (så går man tilbake til den forrige plassen). Du burde også bli hevet ut av queuen hvis det var så og så lenge siden du trykka play. 
10. Gjør sånn at når spillet finner en match så må begge spillere trykke accept (man har si 15 sek på seg), hvis ikke så blir spillet aborta
11. Gjør sånn at det kommer noe opp når du skriver feil passord og sånn



LISTE OVER TING SOM BURDE ADDES TIL SPILLET:

1. Mye av teksten tar veldig lang tid før den loader når du er på nettsiden, sikkert fordi det tar ekstra lang tid å sende data fra server til klient (så du får bare masse errors om at verdiene ikke fins før det)
2. Fiks den buggen som gjør at unitsa noen ganger bare stopper (til det kommer en enemy og de fighter) (virker som om det alltid er samme plass også)
3. Gjør sånn at vinnere vet hvem som vant ordentlig (vis det og ikke bare insta hopp til menyen, og  lagre i databasen hvor mange spill du har spillt, og hvor mange du har vunnet/tapt)
4. Fiks det greiene med at canvasen ikke loader i riktig rekkefølge så du får masse errors i sånn 2 frames

*/
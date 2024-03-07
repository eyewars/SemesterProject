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
10. Når du sletter brukeren så slett token fra localstorage
11. Prøv å adde "Bearer" inni authorization
12. Kanskje add sånn at du må skrive passordet ditt 2 ganger
13. Kanskje gjør sånn at du får en ny valid token hver gang du gjør noe shit hvor du bruker en token, da vil du aldri møte på problemet at du er logga inn og så plutselig forsvinner tokenen din mens du holder på med noe og alt klikker
14. Add en limit til brukernavn lengde (sånn at det passer i spillet, kanskje 12 tegn)



LISTE OVER TING SOM BURDE ADDES TIL SPILLET:

1. Fiks en bug som gjør at "enemy" units vinner equal fights (de hitter sikkert først eller noe)
2. Bytt på fargene til enemies så man kan kjenne de igjen (og add en stroke rundt de basert på om de er friend eller enemy) (kanskje fargen på den "loading" baren på knappene burde være basert på unit fargen)
3. Gjør sånn at du ikke kan kjøpe de 2 siste ved mindre du har mer income enn du mister (sånn at du aldri blir perma fucka)

*/
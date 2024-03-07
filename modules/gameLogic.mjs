"use strict";
import { emitUpdate, leaveRoom } from "./socket.mjs";
import { games, gameLookup, ongoingGamesLookup } from "../routes/gameRoute.mjs";

// Kanskje send disse verdiene ned til klienten og sett canvas størrelsen til det den får, så vil disse variablene bestemme det alltid istedenfor at du må oppdatere hvis du endrer
export const canvasWidth = 1600;
export const canvasHeight = 600;

let lastUpdate = Date.now();

//Hvis det skal være sånn at du ikke sletter gamesa etter de er ferdige, så vil dette veldig fort blir klikke, siden den looper gjennom alle games
function update(){
    const diff = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now();

    Object.keys(ongoingGamesLookup).forEach((key) => {
        games[key].timerManager(diff);
        games[key].move();
        games[key].fight();

        const winner = games[key].gameHasEnded();

        emitUpdate(games[key], "game" + key);

        if (winner != false){
            console.log(winner + " WON THE GAME!!!");

            leaveRoom("game" + key);

            console.log(ongoingGamesLookup);

            delete gameLookup[games[key].player1Id];
            delete gameLookup[games[key].player2Id];
            delete ongoingGamesLookup[key];
            
            console.log(ongoingGamesLookup);
        }
    })
}

setInterval(update, 10);
"use strict";
import { emitUpdate } from "../server.mjs";
import { games } from "../routes/gameRoute.mjs";

// Kanskje send disse verdiene ned til klienten og sett canvas størrelsen til det den får, så vil disse variablene bestemme det alltid istedenfor at du må oppdatere hvis du endrer
export const canvasWidth = 1600;
export const canvasHeight = 600;

let lastUpdate = Date.now();

function update(){
    const diff = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now(); 

    for (let i = 0; i < games.length; i++){
        games[i].move(diff);
    }
   
    if (games.length > 0){
        emitUpdate(games[0]);
    }
}

setInterval(update, 10);
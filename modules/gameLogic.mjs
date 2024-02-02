"use strict";
import myGame from "./game.mjs";
import { emitUpdate } from "../server.mjs";

// Kanskje send disse verdiene ned til klienten og sett canvas størrelsen til det den får, så vil disse variablene bestemme det alltid istedenfor at du må oppdatere hvis du endrer
export const canvasWidth = 1600;
export const canvasHeight = 600;

let lastUpdate = Date.now();

function update(){
    const diff = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now(); 

    myGame.move(diff);
   
    emitUpdate(myGame);
}

setInterval(update, 10);
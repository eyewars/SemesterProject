"use strict";
import { emitUpdate, leaveRoom, emitGameOver } from "../socket.mjs";
import { games, gameLookup, ongoingGamesLookup } from "../../routes/gameRoute.mjs";
import DBManager from "../storageManager.mjs"

// Kanskje send disse verdiene ned til klienten og sett canvas størrelsen til det den får, så vil disse variablene bestemme det alltid istedenfor at du må oppdatere hvis du endrer
export const canvasWidth = 1600;
export const canvasHeight = 600;

let lastUpdate = Date.now();

//Hvis det skal være sånn at du ikke sletter gamesa etter de er ferdige, så vil dette veldig fort blir klikke, siden den looper gjennom alle games
function update(){
    const diff = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now();

    Object.keys(ongoingGamesLookup).forEach(async (key) => {
        games[key].timerManager(diff);
        games[key].move();
        games[key].fight();

        const winner = games[key].gameHasEnded();

        emitUpdate(games[key], "game" + key);

        if (winner != false){
            console.log(winner + " WON THE GAME!!!");

            emitGameOver(winner, "game" + key)

            leaveRoom("game" + key);

            updateGames(key, winner);

            console.log(ongoingGamesLookup);

            delete gameLookup[games[key].player1Id];
            delete gameLookup[games[key].player2Id];
            delete ongoingGamesLookup[key];
            
            console.log(ongoingGamesLookup);
        }
    })
}

setInterval(update, 10);

async function updateGames(gameId, winner){
    const player1 = await DBManager.getUser(games[gameId].player1Id);
    const player2 = await DBManager.getUser(games[gameId].player2Id);

    player1.games++;
    player2.games++;

    if (winner == "friend"){
        player1.wins++;
        player2.losses++;
    }
    else{
        player1.losses++;
        player2.wins++;
    }

    await DBManager.updateGames(player1);
    await DBManager.updateGames(player2);
}
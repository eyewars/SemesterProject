"use strict";
import { emitUpdate, leaveRoom, emitGameOver } from "../socket.mjs";
import { games, gameLookup, ongoingGamesLookup } from "../../routes/gameRoute.mjs";
import DBManager from "../storageManager.mjs"

export const canvasWidth = 1600;
export const canvasHeight = 600;

let lastUpdate = Date.now();

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
            emitGameOver(winner, "game" + key)

            leaveRoom("game" + key);

            updateGames(key, winner);

            delete gameLookup[games[key].player1Id];
            delete gameLookup[games[key].player2Id];
            delete ongoingGamesLookup[key];
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
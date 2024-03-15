"use strict";
import { io } from "../server.mjs";
import { games, gameLookup } from "../routes/gameRoute.mjs";

export function startIo(){
    io.on("connection", (socket) =>{
        console.log("User connected: " + socket.id);

        socket.on("summon", (data) => {
            const gameIndex = gameLookup[data.playerId];

            games[gameIndex].summonUnit(data.playerId, data.unitId);

            emitUpdate(games[gameIndex], "game" + gameIndex);
        })

        socket.on("loadGame", (playerId) => {
            const gameIndex = gameLookup[playerId];

            if (gameIndex == undefined){
                socket.join("game" + games.length);
            }
            else{
                socket.join("game" + gameIndex);

                io.to("game" + gameIndex).emit("loadGame", games[gameIndex]);
            }
        })

        socket.on("leaveRoom", (room) => {
            socket.leave(room);
        })
    })
}

export function emitUpdate(game, room){
	io.to(room).emit("updateGame", game);
}

export function leaveRoom(room){
    io.to(room).emit("leaveRoom", room);
}

export function emitGameOver(winner, room){
    io.to(room).emit("gameOver", winner);
}
"use strict";
import { socket } from "./clientConnect.mjs";

export function emitLoadGame(id){
    socket.emit("loadGame", id);
}

export function emitSummon(playerAndUnitIdObject){
    socket.emit("summon", playerAndUnitIdObject);
}

export function emitLeaveRoom(room){
    socket.emit("leaveRoom", room);
}
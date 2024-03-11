"use strict";
import { sendRequest } from "./fetchHandler.mjs";
import { getToken } from "./localStorageHandler.mjs";

export let player = "";
export let playerId;
export let playerName;
export let enemyName;

export async function getPlayer(){
    const token = getToken();

    const data = await sendRequest("/game/getPlayer", "GET", undefined, token);

    if (data != undefined){
        player = data.player;
        playerId = data.id;
        playerName = data.myName;
        enemyName = data.enemyName;
    }
}
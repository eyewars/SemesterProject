"use strict";

export let player = "";
export let playerId;
export let playerName;
export let enemyName;

export async function getPlayer(){
    const token = localStorage.getItem("token");

    const requestOptions = {
        method: "GET",
        headers: {
            authorization: token,
        }
    }

    try {
        let response = await fetch("/game/getPlayer", requestOptions);

        if (response.status != 200) {
            throw new Error("Error: " + response.status);
        }

        let data = await response.json();

        player = data.player;
        playerId = data.id;
        playerName = data.myName;
        enemyName = data.enemyName;
    } catch (error) {
        console.error(error);
    }
}
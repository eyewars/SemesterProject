"use strict";
import { game } from "./clientConnect.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export function drawGame(){
    ctx.clearRect(0, 0, 1600, 600);

    ctx.fillStyle = "green";
    for (let i = 0; i < game.friends.length; i++){
        ctx.fillRect(game.friends[i].xPos, game.friends[i].yPos, game.friends[i].width, game.friends[i].height);
    }

    ctx.fillStyle = "purple";
    for (let i = 0; i < game.enemies.length; i++){
        ctx.fillRect(game.enemies[i].xPos, game.enemies[i].yPos, game.enemies[i].width, game.enemies[i].height);
    }

    ctx.fillStyle = "blue";
    ctx.fillRect(game.friendCastle.xPos, game.friendCastle.yPos, game.friendCastle.width, game.friendCastle.height);

    ctx.fillStyle = "red";
    ctx.fillRect(game.enemyCastle.xPos, game.enemyCastle.yPos, game.enemyCastle.width, game.enemyCastle.height);
}
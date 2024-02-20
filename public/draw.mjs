"use strict";
import { game } from "./clientConnect.mjs";

let canvas;
let ctx;

export function setCanvas(cvs){
    canvas = cvs;
    ctx = canvas.getContext("2d");
}

export function drawGame(){
    ctx.clearRect(0, 0, 1600, 600);

    for (let i = 0; i < game.friends.length; i++){
        ctx.fillStyle = game.friends[i].color;
        ctx.fillRect(game.friends[i].myCell * 40, game.friends[i].yPos, game.friends[i].width, game.friends[i].height);
    }

    for (let i = 0; i < game.enemies.length; i++){
        ctx.fillStyle = game.enemies[i].color;
        ctx.fillRect(game.enemies[i].myCell * 40, game.enemies[i].yPos, game.enemies[i].width, game.enemies[i].height);
    }

    ctx.fillStyle = "blue";
    ctx.fillRect(game.friendCastle.xPos, game.friendCastle.yPos, game.friendCastle.width, game.friendCastle.height);

    ctx.fillStyle = "red";
    ctx.fillRect(game.enemyCastle.xPos, game.enemyCastle.yPos, game.enemyCastle.width, game.enemyCastle.height);
}
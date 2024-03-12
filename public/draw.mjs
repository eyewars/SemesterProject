"use strict";
import { game } from "./clientConnect.mjs";
import { player, playerId, playerName, enemyName } from "./getInfo.mjs";
import { emitSummon } from "./socketEmitHandler.mjs";

let lastUpdate = Date.now();

let canvas;
let ctx;

const summonButtons = [];

export function setCanvas(cvs){
    canvas = cvs;
    ctx = canvas.getContext("2d");

    canvas.addEventListener("click", (event) => {
        const mousePos = getMousePosition(event);

        summonButtons.forEach(button => {
            if ((mousePos.x >= button.x) && (mousePos.x <= (button.x + button.width))){
                if ((mousePos.y >= button.y) && (mousePos.y <= (button.y + button.height))){
                    button.summonUnit();
                }
            }
        });
    })
}

export function drawGame(){
    //CTX ER UNDEFINED I SÅNN EN FRAME, JEG TROR DRAWGAME SKJER FØR SETCANVAS
    ctx.clearRect(0, 0, 1600, 600);

    ctx.lineWidth = 2;

    for (let i = 0; i < game.friends.length; i++){
        ctx.fillStyle = game.friends[i].color;
        ctx.fillRect(game.friends[i].myCell * 40, game.friends[i].yPos, game.friends[i].width, game.friends[i].height);

        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.rect(game.friends[i].myCell * 40, game.friends[i].yPos, game.friends[i].width, game.friends[i].height);
        ctx.stroke();
    }

    for (let i = 0; i < game.enemies.length; i++){
        ctx.fillStyle = game.enemies[i].color;
        ctx.fillRect(game.enemies[i].myCell * 40, game.enemies[i].yPos, game.enemies[i].width, game.enemies[i].height);

        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(game.enemies[i].myCell * 40, game.enemies[i].yPos, game.enemies[i].width, game.enemies[i].height);
        ctx.stroke();
    }

    ctx.fillStyle = "blue";
    ctx.fillRect(game.friendCastle.xPos, game.friendCastle.yPos, game.friendCastle.width, game.friendCastle.height);

    ctx.fillStyle = "red";
    ctx.fillRect(game.enemyCastle.xPos, game.enemyCastle.yPos, game.enemyCastle.width, game.enemyCastle.height);

    const incomeBarWidth = (game.incomeTimer / 10000) * 250;
    ctx.fillStyle = "green";
    ctx.fillRect(10, 50, incomeBarWidth, 50);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.rect(10, 50, 250, 50);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    ctx.fillText(game[player + "Gold"].toFixed(1), 135, 38);

    ctx.font = "20px Arial";
    ctx.fillText("+" + game[player + "Income"].toFixed(1), 135, 83);

    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText(game.friendCastle.health, 60, 430);
    ctx.fillText(game.enemyCastle.health, 1540, 430);

    ctx.font = "20px Arial";
    ctx.fillText(playerName, 60, 380);
    ctx.fillText(enemyName, 1540, 380);

    ctx.strokeStyle = "black";

    for (let i = 0; i < summonButtons.length; i++){
        ctx.fillStyle = game.unitColor[i];
        ctx.fillRect(summonButtons[i].x, summonButtons[i].y + summonButtons[i].height, summonButtons[i].width, -summonButtons[i].height * (summonButtons[i].timer / summonButtons[i].maxTimer));

        ctx.beginPath();
        ctx.rect(summonButtons[i].x, summonButtons[i].y, summonButtons[i].width, summonButtons[i].height);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(game.unitCost[i], summonButtons[i].x + 45, summonButtons[i].y + 30);
        ctx.font = "20px Arial";
        if (i < 7){
            ctx.fillText("+" + game.unitIncomeChange[i], summonButtons[i].x + 45, summonButtons[i].y + 60);
        }
        else {
            ctx.fillText(game.unitIncomeChange[i], summonButtons[i].x + 45, summonButtons[i].y + 60);
        }
        ctx.fillText(game.unitSpeed[i], summonButtons[i].x + 45, summonButtons[i].y + 85);
    }
}

function getMousePosition(event){
    const rect = event.target.getBoundingClientRect();
    const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    } 

    return mousePos;
}

const buttonMaxTimer = [500, 750, 500, 2000, 12000, 2500, 1000, 7500, 30000, 60000];
for (let i = 0; i < 10; i++){
    const button = {
        width: 90,
        height: 90,
        x: 350 + 120 * i,
        y: 10,
        timer: 0,
        maxTimer: buttonMaxTimer[i],
        summonUnit(){
            if (this.timer == 0){
                emitSummon({playerId: playerId, unitId: i});
                this.timer = this.maxTimer;
            }
        }
    }

    summonButtons.push(button);
}

function buttonTimers(){
    const diff = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now();

    summonButtons.forEach(button => {
        if (button.timer > 0){
            button.timer -= 1000 * diff;
        }

        if (button.timer < 0){
            button.timer = 0;
        }
    });
}

setInterval(buttonTimers, 10);
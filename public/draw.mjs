"use strict";
import Creature from "./creature.mjs";
import Castle from "./castle.mjs";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

let lastUpdate = Date.now();

const friends = [];
const enemies = [];

const friendCastle = new Castle("friend");
const enemyCastle = new Castle("enemy");

function createFriend(){
    friends.push(new Creature("friend"));
}

function createEnemy(){
    enemies.push(new Creature("enemy"));
}

document.getElementById("spawnFriendButton").addEventListener("click", createFriend);
document.getElementById("spawnEnemyButton").addEventListener("click", createEnemy);

function drawGame(){
    ctx.clearRect(0, 0, 1600, 600);
    const diff = (Date.now() - lastUpdate) / 1000;
	lastUpdate = Date.now(); 
    
    const toDeleteFriend = [];
    for (let i = 0; i < friends.length; i++){
        friends[i].move(diff);

        if (friends[i].xPos >= canvas.length){
            toDeleteFriend.push(i);
            continue;
        }

        friends[i].draw();
    }

    toDeleteFriend.sort((a, b) => a - b);
    for (let i = 0; i < toDeleteFriend.length; i++){
        friends.splice(toDeleteFriend[i], 1);

        toDeleteFriend.forEach((element, index) => {
            toDeleteFriend[index] = element - 1;
        });
    }

    const toDeleteEnemy = [];
    for (let i = 0; i < enemies.length; i++){
        enemies[i].move(diff);

        if (enemies[i].xPos <= 0){
            toDeleteEnemy.push(i);
            continue;
        }

        enemies[i].draw();
    }

    toDeleteEnemy.sort((a, b) => a - b);
    for (let i = 0; i < toDeleteEnemy.length; i++){
        enemies.splice(toDeleteEnemy[i], 1);

        toDeleteEnemy.forEach((element, index) => {
            toDeleteEnemy[index] = element - 1;
        });
    }

    friendCastle.draw();

    enemyCastle.draw();

    requestAnimationFrame(drawGame);
}
requestAnimationFrame(drawGame);
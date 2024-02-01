"use strict";
import myGame from "./game.mjs";
import { emitUpdate } from "../server.mjs";

export const canvasWidth = 1600;
export const canvasHeight = 600;

let lastUpdate = Date.now();

function update(){
    const diff = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now(); 

    const toDeleteFriend = [];
    for (let i = 0; i < myGame.friends.length; i++){
        let enemyCollision = false;
        for (let j = 0; j < myGame.enemies.length; j++){
            enemyCollision = isColliding(myGame.friends[i], myGame.enemies[j]);
            if (enemyCollision){
                break;
            }
        }

        let friendCollision = false;
        for (let j = 0; j < myGame.friends.length; j++){
            if (i == j) continue;
            friendCollision = isColliding(myGame.friends[i], myGame.friends[j]);
            if (friendCollision){
                break;
            }
        }

        if (!enemyCollision){
            myGame.friends[i].move(diff);
        }
        
        if (myGame.friends[i].xPos >= canvasWidth){
            toDeleteFriend.push(i);
        }
    }

    toDeleteFriend.sort((a, b) => a - b);
    for (let i = 0; i < toDeleteFriend.length; i++){
        myGame.friends.splice(toDeleteFriend[i], 1);

        toDeleteFriend.forEach((element, index) => {
            toDeleteFriend[index] = element - 1;
        });
    }

    const toDeleteEnemy = [];
    for (let i = 0; i < myGame.enemies.length; i++){
        let collision = false;
        for (let j = 0; j < myGame.friends.length; j++){
            collision = isColliding(myGame.enemies[i], myGame.friends[j]);
            if (collision){
                break;
            }
        }

        if (!collision){
            myGame.enemies[i].move(diff);
        }

        if (myGame.enemies[i].xPos <= 0){
            toDeleteEnemy.push(i);
        }
    }

    toDeleteEnemy.sort((a, b) => a - b);
    for (let i = 0; i < toDeleteEnemy.length; i++){
        myGame.enemies.splice(toDeleteEnemy[i], 1);

        toDeleteEnemy.forEach((element, index) => {
            toDeleteEnemy[index] = element - 1;
        });
    }

    emitUpdate(myGame);
}

// FIKS DET SHITTET
function isColliding(self, unit){
    if (self.type == "friend"){
        if (((self.xPos + self.width) >= unit.xPos) && (self.xPos <= (unit.xPos + unit.width))){
            if (unit.type == "enemy"){
                self.xPos = unit.xPos - self.width; 
            }
            else {
                unit.xPos = self.xPos - unit.width;
            }

            return true;
        }
        return false;
    }
    else{
        if ((self.xPos <= (unit.xPos + unit.width)) && ((self.xPos + self.width) >= unit.xPos)){
            self.xPos = unit.xPos + unit.width; 
            return true;
        }
        return false;
    }
}

setInterval(update, 10);
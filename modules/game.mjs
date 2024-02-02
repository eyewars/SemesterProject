"use strict";
import Creature from "./creature.mjs";
import Castle from "./castle.mjs";
import { canvasWidth } from "./gameLogic.mjs";

class Game{
    constructor(){
        this.friends = [];
        this.enemies = [];

        this.cells = [];

        for (let i = 0; i < (canvasWidth / 40); i++){
            this.cells[i] = {occupied: false, unit: undefined};
        }

        this.friendCastle = new Castle("friend");
        this.enemyCastle = new Castle("enemy");

        this.slowTimer = 0;
        this.mediumTimer = 0;
        this.fastTimer = 0;

        this.slowTimerReached = false;
        this.mediumTimerReached = false;
        this.fastTimerReached = false;
    } 

    createFriend(){
        this.friends.push(new Creature("friend"));
    }
    
    createEnemy(){
        this.enemies.push(new Creature("enemy"));
    }

    timerManager(diff){
        this.slowTimer += 1000 * diff;
        this.mediumTimer += 1000 * diff;
        this.fastTimer += 1000 * diff;

        this.slowTimerReached = false;
        this.mediumTimerReached = false;
        this.fastTimerReached = false;

        if (this.slowTimer >= 1000){
            this.slowTimerReached = true;
            this.slowTimer -= 1000;
        }

        if (this.mediumTimer >= 500){
            this.mediumTimerReached = true;
            this.mediumTimer -= 500;
        }

        if (this.fastTimer >= 250){
            this.fastTimerReached = true;
            this.fastTimer -= 250;
        }
    }

    move(diff){
        this.timerManager(diff);

        let friendReachedEnd = false;
        this.friends.forEach((friend) => {
            if (this[friend.speedType + "TimerReached"]){
                if (friend.myCell == 36){
                    friendReachedEnd = true;

                    this.cells[friend.myCell].occupied = false;
                    this.cells[friend.myCell].unit = undefined;

                    this.enemyCastle.takeDamage(1);

                    console.log("Enemy Castle Health: " + this.enemyCastle.health);
                }
                else if (!this.cells[friend.myCell + 1].occupied){

                    this.cells[friend.myCell].occupied = false;
                    this.cells[friend.myCell].unit = undefined;

                    friend.myCell++;

                    this.cells[friend.myCell].occupied = true;
                    this.cells[friend.myCell].unit = friend;
                } 
            }
        })

        if (friendReachedEnd){
            this.friends.splice(0, 1);
        }

        let enemyReachedEnd = false;
        this.enemies.forEach((enemy) => {
            if (this[enemy.speedType + "TimerReached"]){
                if (enemy.myCell == 3){
                    enemyReachedEnd = true;

                    this.cells[enemy.myCell].occupied = false;
                    this.cells[enemy.myCell].unit = undefined;

                    this.friendCastle.takeDamage(1);

                    console.log("Friend Castle Health: " + this.friendCastle.health);
                }
                else if (!this.cells[enemy.myCell - 1].occupied){

                    this.cells[enemy.myCell].occupied = false;
                    this.cells[enemy.myCell].unit = undefined;

                    enemy.myCell--;

                    this.cells[enemy.myCell].occupied = true;
                    this.cells[enemy.myCell].unit = enemy;
                } 
            }
        })

        if (enemyReachedEnd){
            this.enemies.splice(0, 1);
        }
    }
}

const myGame = new Game();

export default myGame;
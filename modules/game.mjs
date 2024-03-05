"use strict";
import Creature from "./creature.mjs";
import Castle from "./castle.mjs";
import { canvasWidth } from "./gameLogic.mjs";

class Game{
    constructor(player1Id, player2Id){
        this.player1Id = player1Id;
        this.player2Id = player2Id;

        this.friends = [];
        this.enemies = [];

        this.unitsThatWillAttack = [];

        this.cells = [];

        // Endre til bare hvilken unit som er der / undefined. Occupied er ikke nødvendig. Hvis den undefined så er det ingen der, ellers er det noen der.
        for (let i = 0; i < (canvasWidth / 40); i++){
            this.cells[i] = undefined;
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

    summonUnit(playerId){
        if (playerId == this.player1Id){
            this.friends.push(new Creature("friend"));
        }
        else {
            this.enemies.push(new Creature("enemy"));
        }
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

    move(){
        let friendReachedEnd = false;
        this.friends.forEach((friend) => {
            if (this[friend.speedType + "TimerReached"]){
                if (friend.myCell == 36){
                    friendReachedEnd = true;

                    this.cells[friend.myCell] = undefined;

                    this.enemyCastle.takeDamage(1);

                    //console.log("Enemy Castle Health: " + this.enemyCastle.health);
                }
                else if (this.cells[friend.myCell + 1] == undefined){

                    this.cells[friend.myCell] = undefined;

                    friend.myCell++;

                    this.cells[friend.myCell] = friend;
                }

                if (this.#shouldFight(friend)){
                    this.unitsThatWillAttack.push({attacker: friend, target: this.cells[friend.myCell + 1]});
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

                    this.cells[enemy.myCell] = undefined;

                    this.friendCastle.takeDamage(1);

                    //console.log("Friend Castle Health: " + this.friendCastle.health);
                }
                else if (this.cells[enemy.myCell - 1] == undefined){

                    this.cells[enemy.myCell] = undefined;

                    enemy.myCell--;

                    this.cells[enemy.myCell] = enemy;
                } 

                if (this.#shouldFight(enemy)){
                    this.unitsThatWillAttack.push({attacker: enemy, target: this.cells[enemy.myCell - 1]});
                }
            }
        })

        if (enemyReachedEnd){
            this.enemies.splice(0, 1);
        }
    }

    #shouldFight(unit){
        if (unit.type == "friend"){
            const nextCell = this.cells[unit.myCell + 1];
            if ((nextCell != undefined) && (nextCell.type == "enemy")){
                return true;
            }
            return false;
        }
        else{
            const nextCell = this.cells[unit.myCell - 1];
            if ((nextCell != undefined) && (nextCell.type == "friend")){
                return true;
            }
            return false;
        }
    }

    fight(){
        const friendsThatDied = [];
        const enemiesThatDied = [];

        this.unitsThatWillAttack.forEach((fight) => {
            fight.target.takeDamage(fight.attacker.damage);

            if (fight.target.health <= 0){
                if (fight.target.type == "friend"){
                    friendsThatDied.push(fight.target);
                }
                else {
                    enemiesThatDied.push(fight.target);
                }
            }
        })

        friendsThatDied.forEach((friend) => {
            const index = this.friends.indexOf(friend);

            this.cells[friend.myCell] = undefined;

            this.friends.splice(index, 1);
        })

        enemiesThatDied.forEach((enemy) => {
            const index = this.enemies.indexOf(enemy);

            this.cells[enemy.myCell] = undefined;

            this.enemies.splice(index, 1);
        })

        this.unitsThatWillAttack = [];
    }

    gameHasEnded(){
        if (this.friendCastle.health <= 0){
            return "enemy";
        }
        else if (this.enemyCastle.health <= 0){
            return "friend";
        }
        return false;
    }
}

export default Game;
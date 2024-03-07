"use strict";
import Creature from "./creature.mjs";
import Castle from "./castle.mjs";
import { canvasWidth } from "./gameLogic.mjs";

class Game{
    constructor(player1Id, player2Id){
        this.player1Id = player1Id;
        this.player2Id = player2Id;

        this.player1Gold = 0;
        this.player2Gold = 0;

        this.player1Income = 10;
        this.player2Income = 10;

        this.unitCost = [15, 20, 20, 50, 50, 30, 150, 200, 500, 1000];
        this.unitIncomeChange = [1, 1.3, 0.8, 0.2, 3.3, 0.1, 5, 0, -15, -50];
        this.unitSpeed = ["slow", "medium", "fast", "medium", "slow", "fast", "medium", "slow", "medium", "fast"];

        this.friends = [];
        this.enemies = [];

        this.unitsThatWillAttack = [];

        this.cells = [];

        for (let i = 0; i < (canvasWidth / 40); i++){
            this.cells[i] = undefined;
        }

        this.friendCastle = new Castle("friend");
        this.enemyCastle = new Castle("enemy");

        this.slowTimer = 0;
        this.mediumTimer = 0;
        this.fastTimer = 0;

        this.incomeTimer = 0;

        this.slowTimerReached = false;
        this.mediumTimerReached = false;
        this.fastTimerReached = false;
    } 

    #getIncome(){
        this.player1Gold += this.player1Income;
        this.player2Gold += this.player2Income;
    }

    summonUnit(playerId, unitId){
        let unitType;
        let unitArr;
        let player;
        if (playerId == this.player1Id){
            unitType = "friend";
            unitArr = "friends";
            player = "player1";
        }
        else {
            unitType = "enemy";
            unitArr = "enemies";
            player = "player2";
        }

        if ((unitId == 0) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 2, 1, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 1) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 2, 0.5, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 2) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 2, 0.25, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 3) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 6, 2, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 4) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 6, 1, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 5) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 4, 1, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 6) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 12, 4, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 7) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];
            
            this[unitArr].push(new Creature(unitType, 25, 8, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 8) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 60, 10, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
        else if ((unitId == 9) && (this[player + "Gold"] >= this.unitCost[unitId])){
            this[player + "Gold"] -= this.unitCost[unitId];
            this[player + "Income"] += this.unitIncomeChange[unitId];

            this[unitArr].push(new Creature(unitType, 105, 10, this.unitSpeed[unitId], "rgb(200, 0, 0)"));
        }
    }

    timerManager(diff){
        this.slowTimer += 1000 * diff;
        this.mediumTimer += 1000 * diff;
        this.fastTimer += 1000 * diff;

        this.incomeTimer += 1000 * diff;

        this.slowTimerReached = false;
        this.mediumTimerReached = false;
        this.fastTimerReached = false;

        this.incomeTimerReached = false;

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

        if (this.incomeTimer >= 10000){
            this.incomeTimer -= 10000;

            this.#getIncome();
        }
    }

    move(){
        let friendReachedEnd = false;
        this.friends.forEach((friend) => {
            if (this[friend.speedType + "TimerReached"]){
                if (friend.myCell == 36){
                    friendReachedEnd = true;

                    this.cells[friend.myCell] = undefined;

                    let speedDamageScale = 1;
                    if (friend.speedType == "medium"){
                        speedDamageScale = 2;
                    }
                    else if (friend.speedType == "fast"){
                        speedDamageScale = 4;
                    }

                    this.enemyCastle.takeDamage(friend.damage * speedDamageScale);
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

                    let speedDamageScale = 1;
                    if (enemy.speedType == "medium"){
                        speedDamageScale = 2;
                    }
                    else if (enemy.speedType == "fast"){
                        speedDamageScale = 4;
                    }

                    this.friendCastle.takeDamage(enemy.damage * speedDamageScale);
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
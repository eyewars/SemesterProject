"use strict";
import Creature from "./creature.mjs";
import Castle from "./castle.mjs";

class Game{
    constructor(){
        this.friends = [];
        this.enemies = [];

        this.friendCastle = new Castle("friend");
        this.enemyCastle = new Castle("enemy");
    }

    createFriend(){
        this.friends.push(new Creature("friend"));
    }
    
    createEnemy(){
        this.enemies.push(new Creature("enemy"));
    } 
}

const myGame = new Game();

export default myGame;
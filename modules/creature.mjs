"use strict";
import { canvasWidth, canvasHeight } from "./gameLogic.mjs";

class Creature{
    constructor(type, health, damage, speedType, color){
        this.type = type;
        this.health = health;
        this.damage = damage;
        this.speedType = speedType;
        this.color = color;
        
        this.width = 40;
        this.height = 40;

        // BRUKER IKKE xPos LENGER
        if (type == "friend"){
            this.xPos = 0;
            this.myCell = 0;
        }
        else{
            this.xPos = canvasWidth - this.width;
            this.myCell = 39;
        }

        this.yPos = canvasHeight - this.height;
    }

    takeDamage(damage){
        this.health -= damage;
    }
}

export default Creature;
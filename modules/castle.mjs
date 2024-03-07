"use strict";
import { canvasWidth, canvasHeight } from "./gameLogic.mjs";

class Castle{
    constructor(type){
        this.type = type;

        this.health = 100;

        this.width = 120;
        this.height = 160;

        if (type == "friend"){
            this.xPos = 0;
        }
        else{
            this.xPos = canvasWidth - this.width;
        }

        this.yPos = canvasHeight - this.height;
    }

    takeDamage(amount){
        this.health -= amount;
    }
}

export default Castle;
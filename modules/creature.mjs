"use strict";
import { canvasWidth, canvasHeight } from "./gameLogic.mjs";

class Creature{
    constructor(type){
        this.type = type;

        this.width = 50;
        this.height = 50;

        if (type == "friend"){
            this.xPos = 0;
        }
        else{
            this.xPos = canvasWidth - this.width;
        }

        this.yPos = canvasHeight - this.height;

        this.speed = 100;
    }

    move(diff){
        if (this.type == "friend"){
           this.xPos += this.speed * diff; 
        }
        else {
            this.xPos -= this.speed * diff; 
        }
    }
}

export default Creature;
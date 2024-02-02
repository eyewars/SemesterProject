"use strict";
import { canvasWidth, canvasHeight } from "./gameLogic.mjs";

class Creature{
    constructor(type){
        this.type = type;

        let randomTest = Math.random() * 3;

        if (randomTest >= 2){
            this.speedType = "fast";
            if (this.type == "friend"){
                this.color = "rgb(200, 0, 0)";
            }
            else {
                this.color = "rgb(100, 0, 0)";
            }
        }
        else if(randomTest >= 1){
            this.speedType = "medium";
            if (this.type == "friend"){
                this.color = "rgb(0, 200, 0)";
            }
            else {
                this.color = "rgb(0, 100, 0)";
            }
        }
        else{
            this.speedType = "slow";
            if (this.type == "friend"){
                this.color = "rgb(0, 0, 200)";
            }
            else {
                this.color = "rgb(0, 0, 100)";
            }
        }

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
}

export default Creature;
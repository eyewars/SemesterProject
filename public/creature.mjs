"use strict";
import { canvas, ctx } from "./draw.mjs";

class Creature{
    constructor(type){
        this.type = type;

        this.width = 50;
        this.height = 50;

        if (type == "friend"){
            this.xPos = 0;
            this.color = "green";
        }
        else{
            this.xPos = canvas.width - this.width;
            this.color = "purple";
        }

        this.speed = Math.random() * 100;
    }

    move(diff){
        if (this.type == "friend"){
           this.xPos += this.speed * diff; 
        }
        else {
            this.xPos -= this.speed * diff; 
        }
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos, canvas.height - this.height, this.width, this.height);
    }
}

export default Creature;
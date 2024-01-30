"use strict";
import { canvas, ctx } from "./draw.mjs";

class Castle{
    constructor(type){
        this.type = type;

        this.width = 100;
        this.height = 80;

        if (type == "friend"){
            this.xPos = 0;
            this.color = "blue";
        }
        else{
            this.xPos = canvas.width - this.width;
            this.color = "red";
        }
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos, canvas.height - this.height, this.width, this.height);
    }
}

export default Castle;
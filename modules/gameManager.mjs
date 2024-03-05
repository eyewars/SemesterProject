"use strict";
import { gameLookup } from "../routes/gameRoute.mjs";

class GameManager{
    static instance = null;

    #players;

    constructor(){
        if (GameManager.instance == null){
            GameManager.instance = this;

            this.#players = [];
        }
        return GameManager.instance;
    }

    createNewGame = (req, res, next) => {
        const gameIndex = gameLookup[req.token.userId];

        if (gameIndex != undefined){
            next();
        }
        else {
            this.#players.push(req.token.userId);
            console.log(this.#players);

            if (this.#players.length > 2){
                console.log("Noe har gått jævlig galt, det er mer enn 2 spillere!");
            }
            else if (this.#players.length == 2){
                res.locals.startGame = true;
                res.locals.player1Id = this.#players[0];
                res.locals.player2Id = this.#players[1];

                this.#players = [];
            }

            next(); 
        }   
    }
}

export default GameManager;
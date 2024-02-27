"use strict";

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
        this.#players.push(req.token.userId);

        if (this.#players.length > 2){
            console.log("Noe har gått jævlig galt, det er mer enn 2 spillere!");
        }
        else if (this.#players.length == 2){
            res.locals.startGame = true;
            res.locals.player1 = this.#players[0];
            res.locals.player2 = this.#players[1];

            this.#players = [];
        }

        next();
    }
}

export default GameManager;
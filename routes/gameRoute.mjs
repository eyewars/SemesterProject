"use strict";

import express from "express";
import Game from "../modules/game.mjs";
import GameManager from "../modules/gameManager.mjs";

const GAME_API = express.Router();

const gameManager = new GameManager();

export const games = [];

GAME_API.get("/", (req, res) => {
    console.log(games);
	res.send(games);
})

GAME_API.post("/", gameManager.createNewGame, (req, res) => {
    if (res.locals.startGame){
        games.push(new Game(res.locals.player1, res.locals.player2));

        res.json({message: "New Game Created!"}).end;
    }
    else {
        res.json({message: "Need one more player!"}).end;
    }
})


export default GAME_API;
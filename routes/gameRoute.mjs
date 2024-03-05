"use strict";

import express from "express";
import Game from "../modules/game.mjs";
import GameManager from "../modules/gameManager.mjs";
import { authenticateToken } from "../modules/bearerToken.mjs";

const GAME_API = express.Router();

const gameManager = new GameManager();

export const games = [];
export const gameLookup = {};
export const ongoingGamesLookup = {};

GAME_API.get("/getId", authenticateToken, (req, res) => {
    res.json({id: req.token.userId});
})

GAME_API.get("/", (req, res) => {
    console.log(games);
	res.send(games);
})

GAME_API.post("/", authenticateToken, gameManager.createNewGame, (req, res) => {
    if (res.locals.startGame){
        games.push(new Game(res.locals.player1Id, res.locals.player2Id));

        gameLookup[res.locals.player1Id] = games.length - 1;
        gameLookup[res.locals.player2Id] = games.length - 1;

        ongoingGamesLookup[games.length - 1] = games.length - 1;
        console.log(ongoingGamesLookup);

        res.json({message: "New Game Created!", id: req.token.userId}).end;
    }
    else {
        res.json({message: "Need one more player!", id: req.token.userId}).end;
    }
})

export default GAME_API;
"use strict";
import express from "express";
import Game from "../modules/game/game.mjs";
import GameManager from "../modules/game/gameManager.mjs";
import { authenticateToken } from "../modules/security/bearerToken.mjs";
import DBManager from "../modules/storageManager.mjs"
import HTTPCodes from "../modules/httpCodes.mjs";

const GAME_API = express.Router();

const gameManager = new GameManager();

export const games = [];
export const gameLookup = {};
export const ongoingGamesLookup = {};

GAME_API.get("/getPlayer", authenticateToken, async(req, res) => {
    const gameIndex = gameLookup[req.token.userId];
    const myGame = games[gameIndex];

    let mySide;
    if (req.token.userId == myGame.player1Id){
        mySide = "player1";
    }
    else{
        mySide = "player2";
    }

    const friend = await DBManager.getUser(myGame.player1Id);
    const enemy = await DBManager.getUser(myGame.player2Id);

    res.status(HTTPCodes.SuccesfullResponse.Ok).json({player: mySide, id: req.token.userId, friendName: friend.username, enemyName: enemy.username}).end();

})

GAME_API.post("/", authenticateToken, gameManager.createNewGame, (req, res) => {
    if (res.locals.startGame){
        games.push(new Game(res.locals.player1Id, res.locals.player2Id));

        gameLookup[res.locals.player1Id] = games.length - 1;
        gameLookup[res.locals.player2Id] = games.length - 1;

        ongoingGamesLookup[games.length - 1] = games.length - 1;
        console.log(ongoingGamesLookup);

        res.status(HTTPCodes.SuccesfullResponse.Ok).json({message: "New Game Created!", id: req.token.userId}).end();
    }
    else {
        res.status(HTTPCodes.SuccesfullResponse.Ok).json({message: "Need one more player!", id: req.token.userId}).end();
    }
})

GAME_API.get("/", authenticateToken, gameManager.leaveQueue, (req, res) => {
    res.status(HTTPCodes.SuccesfullResponse.Ok).json({message: "Left queue successfully"}).end();
})

export default GAME_API;
"use strict";
import express from "express";
import User from "../modules/user.mjs";
import HTTPCodes from "../modules/httpCodes.mjs";
import DBManager from "../modules/storageManager.mjs"
import { createHashedPassword } from "../modules/passwordHash.mjs";
import { createToken, authenticateToken } from "../modules/bearerToken.mjs";

const USER_API = express.Router();

const users = [];

USER_API.post("/login", createHashedPassword, async (req, res) => {
	const { email, password } = req.body;

	const pass = await DBManager.loginUser(email);

	if (pass == password){
		const id = await DBManager.getId(email);
		
		const token = createToken(id);

		res.status(HTTPCodes.SuccesfullResponse.Ok).json({message: "Successful login", token: token}).end();
	}
	else{
		res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({message: "Incorrect login information"}).end();
	}
})

USER_API.get("/isLoggedIn", authenticateToken, async (req, res) => {
	//Hvis du allerede har en valid token når du åpner/refresher nettsiden, så vil du få en ny en. Dette er sånn at ikke tokenen din kan tilfeldigvis går ut mens du holder på med noe.
	const newToken = createToken(req.token.userId);

	res.status(HTTPCodes.SuccesfullResponse.Ok).json({token: newToken}).end();
})

USER_API.get("/", authenticateToken, async (req, res) => {
	// Tip: All the information you need to get the id part of the request can be found in the documentation 
	// https://expressjs.com/en/guide/routing.html (Route parameters)
	const userInfo = await DBManager.getUser(req.token.userId);

	res.status(HTTPCodes.SuccesfullResponse.Ok).send(userInfo).end();
})

USER_API.post("/check", async (req, res) => {
	const {username, email} = req.body;

	const exists = await DBManager.checkIfUserExists(username, email);

	res.status(HTTPCodes.SuccesfullResponse.Ok).json({exists: exists[0].exists}).end();
})

USER_API.post("/", createHashedPassword, async (req, res) => {
	const { username, email, password } = req.body;
	console.log(req.body);

	if (username != "" && email != "" && password != "") {
		let user = new User(username, email, password);

		user = await user.save();
		res.status(HTTPCodes.SuccesfullResponse.Ok).send(user).end();
	} else {
		res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({message: "Missing data field"}).end();
	}
})

USER_API.put("/", authenticateToken, createHashedPassword, async (req, res) => {
	//TODO: edit user

	const userInfo = await DBManager.getUser(req.token.userId);

	let { username, email, password } = req.body;

	if (username == ""){
		username = userInfo.username;
	}
	if (email == ""){
		email = userInfo.email;
	}
	if (password == ""){
		password = userInfo.password;
	}

	const tempUser = new User(username, email, password);

	DBManager.updateUser(tempUser, req.token.userId);

	res.status(HTTPCodes.SuccesfullResponse.Ok).json({message: "Successfully updated user"}).end();
})

USER_API.delete("/", authenticateToken, async (req, res) => {
	//TODO: Delete user

	const deletion = await DBManager.deleteUser(req.token.userId);

	if (deletion){
		res.status(HTTPCodes.SuccesfullResponse.Ok).json({ message: 'User deleted successfully'}).end();
	}
	else {
		res.status(HTTPCodes.ServerErrorRespons.InternalError).json({ message: 'User was not deleted'}).end();
	}
})

export default USER_API;
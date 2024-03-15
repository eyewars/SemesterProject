"use strict";
import express from "express";
import User from "../modules/user.mjs";
import HTTPCodes from "../modules/httpCodes.mjs";
import DBManager from "../modules/storageManager.mjs"
import { createHashedPassword } from "../modules/security/passwordHash.mjs";
import { createToken, authenticateToken } from "../modules/security/bearerToken.mjs";

const USER_API = express.Router();

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
	const newToken = createToken(req.token.userId);

	res.status(HTTPCodes.SuccesfullResponse.Ok).json({token: newToken}).end();
})

USER_API.get("/", authenticateToken, async (req, res) => {
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

	const exists = await DBManager.checkIfUserExists(username, email);

	if (!exists[0].exists){
		if (username != "" && email != "" && password != "") {
			if (!(username.length >= 1) || !(username.length <= 12)){
                res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({message: "Invalid username"}).end();
                return;
            }

			if (!(email.includes("@")) || ((email.includes(" ")))){
                res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({message: "Invalid E-Mail"}).end();
                return;
            }

			let user = new User(username, email, password);

			user = await user.save();
			res.status(HTTPCodes.SuccesfullResponse.Ok).send(user).end();
		} else {
			res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({message: "Missing data field"}).end();
		}
	} else{
		res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({message: "User already exists"}).end();
	}
	
})

USER_API.put("/", authenticateToken, createHashedPassword, async (req, res) => {
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
	const deletion = await DBManager.deleteUser(req.token.userId);

	if (deletion){
		res.status(HTTPCodes.SuccesfullResponse.Ok).json({ message: 'User deleted successfully'}).end();
	}
	else {
		res.status(HTTPCodes.ServerErrorRespons.InternalError).json({ message: 'User was not deleted'}).end();
	}
})

export default USER_API;
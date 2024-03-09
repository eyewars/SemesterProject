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
		//Den meldingen som blir sendt (med send.()) blir ikke sett noen plass, finn ut av det
		res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send("Wrong username or password").end();
	}
})

USER_API.get("/isLoggedIn", authenticateToken, async (req, res) => {
	//Hvis du allerede har en valid token når du åpner/refresher nettsiden, så vil du få en ny en. Dette er sånn at ikke tokenen din kan tilfeldigvis expiree mens du holder på med noe.
	const newToken = createToken(req.token.userId);

	res.status(200).json({token: newToken}).end();
})

USER_API.get("/", authenticateToken, async (req, res) => {
	// Tip: All the information you need to get the id part of the request can be found in the documentation 
	// https://expressjs.com/en/guide/routing.html (Route parameters)

	const userInfo = await DBManager.getUser(req.token.userId);

	res.send(userInfo);
})

USER_API.post("/check", async (req, res) => {
	const {username, email} = req.body;

	const exists = await DBManager.checkIfUserExists(username, email);

	res.json({exists: exists[0].exists}).end();
})

USER_API.post("/", createHashedPassword, async (req, res) => {
	// create user
	// This is using javascript object destructuring.
	// Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
	// https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/

	// Basically sånn det fungerer er at den lager 3 variabler. name, email, og password. Verdiene blir satt til de samsvarende verdiene i req.body objektet med samme navn
	const { username, email, password } = req.body;
	console.log(req.body);

	if (username != "" && email != "" && password != "") {
		
		let user = new User(username, email, password);
		//TODO: Do not save passwords!!!

		//TODO: Does the user exist?
		let exists = false;
		/*
		for (let i = 0; i < users.length; i++){
			if (email == users[i].email){
				exists = true;
				break;
			}
			if (username == users[i].username){
				exists = true; 
				break;
			}
		}
		*/

		if (!exists) {
			//users.push(user);

			user = await user.save();
			res.status(HTTPCodes.SuccesfullResponse.Ok).json(JSON.stringify(user)).end();
			//res.json({ message: 'User registered successfully' }).end();
		} else {
			res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).end();
		}
	} else {
		res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send("Mangler data felt").end();
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
		res.json({ message: 'User deleted successfully'}).end();
	}
	else {
		res.json({ message: 'User was not deleted'}).end();
	}

	/*

	if (req.params.id >= users.length) {
		res.json({ message: 'ID not valid' }).end();
		return;
	}
	users.splice(req.params.id, 1);
*/
})

export default USER_API;
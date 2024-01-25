import express from "express"; //fjerna ", { response }" tror det bare er bs
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";

const USER_API = express.Router();

const users = [];

USER_API.get("/", (req, res) => {
	console.log(users);
	res.send(users);
})

USER_API.get("/:id", (req, res) => {
	// Tip: All the information you need to get the id part of the request can be found in the documentation 
	// https://expressjs.com/en/guide/routing.html (Route parameters)

	/// TODO: 
	// Return user object

	if (req.params.id >= users.length) {
		res.json({ message: 'ID not valid' }).end();
		return;
	}

	console.log(users[req.params.id]);
	res.send(users[req.params.id]);
})

USER_API.post("/", (req, res) => {
	// create user
	// This is using javascript object destructuring.
	// Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
	// https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/

	// Basically sånn det fungerer er at den lager 3 variabler. name, email, og password. Verdiene blir satt til de samsvarende verdiene i req.body objektet med samme navn
	const { username, email, password } = req.body;
	console.log(req.body);

	if (username != "" && email != "" && password != "") {
		const user = new User(username, email, password);
		//TODO: Do not save passwords!!!

		//TODO: Does the user exist?
		let exists = false;

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

		if (!exists) {
			users.push(user);

			//res.status(HttpCodes.SuccesfullResponse.Ok).send(user);
			res.json({ message: 'User registered successfully' }).end();
		} else {
			res.status(HttpCodes.ClientSideErrorResponse.BadRequest).end();
		}
	} else {
		res.status(HttpCodes.ClientSideErrorResponse.BadRequest).send("Mangler data felt").end();
	}
})

USER_API.put("/:id", (req, res) => {
	//TODO: edit user

	if (req.params.id >= users.length) {
		res.end();
		return;
	}

	let tempUser = users[req.params.id];

	const { username, email, password } = req.body;

	if (username != "") {
		tempUser.username = username;
	}

	if (email != "") {
		tempUser.email = email;
	}

	if (password != "") {
		tempUser.passwordHash = password;
	}

	users[req.params.id] = tempUser;
	res.send(users[req.params.id]);
})

USER_API.delete("/:id", (req, res) => {
	//TODO: Delete user

	if (req.params.id >= users.length) {
		res.json({ message: 'ID not valid' }).end();
		return;
	}
	users.splice(req.params.id, 1);

	res.json({ message: 'User deleted successfully'}).end();
})

export default USER_API
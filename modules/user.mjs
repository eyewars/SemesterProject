"use strict";

class User{
	constructor(username, email, passwordHash){
		///TODO: Are these the correct fields for your project?
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
	}
}

export default User;
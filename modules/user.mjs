"use strict";
import DBManager from "./storageManager.mjs";

class User{
	constructor(username, email, passwordHash){
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
		this.id;
		this.games = 0;
		this.wins = 0;
		this.losses = 0;
	}

	async save() {
		if (this.id == null) {
			return await DBManager.createUser(this);
		}else{
			return await DBManager.updateUser(this);
		}
	}
	
	  delete(){
		DBManager.deleteUser(this);
	}
}

export default User;
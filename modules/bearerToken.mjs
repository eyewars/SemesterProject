"use strict";
import jwt from "jsonwebtoken";
import HTTPCodes from "./httpCodes.mjs";

export function createToken(userId) {
	const token = jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '12h' });
	return token;
}

export function authenticateToken(req, res, next) {
	const token = req.headers['authorization'];
  
	if (!token) {
		return res.sendStatus(HTTPCodes.ClientSideErrorResponse.Unauthorized);
	}
  
	jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.sendStatus(HTTPCodes.ClientSideErrorResponse.Forbidden);
		}
  
		req.token = decoded;
		next();
	});
}
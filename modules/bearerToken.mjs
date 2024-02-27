"use strict";
import jwt from "jsonwebtoken";
import HTTPCodes from "./httpCodes.mjs";

// Generate and issue a bearer token
export function createToken(userId) {
	const token = jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
	return token;
}

// Middleware for bearer token authentication
export function authenticateToken(req, res, next) {
	const token = req.headers['authorization'];
  
	if (!token) {
		return res.sendStatus(HTTPCodes.ClientSideErrorResponse.Unauthorized);
	}
  
	jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.sendStatus(HTTPCodes.ClientSideErrorResponse.Forbidden);
		}
  
		// Add the decoded information to the request object
		req.token = decoded;
		next();
	});
}
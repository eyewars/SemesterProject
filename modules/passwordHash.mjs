"use strict";
import crypto from "node:crypto";

export function createHashedPassword(req, res, next){
    const hash = crypto.createHash("sha256");

    hash.update(req.body.password);
    hash.update(process.env.HASH_SECRET);

    req.body.password = hash.digest("hex");

    next();
}



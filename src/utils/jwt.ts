// pomocné funkce pro sign a check JWT.

import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signToken(payload: object) {
    return jwt.sign(payload, env.JWT_KEY, { expiresIn: env.JWT_EXPIRE });
}

export function verifyToken(token: string) {
    return jwt.verify(token, env.JWT_KEY);
}
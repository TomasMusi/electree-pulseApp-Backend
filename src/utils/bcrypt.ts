import bcrypt from "bcrypt";
import { env } from "../config/env";

export async function hashPassword(password: string) {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}
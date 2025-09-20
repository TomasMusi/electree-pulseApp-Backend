// nacte .env 

import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string) {
    const v = process.env[name] ?? fallback;
    if (v === undefined) throw new Error(`Chybí proměnná prostředí: ${name}`);
    return v;
}

export const env = {
    // Database
    DB_HOST: required("DATABASE_IP"),
    DB_PORT: parseInt(process.env.DATABASE_PORT || "3306", 10),
    DB_USER: required("DATABASE_USER"),
    DB_PASSWORD: required("DATABASE_PASSWORD"),
    DB_NAME: required("DATABASE_NAME"),
    DB_URL: required("DATABASE_URL"),

    // Bcrypt
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),

    // JWT
    JWT_KEY: required("JWT_KEY"),
    JWT_EXPIRE: process.env.JWT_EXPIRE || "7h",

    // App
    PORT: parseInt(process.env.PORT || "4000", 10),
};

import { Kysely, MysqlDialect, LogEvent } from "kysely";
import mysql from "mysql2";
import { env } from "../config/env";
import type { DB } from "./types"; // vygenerované kysely-codegen

// Vytvoreni Poolu
const pool = mysql.createPool({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});


// Propojit kysely s poolem
export const db = new Kysely<DB>({
    dialect: new MysqlDialect({ pool }),
});

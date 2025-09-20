import { Router, Request, Response } from "express";
import { loginBodySchema, registerSchema } from "../schemas/auth.schema";
import { env } from "../config/env";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { db } from "../db/database";
import { signToken } from "../utils/jwt";

const router = Router();

// POST /api/Login
router.post("/login", async (req: Request, res: Response) => {

    // Zod validation
    const parsed = loginBodySchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid data",
            issues: parsed.error.flatten(),
        });
    }

    const { email, password } = parsed.data; // Ziskat data ze zodu

    try {
        // Kontrola zda existuje
        const user = await db
            .selectFrom("Auth")
            .select(["id", "name", "email", "password_hash", "created"])
            .where("email", "=", email)
            .executeTakeFirst();

        if (!user) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }

        // Porovnani hesel
        const passCheck = await comparePassword(password, user.password_hash);
        if (!passCheck) {
            return res
                .status(401)
                .json({ status: "fail", message: "Invalid email or password" });
        }

        // Creating JWT

        const token = signToken({ sub: user.id });
        const expiresIn = env.JWT_EXPIRE;


        return res.json({
            status: "ok",
            message: "Login successful",
            token,
            token_type: "Bearer",
            expires_in: expiresIn,
        });

    } catch (err) {
        console.error("[LOGIN] Error:", err);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
});



// POST /api/register
router.post("/register", async (req: Request, res: Response) => {

    // Zod Validation
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid data",
            issues: parsed.error.flatten(),
        });
    }

    const { name, email, password } = parsed.data; // Ziskat data ze zodu
    try {

        const existing = await db
            .selectFrom("Auth")
            .select(["id"])
            .where("email", "=", email)
            .executeTakeFirst();

        if (existing) {
            return res.status(409).json({ status: "fail", message: "Email already exists" });
        }
        const hashedPassword = await hashPassword(password);

        await db
            .insertInto("Auth")
            .values({
                name,
                email,
                password_hash: hashedPassword,
                created: new Date(), // or omit if column has DEFAULT CURRENT_TIMESTAMP
            })
            .executeTakeFirst();

        // Zaslat zpet Response
        res.json({
            status: "ok",
            message: "Data received",
            data: { name, email, hashedPassword },
        });
    } catch (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ status: "error", message: "Server error" });
    }


})

export default router


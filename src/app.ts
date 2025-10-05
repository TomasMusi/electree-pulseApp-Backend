// Imports
import express from "express"; // express, na vytvoreni serveru. HTTP serve a router.
import cors from "cors"; // Cross-Origin Resource Sharing
import helmet from "helmet"; // Zabezpeceni HTTP hlavicky
import morgan from "morgan"; // Logovani kazdeho requestu
import rateLimit from "express-rate-limit"; // Omezuje pocet pozadavku z jedne IP, Zakladni ochrana proti BruteForce//DDOS
import { notFoundHandler, globalErrorHandler } from "./middleware/error"; // Error Handlers
import loginRoutes from "./routes/auth.routes";
import publicDataRoutes from "./routes/PublicData.routes"

const app = express();

// Zabezpeceni + CORS
app.use(helmet());
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

// Logs + parsing body
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true }));

// Routy
app.use("/api/", loginRoutes); // Login Route
app.use("/api/", publicDataRoutes) // Public Data Route


// Testing Route
app.get("/health", (_req, res) => res.json({ ok: true }));

// Error Handler, musí byt jako posledni
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

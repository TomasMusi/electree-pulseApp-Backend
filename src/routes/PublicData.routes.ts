// Public Data Fetch.

import { Router, Request, Response } from "express";
import { env } from "../config/env";
import { Agent, Dispatcher } from "undici"; // Undici handles fetch() under the hood
import { APIreturns } from "../types/publicData.types"
const router = Router();

// Getting Formated Date, Year, Month, Day
function formatDate(dateTime: string): { year: number; month: number; day: number } | null {
    const m = /^(\d{2})-(\d{2})-(\d{4})/.exec(dateTime);
    if (!m) return null;

    const [, dd, MM, yyyy] = m;
    return {
        year: Number(yyyy),
        month: Number(MM),
        day: Number(dd),
    };
}

// GET /api/publicData
router.get("/publicData", async (req: Request, res: Response) => {
    try {
        const apiUrl = env.API_URL;

        // if the enviroment is not setuped.
        if (!apiUrl) {
            throw new Error("API_URL environment variable is not set");
        }
        // HTTPS connection, but don’t verify the certificate. 
        // We make Node stop asking ,,Do I trust this certificate?" 
        const dispatcher: Dispatcher = new Agent({ connect: { rejectUnauthorized: false } });

        // Send Fetch
        const response = await fetch(apiUrl, {
            dispatcher,
            signal: AbortSignal.timeout(15_000),
            headers: { Accept: "application/json" },
        });

        // Check if everything is all right
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        res.status(200).json(data);
    }
    // handling error
    catch (err) {
        console.error(`Error Fetching Data ${err}`);
        res.status(500).json({ error: "Failed To Fetch Data" })
    }
})


export default router;
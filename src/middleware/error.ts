// Definice dvou erroru, Univerzal 404 a global handler

import type { Request, Response, NextFunction } from "express";

/*

Error 404
Handler - když žádný route neodpovídá.

*/

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        status: 'Selhani',
        message: `Endpoint ${req.method} ${req.originalUrl} nebyl nalezen.`
    });
}



/* G

Globalni Error Handler

Zachytí všechny chyby, které projdou přes next(err)
vrátí const json.

*/

export function globalErrorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error("[ERROR]", err);

    const status = err.statusCode || 500;
    const message =
        err.message || "Nastala neočekávaná chyba na serveru.";

    res.status(status).json({
        status: "error",
        message,
    });
}
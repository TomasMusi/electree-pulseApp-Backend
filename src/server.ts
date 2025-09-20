// src/server.ts

import app from './app'

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`[HTTP] Server bezi na https://localhost:${PORT}`);
});
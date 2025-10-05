// Expected Return From API.
export interface APIreturns {
    base_load?: number;
    czk: number;
    eur: number;
    kurz: number;
    obchodovane_mnozstvi: number;
    offpeak_load: number;
    peak_load: number;
    timeUtc: string; // "05-10-2025 20:00:00"
}
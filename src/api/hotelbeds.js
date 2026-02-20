import CryptoJS from 'crypto-js';

const API_KEY = import.meta.env.VITE_HOTELBEDS_API_KEY;
const API_SECRET = import.meta.env.VITE_HOTELBEDS_API_SECRET;

const generateSignature = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    return CryptoJS.SHA256(API_KEY + API_SECRET + timestamp).toString(CryptoJS.enc.Hex);
};

const getHeaders = () => ({
    'Api-key': API_KEY,
    'X-Signature': generateSignature(),
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

// In dev: Vite proxy forwards /hotelbeds-api → Hotelbeds directly
// In prod: Vercel serverless function at /api/hotelbeds acts as the proxy
const buildUrl = (subPath, params) => {
    const qs = new URLSearchParams(params).toString();
    if (import.meta.env.DEV) {
        return `/hotelbeds-api/${subPath}?${qs}`;
    }
    // Route through Vercel proxy — avoids CORS entirely
    return `/api/hotelbeds?path=${subPath}&${qs}`;
};

export const searchHotels = async (filters, page = 1) => {
    try {
        const params = {
            fields: 'all',
            language: 'ENG',
            from: ((page - 1) * 20) + 1,
            to: page * 20,
        };

        const url = buildUrl('hotel-content-api/1.0/hotels', params);

        const response = await fetch(url, {
            method: 'GET',
            // In prod the proxy adds auth headers server-side; in dev we still need them
            headers: import.meta.env.DEV ? getHeaders() : { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Hotelbeds API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

import CryptoJS from 'crypto-js';

const API_KEY = import.meta.env.VITE_HOTELBEDS_API_KEY;
const API_SECRET = import.meta.env.VITE_HOTELBEDS_API_SECRET;
const BASE_URL = import.meta.env.VITE_HOTELBEDS_ENDPOINT;

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

// Since the API typically restricts browser calls via CORS, we may need a Vite proxy. 
// We will route via the local Vite proxy `/hotelbeds-api` during development.
export const searchHotels = async (filters, page = 1) => {
    try {
        // Use proxy in dev, or base url in prod if configured differently
        const apiRoot = import.meta.env.DEV ? '/hotelbeds-api' : BASE_URL;
        const url = `${apiRoot}/hotel-content-api/1.0/hotels`;

        // In a real scenario, the Hotelbeds API requires a POST request to the availability endpoint with specific XML/JSON
        // For this assignment, we will use a common endpoint or mock if the real one requires complex payload.
        // Example payload for /hotel-api/1.0/hotels (Content API) to just list hotels:
        const params = new URLSearchParams({
            fields: 'all',
            language: 'ENG',
            from: ((page - 1) * 20) + 1,
            to: page * 20,
        });

        // NOTE: For availability, the endpoint is usually POST /hotel-api/1.0/hotels (Availability API)
        // We will do a generic GET to the content API to list hotels based on pagination first.
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Hotelbeds API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

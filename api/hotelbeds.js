import crypto from 'crypto';

const API_KEY = process.env.VITE_HOTELBEDS_API_KEY;
const API_SECRET = process.env.VITE_HOTELBEDS_API_SECRET;
const BASE_URL = process.env.VITE_HOTELBEDS_ENDPOINT || 'https://api.test.hotelbeds.com';

const generateSignature = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    return crypto
        .createHash('sha256')
        .update(API_KEY + API_SECRET + timestamp)
        .digest('hex');
};

export default async function handler(req, res) {
    // Allow same-origin requests from Vercel frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // req.query.path holds the API sub-path, e.g. "hotel-content-api/1.0/hotels"
    const { path, ...queryParams } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    const params = new URLSearchParams(queryParams).toString();
    const upstreamUrl = `${BASE_URL}/${path}${params ? `?${params}` : ''}`;

    try {
        const response = await fetch(upstreamUrl, {
            method: req.method,
            headers: {
                'Api-key': API_KEY,
                'X-Signature': generateSignature(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            ...(req.method !== 'GET' && req.body
                ? { body: JSON.stringify(req.body) }
                : {}),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        return res.status(500).json({ error: 'Proxy request failed', detail: err.message });
    }
}

import { createClient } from '@vercel/kv';

// This is a Vercel Serverless Function
// It's a dynamic route that handles /api/data/[key]
// e.g., /api/data/products, /api/data/heroContents

export const config = {
  runtime: 'edge',
};

// Helper to check for admin authentication
async function isAuthenticated(req: Request): Promise<boolean> {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const expectedToken = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
        return token === expectedToken;
    }
    return false;
}

// Robust client getter to handle various environment variable naming schemes
function getKvClient() {
    const url = process.env.KV_REST_API_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error('@vercel/kv: Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN');
    }

    return createClient({ url, token });
}


export default async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const key = url.pathname.split('/').pop();

    if (!key) {
        return new Response('Missing data key.', { status: 400 });
    }

    try {
        const kv = getKvClient();
        
        switch (req.method) {
            case 'GET':
                const data = await kv.get(key);
                if (data === null) {
                    return new Response(JSON.stringify({ message: `No data found for key: ${key}` }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Cache-Control': 's-maxage=60, stale-while-revalidate=300' // Cache on the edge
                    },
                });

            case 'POST':
                if (!(await isAuthenticated(req))) {
                    return new Response('Unauthorized', { status: 401 });
                }
                
                const body = await req.json();
                await kv.set(key, body);
                
                return new Response(JSON.stringify({ success: true, message: `Data for key '${key}' updated.` }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });

            default:
                return new Response('Method Not Allowed', { status: 405 });
        }
    } catch (error: any) {
        console.error(`Error processing request for key '${key}':`, error);
        return new Response(JSON.stringify({ message: 'An internal server error occurred.', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
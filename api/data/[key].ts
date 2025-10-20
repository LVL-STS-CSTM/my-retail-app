import { kv } from '@vercel/kv';

// This is a Vercel Serverless Function
// It's a dynamic route that handles /api/data/[key]
// e.g., /api/data/products, /api/data/heroContents

export const config = {
  runtime: 'edge',
};

// Helper to check for admin authentication
async function isAuthenticated(req: Request): Promise<boolean> {
    // In a real app, you'd validate a JWT or session cookie.
    // For this project, we'll use a simple "bearer" token in the auth header
    // that the client will store after logging in.
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // This simple check confirms the user has logged in successfully during their session.
        return token === `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
    }
    return false;
}


export default async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    // The 'key' is the dynamic part of the route, e.g., 'products'
    const key = url.pathname.split('/').pop();

    if (!key) {
        return new Response('Missing data key.', { status: 400 });
    }

    try {
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
                // This is a protected route, only admins can update data.
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
// This is a Vercel Serverless Function
// POST /api/admin/login

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    // Get credentials from environment variables (set in Vercel)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.error("Admin credentials are not set in environment variables.");
        return new Response('Server configuration error.', { status: 500 });
    }

    try {
        const { username, password } = await req.json();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Successful login
            return new Response(JSON.stringify({ success: true }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // Failed login
            return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response('Invalid request body.', { status: 400 });
    }
}
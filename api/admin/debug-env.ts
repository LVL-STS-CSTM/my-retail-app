// This is a Vercel Serverless Function
// GET /api/admin/debug-env
// It helps debug environment variables.

export const config = {
  runtime: 'edge',
};

// Basic Auth check
function isAuthenticated(req: Request): boolean {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) return false;
    
    // Use atob() for Edge runtime compatibility
    const auth = atob(authHeader.split(' ')[1]);
    const [user, pass] = auth.split(':');
    
    return user === process.env.ADMIN_USERNAME && pass === process.env.ADMIN_PASSWORD;
}

export default async function handler(req: Request): Promise<Response> {
    if (!isAuthenticated(req)) {
        return new Response('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
        });
    }

    const kv_url = process.env.KV_REST_API_URL;
    const kv_token = process.env.KV_REST_API_TOKEN;
    const admin_user = process.env.ADMIN_USERNAME;
    const google_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Deployment Environment Check</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 2rem auto; padding: 1rem; }
                h1, h2 { border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
                p { margin: 1rem 0; }
                strong { color: #000; }
                code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
                .error { color: #d32f2f; font-weight: bold; }
                .success { color: #2e7d32; font-weight: bold; }
                .info { background: #e3f2fd; border-left: 4px solid #1976d2; padding: 1rem; }
            </style>
        </head>
        <body>
            <h1>Deployment Environment Check</h1>
            <p>This page shows the status of critical environment variables in your current Vercel deployment.</p>
            
            <h2>Vercel KV (Database)</h2>
            <p><strong>KV_REST_API_URL:</strong> ${kv_url ? `<span class="success">SET</span> (Value starts with: <code>${kv_url.substring(0, 30)}...</code>)` : '<span class="error">NOT SET</span>'}</p>
            <p><strong>KV_REST_API_TOKEN:</strong> ${kv_token ? `<span class="success">SET</span> (Value starts with: <code>${kv_token.substring(0, 15)}...</code>)` : '<span class="error">NOT SET</span>'}</p>
            
            <h2>Other Variables</h2>
            <p><strong>ADMIN_USERNAME:</strong> ${admin_user ? `<span class="success">SET</span>` : '<span class="error">NOT SET</span>'}</p>
            <p><strong>GOOGLE_SERVICE_ACCOUNT_EMAIL:</strong> ${google_email ? `<span class="success">SET</span>` : '<span class="error">NOT SET</span>'}</p>
            
            <h2>Diagnosis</h2>
            <div class="info">
            ${(!kv_url || !kv_token) 
                ? '<p class="error">DIAGNOSIS: The KV variables are missing from this deployment.</p><p>This is the reason the seeding process is failing. Your application code is correct, but the Vercel project environment is not configured. Please follow these steps carefully:</p><ol><li>Go to your Vercel project dashboard.</li><li>Click the <strong>Integrations</strong> tab.</li><li>Ensure the <strong>Redis</strong> integration is connected to this project.</li><li>Go to the <strong>Deployments</strong> tab.</li><li>Find the latest deployment and click the "..." menu, then select <strong>Redeploy</strong>.</li><li>Once the new deployment is complete, run the seeding process again.</li></ol>'
                : '<p class="success">DIAGNOSIS: The KV variables are correctly set in this deployment!</p><p>If the seeding process still fails after seeing this message, there may be a different issue. However, the environment variable configuration is correct.</p>'
            }
            </div>
        </body>
        </html>
    `;

    return new Response(html, { 
        status: 200, 
        headers: { 'Content-Type': 'text/html' }
    });
}
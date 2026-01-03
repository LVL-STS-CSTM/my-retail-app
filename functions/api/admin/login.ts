
interface Env {
  CONTENT_KV: any;
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const { username, password } = await context.request.json() as any;

    // Fetch stored credentials from KV
    const storedCredsRaw = await context.env.CONTENT_KV.get('credential');
    if (!storedCredsRaw) {
      return new Response(JSON.stringify({ success: false, message: 'Server configuration error: No credentials in KV' }), { status: 500 });
    }

    const storedCreds = JSON.parse(storedCredsRaw);

    if (username === storedCreds.username && password === storedCreds.password) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    
    return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
};

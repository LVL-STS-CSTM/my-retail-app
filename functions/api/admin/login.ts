
interface Env {
  CONTENT_KV: any;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { username, password } = await request.json();

    // Fetch stored credentials from KV
    const storedCredsRaw = await env.CONTENT_KV.get('credential');
    if (!storedCredsRaw) {
      return new Response(JSON.stringify({ success: false, message: 'Server configuration error: No credentials in KV' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const storedCreds = JSON.parse(storedCredsRaw);

    if (username === storedCreds.username && password === storedCreds.password) {
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
};

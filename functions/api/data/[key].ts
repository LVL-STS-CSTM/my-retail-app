
interface Env {
  CONTENT_KV: any;
}

const getAuthToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

const isAuthenticated = async (token: string | null, env: Env) => {
  if (!token) return false;
  const storedCredsRaw = await env.CONTENT_KV.get('credential');
  if (!storedCredsRaw) return false;
  const storedCreds = JSON.parse(storedCredsRaw);
  const expectedToken = `${storedCreds.username}:${storedCreds.password}`;
  return token === expectedToken;
};

export const onRequestGet = async (context: { env: Env; params: { [key: string]: string | string[] }; request: Request }) => {
  const key = context.params.key as string;
  const data = await context.env.CONTENT_KV.get(key, 'json');

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
      'Cache-Control': 'public, max-age=60'
    },
  });
};

export const onRequestPost = async (context: { env: Env; params: { [key: string]: string | string[] }; request: Request }) => {
  const key = context.params.key as string;
  const token = getAuthToken(context.request);

  if (!(await isAuthenticated(token, context.env))) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await context.request.json();
    await context.env.CONTENT_KV.put(key, JSON.stringify(body));
    
    return new Response(JSON.stringify({ success: true, message: `Data for key '${key}' updated.` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: 'Error saving data', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

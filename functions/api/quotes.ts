// Trigger rebuild

interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
}

// Helper to sign JWT using Web Crypto API (Edge compatible)
async function signJwt(email: string, privateKey: string, scope: string) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const message = `${encodedHeader}.${encodedClaim}`;

  // Process the private key
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(message)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${message}.${encodedSignature}`;
}

async function getAccessToken(env: Env) {
  const jwt = await signJwt(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY, 'https://www.googleapis.com/auth/spreadsheets');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${res.statusText} - ${errorBody}`);
  }
  const data: any = await res.json();
  return data.access_token;
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;
  try {
    const { contact, items } = await request.json() as any;
    const token = await getAccessToken(env);
    
    const body = {
      values: [[
        `QT-${Date.now()}`,
        new Date().toISOString(),
        'New',
        contact.name,
        contact.email,
        contact.phone || '',
        contact.company || '',
        contact.message || '',
        JSON.stringify(items)
      ]]
    };

    const sheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Quotes!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    if (!sheetRes.ok) {
      const errorBody = await sheetRes.text();
      throw new Error(`Google Sheets API Error: ${sheetRes.status} ${sheetRes.statusText} - ${errorBody}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

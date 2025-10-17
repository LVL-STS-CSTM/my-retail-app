import { google } from 'googleapis';

// This is a Vercel Serverless Function
// Handles GET and POST for /api/subscriptions

export const config = {
  runtime: 'nodejs', // Explicitly set runtime for compatibility with googleapis
};

// Helper function to validate environment variables
function getEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set.`);
    }
    return value;
}

// Basic authentication check for admin actions
function isAuthenticated(req: Request): boolean {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const expectedToken = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
        return token === expectedToken;
    }
    return false;
}

async function getSheetsService() {
    const privateKey = getEnvVariable('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');
    const clientEmail = getEnvVariable('GOOGLE_SERVICE_ACCOUNT_EMAIL');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
}

export default async function handler(req: Request): Promise<Response> {
    try {
        switch (req.method) {
            case 'POST':
                return handlePost(req);
            case 'GET':
                return handleGet(req);
            default:
                return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error: any) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ success: false, message: 'An internal server error occurred.', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handlePost(req: Request): Promise<Response> {
    const { email } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return new Response(JSON.stringify({ message: 'A valid email is required.' }), { status: 400 });
    }

    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Subscriptions!B:B',
    });
    
    const existingEmails = response.data.values?.flat().map(e => e.toLowerCase()) || [];
    if (existingEmails.includes(normalizedEmail)) {
        return new Response(JSON.stringify({ message: 'This email is already subscribed.' }), { status: 409 });
    }

    const submissionDate = new Date().toISOString();
    const newRow = [submissionDate, normalizedEmail];

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Subscriptions!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRow] },
    });

    return new Response(JSON.stringify({ success: true, message: 'Successfully subscribed!' }), { status: 200 });
}

async function handleGet(req: Request): Promise<Response> {
    if (!isAuthenticated(req)) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Subscriptions!A:B',
    });

    const rows = response.data.values || [];
    if (rows.length < 2) {
        return new Response(JSON.stringify([]), { status: 200 });
    }

    const subscriptions = rows.slice(1).map(row => ({
        date: row[0],
        email: row[1],
    }));

    return new Response(JSON.stringify(subscriptions), { status: 200 });
}
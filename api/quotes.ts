import { google } from 'googleapis';
import { SubmittedQuote, QuoteStatus } from '../types';

// This is a Vercel Serverless Function
// Handles GET, POST, PUT for /api/quotes

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
        // This simple check confirms the user has logged in successfully during their session.
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
            case 'PUT':
                return handlePut(req);
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
    const { contact, items } = await req.json();

    if (!contact || !contact.name || !contact.email) {
        return new Response(JSON.stringify({ message: 'Contact information is required.' }), { status: 400 });
    }
    
    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');
    const quoteId = `QT-${Date.now()}`;
    const submissionDate = new Date().toISOString();
    const itemsJsonString = JSON.stringify(items, null, 2);

    const newRow = [
        quoteId,
        submissionDate,
        'New', // Default status
        contact.name,
        contact.email,
        contact.phone || '',
        contact.company || '',
        contact.message || '',
        itemsJsonString
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Quotes!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRow] },
    });

    return new Response(JSON.stringify({ success: true, message: 'Quote submitted.' }), { status: 200 });
}


async function handleGet(req: Request): Promise<Response> {
    if (!isAuthenticated(req)) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Quotes!A:I', // Assuming 9 columns
    });

    const rows = response.data.values || [];
    if (rows.length < 2) { // Header only or empty
        return new Response(JSON.stringify([]), { status: 200 });
    }

    const quotes: SubmittedQuote[] = rows.slice(1).map(row => ({
        id: row[0],
        submissionDate: row[1],
        status: row[2] as QuoteStatus,
        contact: {
            name: row[3],
            email: row[4],
            phone: row[5],
            company: row[6],
            message: row[7],
        },
        items: JSON.parse(row[8] || '[]'),
    }));

    return new Response(JSON.stringify(quotes), { status: 200 });
}

async function handlePut(req: Request): Promise<Response> {
    if (!isAuthenticated(req)) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { quoteId, status } = await req.json();
    if (!quoteId || !status) {
        return new Response(JSON.stringify({ message: 'quoteId and status are required.' }), { status: 400 });
    }
    
    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Quotes!A:A', // Get all IDs in column A
    });

    const rows = response.data.values || [];
    // Find the 1-based index of the row to update
    const rowIndex = rows.findIndex(row => row[0] === quoteId) + 1;
    
    if (rowIndex === 0) { // findIndex returns -1 if not found
        return new Response(JSON.stringify({ message: 'Quote not found.' }), { status: 404 });
    }
    
    // Update the status in column C of the found row
    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Quotes!C${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[status]] },
    });

    return new Response(JSON.stringify({ success: true, message: `Quote ${quoteId} status updated.` }), { status: 200 });
}
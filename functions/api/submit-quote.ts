import { GoogleSpreadsheet } from 'google-spreadsheet';

// Basic interface for the expected quote data
interface QuoteData {
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  message: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

// Environment variable interface
interface Env {
  GOOGLE_SHEET_ID: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const quoteData: QuoteData = await request.json();

    // 1. Authenticate with Google Sheets
    const doc = new GoogleSpreadsheet(env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
    });

    // 2. Load Sheet and Add Row
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Quotes']; // Make sure your sheet is named 'Quotes'

    if (!sheet) {
      return new Response('Google Sheet tab named "Quotes" not found.', { status: 500 });
    }

    const newRow = {
      'Quote ID': new Date().toISOString(), // Simple unique ID
      'Submission Date': new Date().toLocaleString(),
      'Status': 'New',
      'Name': quoteData.contact.name,
      'Email': quoteData.contact.email,
      'Phone': quoteData.contact.phone,
      'Company': quoteData.contact.company,
      'Message': quoteData.message,
      'Items': quoteData.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', '),
    };

    await sheet.addRow(newRow);

    return new Response(JSON.stringify({ message: 'Quote submitted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error submitting quote:', error);
    return new Response(JSON.stringify({ message: 'Failed to submit quote.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

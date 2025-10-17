import { GoogleGenAI, Type } from "@google/genai";

// This is a Vercel Serverless Function
// POST /api/gemini
// It handles requests to the Gemini API.

export const config = {
  runtime: 'edge', // This can run on the edge as it's a simple fetch
};

// Helper to check for admin authentication
async function isAuthenticated(req: Request): Promise<boolean> {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const expectedToken = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
        return token === expectedToken;
    }
    return false;
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    // This is a protected route, only admins can use the generator.
    if (!(await isAuthenticated(req))) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    
    // Get API Key from environment
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is not set in environment variables.");
        return new Response(JSON.stringify({ message: 'Server configuration error: Missing API Key.' }), { status: 500 });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const body = await req.json();
        const { type, payload } = body;

        if (type === 'description') {
            const { productName, category } = payload;
            if (!productName || !category) {
                 return new Response(JSON.stringify({ message: 'Product name and category are required.' }), { status: 400 });
            }
            const prompt = `Generate a compelling, short marketing description for a product.
            Product Name: ${productName}
            Category: ${category}
            The description should be about 2-3 sentences long, highlighting its key features and benefits in an engaging tone. Do not use markdown or special formatting.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            return new Response(JSON.stringify({ text: response.text.trim() }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (type === 'review') {
            const { keywords } = payload;
            if (!keywords) {
                 return new Response(JSON.stringify({ message: 'Keywords are required.' }), { status: 400 });
            }
            const prompt = `Generate a realistic-sounding customer review based on these keywords: "${keywords}".
            The review should be positive and sound authentic. Include a plausible-sounding author name (e.g., a person's name or a company name).
            Format the output as JSON.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            author: {
                                type: Type.STRING,
                                description: "The name of the person or company leaving the review.",
                            },
                            quote: {
                                type: Type.STRING,
                                description: "The content of the review, written from the customer's perspective.",
                            },
                        },
                        required: ["author", "quote"],
                    },
                },
            });
            
            // The response.text is already a JSON string because of the config.
            return new Response(response.text, { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else {
            return new Response(JSON.stringify({ message: 'Invalid generation type specified.' }), { status: 400 });
        }

    } catch (error: any) {
        console.error("Gemini API error:", error);
        return new Response(JSON.stringify({ message: 'An error occurred with the AI service.', error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

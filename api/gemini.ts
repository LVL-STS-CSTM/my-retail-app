
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
    // For the AI Advisor, we don't require admin authentication.
    const isPotentiallyAdminRequest = req.headers.get('Authorization')?.startsWith('Bearer ');

    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }
    
    // FIX: Guideline states to use process.env.API_KEY directly in initialization.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is not set in environment variables.");
        return new Response(JSON.stringify({ message: 'Server configuration error: Missing API Key.' }), { status: 500 });
    }

    try {
        // FIX: Always use a named parameter for initialization and obtain key exclusively from process.env.API_KEY.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const body = await req.json();
        const { type, payload } = body;

        // Admin-only requests must be authenticated
        if (type === 'description' || type === 'review') {
            if (!(await isAuthenticated(req))) {
                return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
            }
        }

        if (type === 'description') {
            const { productName, category } = payload;
            if (!productName || !category) {
                 return new Response(JSON.stringify({ message: 'Product name and category are required.' }), { status: 400 });
            }
            const prompt = `Generate a compelling, short marketing description for a product.
            Product Name: ${productName}
            Category: ${category}
            The description should be about 2-3 sentences long, highlighting its key features and benefits in an engaging tone. Do not use markdown or special formatting.`;

            // FIX: Use gemini-3-flash-preview for basic text tasks.
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            // FIX: Directly access response.text property.
            return new Response(JSON.stringify({ text: response.text?.trim() }), { 
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

            // FIX: Use gemini-3-flash-preview for text tasks and access .text directly.
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
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
        
        } else if (type === 'advisor') {
            const { messages, products } = payload;
            if (!messages || !products) {
                return new Response(JSON.stringify({ message: 'Messages and product context are required.' }), { status: 400 });
            }

            const productContext = JSON.stringify(
                products.map((p: any) => ({ 
                    id: p.id, 
                    name: p.name, 
                    description: p.description,
                    category: p.category,
                    categoryGroup: p.categoryGroup,
                    gender: p.gender,
                }))
            );

            const conversationHistory = messages
                .map((m: any) => `${m.sender === 'user' ? 'User' : 'Advisor'}: ${m.text}`)
                .join('\n\n');

            const prompt = `Based on this, provide a helpful and relevant response to the last user message.`;
            
            // FIX: Use gemini-3-flash-preview for text tasks and access .text directly.
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    { role: 'user', parts: [{ text: conversationHistory }, { text: prompt }] }
                ],
                config: {
                    systemInstruction: `You are a friendly and professional Product Advisor for LEVEL CUSTOMS, a custom apparel company. Your goal is to help users find the perfect product for their needs from the provided catalogue. Be helpful, concise, and guide users towards making a selection. If a user asks about a product, use its name to find it in the catalogue. Do not invent products or features not listed in the provided data. If you are unsure, ask clarifying questions or suggest browsing the full catalogue.

                    Here is the available product catalogue in JSON format:
                    ${productContext}`
                }
            });

            return new Response(JSON.stringify({ text: response.text?.trim() }), { 
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

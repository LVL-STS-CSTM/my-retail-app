import { GoogleGenAI, Type } from "@google/genai";

interface Env {
  CONTENT_KV: any;
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;

  // REQUIREMENT: API key must be obtained exclusively from process.env.API_KEY.
  // Note: This requires the 'nodejs_compat' flag to be enabled in Cloudflare Settings.
  if (!process.env.API_KEY) {
    return new Response(JSON.stringify({ message: 'Server configuration error: Missing API_KEY in Environment Variables.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: any = await request.json();
    const { type, payload } = body;
    
    // REQUIREMENT: Always use a named parameter for apiKey initialization.
    // REQUIREMENT: Create a new instance right before making the call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Admin auth check for description and review generation
    if (type === 'description' || type === 'review') {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      const storedCredsRaw = await env.CONTENT_KV.get('credential');
      if (!storedCredsRaw) return new Response(JSON.stringify({ message: 'Unauthorized: Admin config missing' }), { status: 401 });
      const storedCreds = JSON.parse(storedCredsRaw);
      const expectedToken = `${storedCreds.username}:${storedCreds.password}`;
      
      if (token !== expectedToken) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
      }
    }

    if (type === 'description') {
      const { productName, category } = payload;
      // REQUIREMENT: Basic text tasks use 'gemini-3-flash-preview'
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a compelling marketing description for ${productName} in the ${category} category. Keep it to 2-3 sentences. No markdown formatting.`,
      });
      // REQUIREMENT: Access .text property directly (not a method).
      return new Response(JSON.stringify({ text: response.text?.trim() }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } else if (type === 'review') {
      const { keywords } = payload;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a positive customer review based on these keywords: ${keywords}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING },
              quote: { type: Type.STRING },
            },
            required: ["author", "quote"],
          },
        },
      });
      return new Response(response.text, { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } else if (type === 'advisor') {
      const { messages, products } = payload;
      const productContext = JSON.stringify(products.map((p: any) => ({ 
        name: p.name, 
        desc: p.description, 
        cat: p.category 
      })));

      // REQUIREMENT: Complex text tasks (like product recommendation) use 'gemini-3-pro-preview'
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: messages.map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are an expert B2B apparel advisor for LEVEL CUSTOMS. Your tone is professional and concise. Help customers select products based on their needs using this catalogue context: ${productContext}`
        }
      });

      return new Response(JSON.stringify({ text: response.text?.trim() }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Invalid Request Type', { status: 400 });

  } catch (error: any) {
    console.error("Gemini Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
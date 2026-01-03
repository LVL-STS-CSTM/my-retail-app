import { GoogleGenAI, Type } from "@google/genai";

interface Env {
  CONTENT_KV: any;
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;

  // REQUIREMENT: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  if (!process.env.API_KEY) {
    return new Response(JSON.stringify({ 
      message: 'Server configuration error: API_KEY not found. Please ensure it is set in the Cloudflare Dashboard Secrets.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: any = await request.json();
    const { type, payload } = body;
    
    // REQUIREMENT: Always use a named parameter for initialization: new GoogleGenAI({ apiKey: ... })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Admin authentication check for management tasks
    if (type === 'description' || type === 'review') {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      const storedCredsRaw = await env.CONTENT_KV.get('credential');
      if (!storedCredsRaw) return new Response(JSON.stringify({ message: 'Unauthorized: No admin config' }), { status: 401 });
      const storedCreds = JSON.parse(storedCredsRaw);
      const expectedToken = `${storedCreds.username}:${storedCreds.password}`;
      
      if (token !== expectedToken) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
      }
    }

    if (type === 'description') {
      const { productName, category } = payload;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a professional, compelling marketing description for a ${productName} in the ${category} category. Keep it to 2-3 high-impact sentences. No markdown.`,
      });
      return new Response(JSON.stringify({ text: response.text?.trim() }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } else if (type === 'review') {
      const { keywords } = payload;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a realistic, positive B2B customer review for apparel based on these keywords: ${keywords}`,
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
        cat: p.category,
        group: p.categoryGroup
      })));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: messages.map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are the LEVEL CUSTOMS AI Advisor. Your tone is professional, helpful, and high-end B2B. Use this product context to make recommendations: ${productContext}. Focus on quality, local craftsmanship, and bulk solutions.`
        }
      });

      return new Response(JSON.stringify({ text: response.text?.trim() }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method Not Allowed', { status: 405 });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
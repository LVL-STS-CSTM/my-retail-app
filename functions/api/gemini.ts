
// functions/api/gemini.ts
import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";

// This is a Vercel Edge Function
export const config = {
  runtime: 'edge',
};

// System instruction for the AI model
const systemInstruction = `
You are an expert AI assistant for a high-end custom apparel and merchandise company called LEVEL CUSTOMS.
Your goal is to help users find the perfect products for their needs, whether for a team, company, or event.
You should be enthusiastic, helpful, and knowledgeable about the products.
You have access to a list of all products in JSON format.
Your primary function is to recommend products based on user queries.

When a user asks for a recommendation:
1.  Analyze their request to understand key requirements (e.g., "jerseys for a basketball team," "hats for a corporate event," "eco-friendly t-shirts").
2.  Use the provided product data to find the most suitable items.
3.  Present your recommendations clearly, including the product name and a brief, compelling description of why it fits the user's needs.
4.  You MUST provide the product ID for each recommended product.
5.  If the user's query is vague, ask clarifying questions to narrow down the options (e.g., "What sport is the team?," "Are you looking for a specific style of hat?," "What's your budget per item?").
6.  If the query is outside the scope of product recommendations (e.g., asking for a weather forecast), politely decline and steer the conversation back to finding them great custom gear.
7.  Keep your responses concise and easy to read. Use bullet points for lists of products.
8.  Do not just list products. Explain WHY you are recommending them based on the user's query and the product's attributes.
9.  Always be friendly and use the company name, LEVEL CUSTOMS, where appropriate.
10. Do not include price unless asked.
11. If the user asks a question about the company, the website, or how to do something, use your best judgment to answer based on the persona of a helpful assistant. You can infer information from the product data (e.g., what types of products are sold).
12. Your knowledge is limited to the provided product data. Do not make up products or features.
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { history, products } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return new Response('Invalid chat history', { status: 400 });
    }
     if (!products || !Array.isArray(products)) {
      return new Response('Invalid products data', { status: 400 });
    }

    const apiKey = '';
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-preview", // Use a valid and available model name
      systemInstruction: `${systemInstruction}

Here is the product data in JSON format:
${JSON.stringify(products, null, 2)}`,
    });

    // Vercel Edge functions time out after 15 seconds. Let's be safe.
    const timeout = 14000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const chatHistory: Content[] = history.map((msg: { role: string; parts: { text: string }[] }) => ({
        role: msg.role,
        parts: msg.parts.map(part => ({ text: part.text })),
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 1,
        topK: 32,
      },
    });
    
    const lastMessage = history[history.length - 1];
    const userMessage = lastMessage.parts.map((part: { text: string }) => part.text).join('');

    const result = await chat.sendMessage(userMessage, { signal: controller.signal });
    
    clearTimeout(timeoutId); // Clear the timeout if the request succeeds

    const response = result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
       console.error("Gemini request timed out");
       return new Response(JSON.stringify({ error: 'The request timed out. Please try again.' }), { status: 504 });
    }
    console.error("Error processing Gemini request:", error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.', details: error.message }), { status: 500 });
  }
}

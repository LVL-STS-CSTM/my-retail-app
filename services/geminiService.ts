
import { GoogleGenAI, Type } from "@google/genai";

// FIX: Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * @description Generates a product description using the Gemini API.
 * @param {string} productName - The name of the product.
 * @param {string} category - The category of the product.
 * @returns {Promise<string>} A compelling marketing description.
 */
export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    const prompt = `Generate a compelling, short marketing description for a product.
    Product Name: ${productName}
    Category: ${category}
    The description should be about 2-3 sentences long, highlighting its key features and benefits in an engaging tone. Do not use markdown or special formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
};

/**
 * @description Generates a realistic brand review using the Gemini API.
 * @param {string} keywords - Keywords or a theme for the review.
 * @returns {Promise<{ author: string; quote: string }>} An object containing the author and quote.
 */
export const generateBrandReview = async (keywords: string): Promise<{ author: string; quote: string }> => {
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

    try {
        const json = JSON.parse(response.text);
        if (json.author && json.quote) {
            return json;
        }
        throw new Error("Invalid JSON response from AI");
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", response.text, e);
        // Fallback or re-try logic could go here. For now, throw.
        throw new Error("Failed to generate a valid review from AI.");
    }
};

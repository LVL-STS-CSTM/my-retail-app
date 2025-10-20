// This service now acts as a client-side wrapper for our backend's Gemini API endpoint.
import { Message, Product } from '../types';

/**
 * @description Generates a product description by calling our secure backend endpoint.
 * @param {string} productName - The name of the product.
 * @param {string} category - The category of the product.
 * @returns {Promise<string>} A compelling marketing description.
 */
export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    try {
        const token = `${sessionStorage.getItem('adminUser')}:${sessionStorage.getItem('adminPass')}`;
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'description',
                payload: { productName, category }
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate description from server.');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Error in generateProductDescription service:", error);
        throw error;
    }
};

/**
 * @description Generates a realistic brand review by calling our secure backend endpoint.
 * @param {string} keywords - Keywords or a theme for the review.
 * @returns {Promise<{ author: string; quote: string }>} An object containing the author and quote.
 */
export const generateBrandReview = async (keywords: string): Promise<{ author: string; quote: string }> => {
    try {
        const token = `${sessionStorage.getItem('adminUser')}:${sessionStorage.getItem('adminPass')}`;
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'review',
                payload: { keywords }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate review from server.');
        }
        
        // The response from our API is already the JSON we need
        return await response.json();

    } catch (error) {
        console.error("Error in generateBrandReview service:", error);
        throw error;
    }
};

/**
 * @description Gets a response from the AI Product Advisor.
 * @param {Message[]} messages - The current conversation history.
 * @param {Product[]} products - The full product catalogue for context.
 * @returns {Promise<string>} The AI's response text.
 */
export const getAdvisorResponse = async (messages: Message[], products: Product[]): Promise<string> => {
    try {
        // This endpoint is public and does not require an auth token.
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'advisor',
                payload: { messages, products }
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get response from advisor.');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Error in getAdvisorResponse service:", error);
        // Return a user-friendly error message
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
};

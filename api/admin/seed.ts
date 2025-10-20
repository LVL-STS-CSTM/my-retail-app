import { kv } from '@vercel/kv';
import { initialProductsData, initialCollectionsData } from '../../context/initialProductData';
import { 
    initialFaqData, 
    initialHeroData, 
    initialPartnerData, 
    initialHowWeWorkData, 
    initialMaterialData, 
    initialInfoCardData, 
    initialFeaturedVideoData, 
    initialBrandReviewData, 
    initialPlatformRatingData, 
    initialAthleteData, 
    initialCommunityPostData 
} from '../../context/initialContentData';

// This is a Vercel Serverless Function
// GET /api/admin/seed
// It uses Basic Auth for one-time setup protection.

export const config = {
  runtime: 'edge',
};

const DATA_TO_SEED = {
    products: initialProductsData,
    collections: initialCollectionsData,
    faqs: initialFaqData,
    heroContents: initialHeroData,
    partners: initialPartnerData,
    howWeWorkSections: initialHowWeWorkData,
    materials: initialMaterialData,
    infoCards: initialInfoCardData,
    featuredVideoContent: initialFeaturedVideoData,
    brandReviews: initialBrandReviewData,
    platformRatings: initialPlatformRatingData,
    athletes: initialAthleteData,
    communityPosts: initialCommunityPostData,
};

export default async function handler(req: Request): Promise<Response> {
    // --- Basic Authentication Check ---
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return new Response('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
        });
    }
    
    // FIX: Use atob() for Edge runtime compatibility instead of Buffer
    const auth = atob(authHeader.split(' ')[1]);
    const [user, pass] = auth.split(':');
    
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (user !== ADMIN_USERNAME || pass !== ADMIN_PASSWORD) {
        return new Response('Invalid credentials', { status: 401 });
    }

    // --- Seeding Logic ---
    try {
        const pipeline = kv.pipeline();
        let count = 0;
        
        for (const [key, data] of Object.entries(DATA_TO_SEED)) {
            pipeline.set(key, data);
            count++;
        }

        await pipeline.exec();

        const successMessage = `
            <h1>Database Seeding Successful!</h1>
            <p>Successfully seeded ${count} data keys into your Vercel KV store.</p>
            <p><strong>Keys loaded:</strong> ${Object.keys(DATA_TO_SEED).join(', ')}</p>
            <p>Your website content is now live. You can now manage it from the Admin Dashboard.</p>
            <p style="color: red; font-weight: bold;">For security, consider removing this API file (\`/api/admin/seed.ts\`) from your project after this initial setup.</p>
        `;
        
        return new Response(successMessage, { 
            status: 200, 
            headers: { 'Content-Type': 'text/html' }
        });

    } catch (error: any) {
        console.error("Failed to seed database:", error);
        return new Response(`<h1>Seeding Failed</h1><p>An error occurred: ${error.message}</p>`, { 
            status: 500, 
            headers: { 'Content-Type': 'text/html' }
        });
    }
}
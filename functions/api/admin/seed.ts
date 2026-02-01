
import { initialProductsData, initialCollectionsData } from '../../../context/initialProductData';
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
} from '../../../context/initialContentData';

interface Env {
  CONTENT_KV: any;
}

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

export const onRequestGet = async (context: { env: Env; request: Request }) => {
    const { env } = context;
    
    try {
        for (const [key, data] of Object.entries(DATA_TO_SEED)) {
            await env.CONTENT_KV.put(key, JSON.stringify(data));
        }
        return new Response('Database seeded successfully on Cloudflare KV.', { status: 200 });
    } catch (err: any) {
        return new Response(err.message, { status: 500 });
    }
};

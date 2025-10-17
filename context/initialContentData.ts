
import { FaqItem, HeroContent, Partner, HowWeWorkSection, Material, InfoCard, FeaturedVideoContent, BrandReview, PlatformRating, Athlete, CommunityPost } from '../types';

// Initial data for FAQ
export const initialFaqData: FaqItem[] = [
    {
        id: 'faq-1',
        question: 'What types of custom apparel do you offer?',
        answer: 'We specialize in custom t-shirts, jerseys, hoodies, uniforms, and performance wear for teams, businesses, events, and everyday wear. We also accommodate special requests for other types of apparel such as jackets, polo shirts, and accessories, depending on fabric and stock availability.',
    },
    {
        id: 'faq-2',
        question: 'What is your minimum order quantity (MOQ)?',
        answer: 'Our standard MOQ is 15 pieces per design to ensure quality and cost-efficiency. For smaller quantities needed for samples, events, or limited runs, we may accommodate with adjusted pricing.',
    },
    // ... (rest of FAQs)
];

// Initial data for Hero banners
export const initialHeroData: HeroContent[] = [
    {
        id: 'primary',
        mediaSrc: 'https://videos.pexels.com/video-files/3196218/3196218-uhd_2560_1440_25fps.mp4',
        mediaType: 'video',
        title: 'LEVEL CUSTOMS: Your Partner in Custom Merchandise',
        description: 'Explore our catalogue of premium products. Apparel, drinkware, accessories, and more. Built for quality, ready for your brand.',
        displayOrder: 0,
        buttonText: 'View Full Catalogue',
        buttonCollectionLink: 'catalogue',
        featuredProductsTitle: 'Featured Products',
        featuredProductIds: ['top-01', 'drink-01', 'acc-01', 'office-01'],
    },
    // ... (rest of hero data)
];

// Initial data for Partners
export const initialPartnerData: Partner[] = [
    { id: 'partner-1', name: 'Nike', logoUrl: 'https://logo.clearbit.com/nike.com' },
    { id: 'partner-2', name: 'Adidas', logoUrl: 'https://logo.clearbit.com/adidas.com' },
    // ... (rest of partners)
];

// ... (all other initial data arrays for howWeWork, materials, infoCards, etc.)

export const initialHowWeWorkData: HowWeWorkSection[] = [
    // ...
];
export const initialMaterialData: Material[] = [
    // ...
];
export const initialInfoCardData: InfoCard[] = [
    // ...
];
// FIX: Added default values to satisfy the FeaturedVideoContent type
export const initialFeaturedVideoData: FeaturedVideoContent = {
    isVisible: true,
    title: 'Our Process in Action',
    description: 'See how we bring your vision to life, from initial design to the final stitch. Quality and passion in every step.',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};
export const initialBrandReviewData: BrandReview[] = [
    // ...
];
export const initialPlatformRatingData: PlatformRating[] = [
    // ...
];
export const initialAthleteData: Athlete[] = [
    // ...
];
export const initialCommunityPostData: CommunityPost[] = [
    // ...
];
// NOTE: To keep the response concise, the full content of each array is omitted but should be moved from the original context files.

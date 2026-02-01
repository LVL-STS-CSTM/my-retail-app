
// types.ts

// Represents a single product in the catalogue
export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    imageUrl: string;
    stockType: 'on-hand' | 'custom-order'; // Added to differentiate product types
    tags: string[];
    colors: ProductColor[];
    customizationOptions: CustomizationOption[];
}

// Represents a color variant for a product
export interface ProductColor {
    name: string;
    hex: string;
}

// Represents a type of customization available for a product (e.g., Embroidery, Heat Transfer)
export interface CustomizationOption {
    type: string;
    areas: CustomizationArea[];
}

// Represents a specific area on the product where customization can be applied (e.g., Front, Back, Sleeve)
export interface CustomizationArea {
    name: string;
    description: string;
    imageUrl: string;
}

// Represents an item added to the quote request
export interface QuoteItem {
    quoteItemId: string;
    product: Product;
    selectedColor: ProductColor;
    sizeQuantities: { [size: string]: number };
    customizations: Customization[];
}

// Represents a single customization detail for a quote item
export interface Customization {
    area: string;
    type: string;
    notes: string;
    artworkUrl?: string; // Optional URL for uploaded artwork
}

// Represents a collection of products (e.g., 'Jerseys', 'T-Shirts')
export interface Collection {
    id: string;
    name: string;
    description: string;
    productIds: string[];
}

// Represents a FAQ item
export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

// Represents the content for a hero banner
export interface HeroContent {
    id: string;
    mediaSrc: string;
    mediaType: 'image' | 'video';
    title: string;
    description: string;
    displayOrder: number;
    buttonText?: string;
    buttonCollectionLink?: string;
    featuredProductsTitle?: string;
    featuredProductIds?: string[];
}

// Represents a partner brand
export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
}

// Represents the 'How We Work' section content
export interface HowWeWorkSection {
    title: string;
    subtitle: string;
    steps: { step: number; title: string; description: string }[];
}

// Represents a material used in products
export interface Material {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}

// Represents a generic information card
export interface InfoCard {
    id: string;
    title: string;
    subtitle: string;
    theme: 'light' | 'dark';
    items?: { title: string; description: string; icon: string }[];
    steps?: { step: number; title: string; description: string }[];
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
}

// Represents content for a featured video section
export interface FeaturedVideoContent {
    isVisible: boolean;
    title: string;
    description: string;
    youtubeVideoUrl: string;
}

// Represents a brand review
export interface BrandReview {
    id: string;
    author: string;
    review: string;
    rating: number;
    imageUrl?: string;
}

// Represents a platform rating (e.g., from Google)
export interface PlatformRating {
    platform: string;
    rating: number;
    reviewCount: number;
    link: string;
}

// Represents a featured athlete
export interface Athlete {
    id: string;
    name: string;
    sport: string;
    team: string;
    imageUrl: string;
    bio: string;
}

// Represents a post from the community/social media
export interface CommunityPost {
    id: string;
    platform: 'Instagram' | 'Facebook' | 'Twitter';
    username: string;
    caption: string;
    postUrl: string;
    imageUrl: string;
    likes: number;
    comments: number;
}

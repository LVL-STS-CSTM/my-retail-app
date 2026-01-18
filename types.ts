
/**
 * @interface Color
 * @description Represents a color option for a product.
 * @property {string} name - The user-facing name of the color (e.g., "Navy").
 * @property {string} hex - The hexadecimal code for the color (e.g., "#000080").
 */
export interface Color {
    name: string;
    hex: string;
}

/**
 * @interface ProductSize
 * @description Represents a size option with specific dimensions.
 * @property {string} name - The user-facing name of the size (e.g., "M" or "32").
 * @property {number} width - The width measurement (e.g., in inches).
 * @property {number} length - The length measurement (e.g., in inches).
 */
export interface ProductSize {
    name: string;
    width: number;
    length: number;
}

/**
 * @interface Product
 * @description Represents a single product in the catalogue.
 * @property {string} id - A unique identifier for the product.
 * @property {string} name - The display name of the product.
 * @property {{ [colorName: string]: string[] }} imageUrls - A dictionary of image URLs, keyed by color name.
 * @property {string} url - A placeholder for a direct product link (not currently used).
 * @property {boolean} isBestseller - Flag to identify featured products.
 * @property {string} description - A detailed description of the product.
 * @property {ProductSize[]} availableSizes - An array of available size options with dimensions.
 * @property {Color[]} availableColors - An array of available color options.
 * @property {string} category - The specific category the product belongs to (e.g., "Tops").
 * @property {string} categoryGroup - The broader group for navigation purposes (e.g., "Apparel").
 * @property {'Men' | 'Women' | 'Unisex'} gender - The target gender for the product.
 * @property {number} displayOrder - The order in which the product should be displayed.
 * @property {string} [materialId] - Optional ID to link to a specific material technology.
 * @property {number} [moq] - Optional per-product Minimum Order Quantity.
 * @property {number} price - Optional price for sorting purposes.
 * @property {string[]} colors - An array of available color names.
 * @property {string[]} [tags] - Optional tags for filtering.
 * @property {any} [details] - Optional additional product details.
 */
export interface Product {
    id: string;
    name: string;
    imageUrls: { [colorName: string]: string[] };
    url: string;
    isBestseller: boolean;
    description: string;
    availableSizes: ProductSize[];
    availableColors: Color[];
    category: string;
    categoryGroup: string;
    gender: 'Men' | 'Women' | 'Unisex';
    displayOrder: number;
    materialId?: string;
    moq?: number;
    price: number;
    colors: string[];
    tags?: string[];
    details?: any;
    // FIX: Added missing properties for the Mockup Generator feature
    mockupImageUrl?: string;
    mockupArea?: { top: number; left: number; width: number; height: number };
}

/**
 * @interface QuoteItem
 * @description Represents an item that has been added to the user's quote request list.
 * It contains the product details along with the user's specific customizations.
 */
export interface QuoteItem {
    quoteItemId: string; // Unique ID for this specific quote configuration (e.g., productID + color)
    product: Product;
    selectedColor: Color;
    sizeQuantities: { [key: string]: number };
    logoFile?: File;
    designFile?: File;
    customizations?: { name: string; number: string; size: string }[];
}

/**
 * @interface Material
 * @description Represents a single material or fabric.
 */
export interface Material {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    features: string[];
    careImageUrl?: string;
}

/**
 * @type View
 * @description Defines the possible page views for the application's router.
 */
// FIX: Added 'mockup-generator' to the View union type
export type View = 'home' | 'product' | 'catalogue' | 'about' | 'partners' | 'contact' | 'faq' | 'admin' | 'services' | 'terms-of-service' | 'return-policy' | 'privacy-policy' | 'materials' | 'athletes' | 'community' | 'how-we-work' | 'mockup-generator';

/**
 * @interface Message
 * @description Represents a single message in the AI Advisor chat.
 */
export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

/**
 * @interface Partner
 * @description Represents a partner company with a name and logo.
 */
export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
}

/**
 * @interface FaqItem
 * @description Represents a single question-answer pair for the FAQ page.
 */
export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

/**
 * @interface HeroContent
 * @description Represents the content for a hero banner section.
 */
export interface HeroContent {
    id: string;
    mediaSrc: string;
    mediaType: 'video' | 'image' | 'gif';
    title: string;
    description: string;
    buttonText?: string;
    buttonCollectionLink?: string; // Links to a product collection group OR a specific category
    displayOrder: number;
    featuredProductIds?: string[];
    featuredProductsTitle?: string;
}

/**
 * @interface HowWeWorkSection
 * @description Represents the content for a section on the "How We Work" page.
 */
export interface HowWeWorkSection {
    id: 'sample-testing' | 'small-batch' | 'sustainability';
    title: string;
    description: string;
    imageUrl: string;
}


/**
 * @type QuoteStatus
 * @description Defines the possible statuses for a submitted quote.
 */
export type QuoteStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';

/**
 * @interface SubmittedQuoteItem
 * @description A serializable version of a QuoteItem for storage.
 */
export interface SubmittedQuoteItem {
    product: Product;
    selectedColor: Color;
    sizeQuantities: { [key: string]: number };
    logoFilename?: string;
    designFilename?: string;
    customizations?: { name: string; number: string; size: string }[];
}

/**
 * @interface QuoteContact
 * @description Represents the contact information for a quote submission.
 */
export interface QuoteContact {
    name: string;
    email: string;
    company?: string;
    message?: string;
    phone: string;
}

/**
 * @interface SubmittedQuote
 * @description Represents a complete quote request submitted by a user.
 */
export interface SubmittedQuote {
    id: string;
    submissionDate: string;
    contact: QuoteContact;
    items: SubmittedQuoteItem[];
    status: QuoteStatus;
}

/**
 * @interface Subscription
 * @description Represents an email subscription.
 */
export interface Subscription {
    email: string;
    date: string;
}

/**
 * @interface EmailCampaign
 * @description Represents a sent marketing email campaign.
 */
export interface EmailCampaign {
    id: string;
    subject: string;
    content: string; // This will now store HTML content
    sentDate: string;
    recipientCount: number;
    recipientSegment: 'all' | 'recent';
}

/**
 * @type InfoCardLinkType
 * @description Defines the type of action a promotional info card can perform.
 */
export type InfoCardLinkType = 'page' | 'modal' | 'external';

/**
 * @interface InfoCard
 * @description Represents the data for one of the three promotional info cards on the homepage.
 * @property {'pursuit' | 'newsletter' | 'fabric'} id - A fixed ID for one of the three cards.
 * @property {string} title - The text displayed on the card (can include newlines).
 * @property {string} imageUrl - The URL for the background image.
 * @property {InfoCardLinkType} linkType - The type of link or action for the card.
 * @property {string} linkValue - The destination (e.g., 'about', 'subscribe', 'https://...').
 */
export interface InfoCard {
    id: 'pursuit' | 'newsletter' | 'fabric';
    title: string;
    imageUrl: string;
    linkType: InfoCardLinkType;
    linkValue: string;
}

/**
 * @interface FeaturedVideoContent
 * @description Represents the data for the featured YouTube video section on the homepage.
 */
export interface FeaturedVideoContent {
    isVisible: boolean;
    title: string;
    description: string;
    youtubeVideoUrl: string; // User can input watch?v= or youtu.be links
}

/**
 * @interface BrandReview
 * @description Represents a customer testimonial or review.
 */
export interface BrandReview {
    id: string;
    author: string;
    quote: string;
    rating: number; // A number from 1 to 5
    isVisible: boolean;
    imageUrl?: string;
}

/**
 * @type PlatformName
 * @description The name of the review platform.
 */
export type PlatformName = 'Google' | 'Facebook' | 'Yelp' | 'Trustpilot' | 'LinkedIn';

/**
 * @interface PlatformRating
 * @description Represents an aggregate rating from a third-party platform.
 */
export interface PlatformRating {
    id: string;
    platform: PlatformName;
    rating: number; // A number from 1 to 5
    reviewCount: number;
    url: string; // Direct link to the reviews page
    isVisible: boolean;
}

/**
 * @interface Athlete
 * @description Represents a sponsored athlete.
 */
export interface Athlete {
    id: string;
    name: string;
    sport: string;
    imageUrl: string;
    bio: string;
    instagramHandle?: string;
}

/**
 * @type CommunityPostSource
 * @description The source of a community post.
 */
export type CommunityPostSource = 'Instagram' | 'Facebook' | 'Client Submission';

/**
 * @interface CommunityPost
 * @description Represents a post from the community gallery.
 */
export interface CommunityPost {
    id: string;
    imageUrl: string;
    caption: string;
    author: string;
    source: CommunityPostSource;
    taggedProductId?: string;
    isVisible: boolean;
}

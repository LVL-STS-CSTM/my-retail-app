
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
    {
        id: 'faq-3',
        question: 'How long will it take to get my order?',
        answer: 'Our standard lead time is 2-3 weeks from design approval and downpayment. For bulk orders, the timeline may be adjusted. Rush orders may be accommodated with an additional fee.',
    },
    {
        id: 'faq-4',
        question: 'Can I provide my own design?',
        answer: 'Absolutely! You can submit your own designs. We recommend providing them in high-resolution vector formats (like .AI or .EPS) for the best results. Our team can also help refine or digitize your existing designs if needed.',
    },
    {
        id: 'faq-5',
        question: 'What are your payment terms?',
        answer: 'We require a 50% downpayment to begin production and the remaining 50% balance upon completion, before dispatch. We accept various payment methods for your convenience.',
    }
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
    {
        id: 'secondary',
        mediaSrc: 'https://images.pexels.com/photos/7764617/pexels-photo-7764617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        mediaType: 'image',
        title: 'Built for Teams, Trusted by Brands',
        description: 'From local leagues to national brands, we deliver quality you can rely on. Your vision, our craft. Let\'s build something memorable.',
        displayOrder: 1,
        buttonText: 'See Our Work',
        buttonCollectionLink: 'catalogue',
        featuredProductsTitle: 'Popular Categories',
        featuredProductIds: ['jersey-01', 'hoodie-01', 'hat-01', 'bag-01'],
    },
];

// Initial data for Partners
export const initialPartnerData: Partner[] = [
    { id: 'partner-1', name: 'Gatorade', logoUrl: 'https://logo.clearbit.com/gatorade.com' },
    { id: 'partner-2', name: 'Red Bull', logoUrl: 'https://logo.clearbit.com/redbull.com' },
    { id: 'partner-3', name: 'Pocari Sweat', logoUrl: 'https://logo.clearbit.com/pocarisweat.com' },
    { id: 'partner-4', name: 'Under Armour', logoUrl: 'https://logo.clearbit.com/underarmour.com' },
    { id: 'partner-5', name: 'New Balance', logoUrl: 'https://logo.clearbit.com/newbalance.com' },
    { id: 'partner-6', name: 'Toyota', logoUrl: 'https://logo.clearbit.com/toyota.com' },
    { id: 'partner-7', name: 'Honda', logoUrl: 'https://logo.clearbit.com/honda.com' },
    { id: 'partner-8', name: 'Mitsubishi', logoUrl: 'https://logo.clearbit.com/mitsubishimotors.com' },
];

export const initialHowWeWorkData: HowWeWorkSection[] = [
    {
        title: "How It Works",
        subtitle: "We've refined our process to be as smooth and straightforward as possible, ensuring you feel confident and informed every step of the way.",
        steps: [
            {
                step: 1,
                title: "Consultations & Free Quotation",
                description: "Share your vision with our staff. We listen closely to your needs, propose initial design ideas, and then prepare a detailed and fair quotation based on the scope. Rest assured, our pricing is transparent, flexible, and always open for discussion."
            },
            {
                step: 2,
                title: "Design & Mockup",
                description: "We move beyond a simple idea. Our expert designers create digital mockups and artwork based on your specifications. This step is collaborative. We refine and adjust the designs until they perfectly match your vision and practical needs, guaranteeing approval before production begins."
            },
            {
                step: 3,
                title: "Produce & Perfect",
                description: "This is where it happens! Our skilled production team, composed of dedicated artisans, leverages equipment and meticulous attention to detail to expertly bring your approved design to life. We uphold the highest standards of craftsmanship to ensure every single garment is produced perfectly and efficiently."
            },
            {
                step: 4,
                title: "Assess & Deliver",
                description: "Before anything leaves our facility, every item undergoes a rigorous final quality check to ensure color accuracy, print integrity, and order correctness. Once approved, we carefully package and ship your order through reliable channels, ensuring it arrives safely, correctly, and right on time."
            }
        ]
    }
];

export const initialMaterialData: Material[] = [
    // ... (material data remains unchanged)
];

export const initialInfoCardData: InfoCard[] = [
    {
        id: 'customization-capabilities',
        title: 'Our Customization Capabilities',
        subtitle: 'Dito sa LEVEL, hindi kami basta-basta nagpi-print lang. We\'re all about the details! We combine pro techniques with real craftsmanship para gawing reality ang vision mo. Pulidong gawa at quality na pangmatagalan. No shortcuts, just pure quality! Yan ang tatak LEVEL!',
        theme: 'light',
        items: [
            {
                title: 'Heat Transfer',
                description: 'Bold prints ideal for high-volume orders. Graphics are cleanly applied with commercial heat, giving your designs a crisp, vibrant finish perfect for bulk production.',
                icon: 'flame'
            },
            {
                title: 'Embroidery',
                description: 'The standard of being premium. We stitch your design directly onto the fabric, creating a rich, textured 3D look that is incredibly resilient. The ultimate sign of quality!',
                icon: 'sparkles'
            },
            {
                title: 'Sublimation',
                description: 'Our fade-proof, crack-proof solution. We infuse the print directly into the fabric, allowing for all-over, photorealistic, and breathable designs that feel like part of the garment.',
                icon: 'switch-horizontal'
            },
            {
                title: 'Over-the-Fabric print',
                description: 'A versatile method that ensures any detailed full-color graphics is transferred with high detail and a durable, yet flexible finish on any fabric.',
                icon: 'photograph'
            }
        ]
    },
    {
        id: 'additional-services',
        title: 'Additional Services & Branding',
        subtitle: "We don\'t just stop at custom apparel! We offer a complete creative suite to make sure your brand looks consistent, professional, and totally unforgettable everywhere it appears. Think of us as your one-stop shop for merch, print, and all the details in between. Let\'s make your brand ready for the next LEVEL!",
        theme: 'dark',
        items: [
            {
                title: 'Graphic Design',
                description: "Let\'s build your brand from the ground up! We create custom logos, engaging marketing materials, and digital assets that truly represent your style.",
                icon: 'pencil'
            },
            {
                title: 'Corporate Branding',
                description: 'Elevate your corporate image with branded business cards, IDs, mugs, and other professional office essentials.',
                icon: 'office-building'
            },
            {
                title: 'Specialized Printing',
                description: 'Need more than just apparel? We got you! We handle high-quality printing for everything: business cards, event backdrops, large-format vinyl signage, and marketing flyers.',
                icon: 'printer'
            },
            {
                title: 'Specialized Apparel Finishes',
                description: 'Elevate your custom apparel with different finishes! We offer techniques like high-quality embroidery, specialized vinyl applications, and unique texture printing for a premium look and feel.',
                icon: 'star'
            }
        ]
    },
    {
        id: 'cta-quote',
        title: 'Ready to Create Something Exceptional?',
        subtitle: "Need mo ng garantisadong quality pero affordable? We\'re not just here to produce; we\'re here to make sure your brand comes to life with our craftsmanship and unparalleled service. Sulit from concept to delivery. Huwag kang mag-alala, we got this! We make sure na ang final product mo ay ready for next LEVEL",
        theme: 'light',
        items: [],
        primaryButtonText: 'Start Your Project',
        primaryButtonLink: '/quote',
        secondaryButtonText: 'Inquire Now!',
        secondaryButtonLink: '/contact'
    },
    {
        id: 'our-process',
        title: 'Our 5-Step Process',
        subtitle: "We’ve simplified the process so you can focus on the excitement of your custom gear. Dito, garantisado na sulit at maganda ang gawa! We\'re not just here to produce; we make sure your order is perfect, guaranteeing clarity and top-notch quality at every stage. Siguradong diretso sa next LEVEL ang branding mo!",
        theme: 'dark',
        steps: [
            {
                step: 1,
                title: "CONTACT",
                description: "Connect with us. Reach out through our contact number, social media, or email (Insert Contact page) us at levelcustomapparel@gmail.com. Just send over your initial idea and we’ll assist you from there. No design yet? No problem—we\'ll handle the creative work for you!"
            },
            {
                step: 2,
                title: "QUOTE",
                description: "After a quick chat about your order (quantities, materials, design complexity), we\'ll send over a detailed quote. Don\'t worry about Hidden charges! Our rates are always fair, negotiable, and transparent."
            },
            {
                step: 3,
                title: "DESIGN",
                description: "Our staff from LEVEL will be assisting you every step of the way. We\'ll create a dedicated group chat to iron out all the specifics (design, garment lineup, colors). We\'ll share the proposed designs for your final approval before production starts."
            },
            {
                step: 4,
                title: "PRODUCTION",
                description: "Time to bring it to life! A 50% downpayment is required to kick off production. Lead time is typically 2–3 weeks after design approval and payment. Once your order is ready, settle the remaining balance before dispatch."
            },
            {
                step: 5,
                title: "DISPATCH",
                description: "We\'ll dispatch your goods via courier and send you the tracking details right away! Need to check on your order? You can reach us via email, social media accounts or give us a call at [Phone Number]."
            }
        ]
    }
];

export const initialFeaturedVideoData: FeaturedVideoContent = {
    isVisible: true,
    title: 'Our Process in Action',
    description: 'See how we bring your vision to life, from initial design to the final stitch. Quality and passion in every step.',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

export const initialBrandReviewData: BrandReview[] = [
    // ... (brand review data remains unchanged)
];

export const initialPlatformRatingData: PlatformRating[] = [
    // ... (platform rating data remains unchanged)
];

export const initialAthleteData: Athlete[] = [
    // ... (athlete data remains unchanged)
];

export const initialCommunityPostData: CommunityPost[] = [
    // ... (community post data remains unchanged)
];

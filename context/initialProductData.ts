
import { Product, Collection } from '../types';

// The initial data that will be loaded if the database is empty.
export const initialProductsData: Product[] = [
    // --- Apparel ---
    {
        id: 'top-01',
        name: 'Classic Crew Neck T-Shirt',
        brand: 'Level Apparel',
        category: 'Tops',
        description: 'The quintessential t-shirt, perfected. Made from premium combed cotton for a soft feel and a perfect canvas for printing or embroidery. A reliable choice for any bulk order.',
        imageUrl: "https://i.pinimg.com/736x/4a/94/22/4a94225d4321ecc951e8af6634109137.jpg",
        stockType: 'on-hand', // available for immediate purchase
        tags: ['t-shirt', 'crew neck', 'unisex', 'cotton'],
        colors: [ { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#212121' }, { name: 'Heather Grey', hex: '#B2B2B2' }, { name: 'Navy', hex: '#000080' } ],
        customizationOptions: [
            { type: 'Heat Transfer', areas: [{ name: 'Front', description: 'Center chest print', imageUrl: '' }, { name: 'Back', description: 'Full back print', imageUrl: '' }] },
            { type: 'Embroidery', areas: [{ name: 'Left Chest', description: 'Logo embroidery', imageUrl: '' }] }
        ]
    },
    {
        id: 'jersey-01',
        name: 'Pro Performance Sports Jersey',
        brand: 'Level Sports',
        category: 'Jerseys',
        description: 'Engineered for performance. This jersey is made from lightweight, moisture-wicking fabric to keep you cool and dry. Fully customizable for team sports.',
        imageUrl: 'https://i.pinimg.com/736x/29/18/8c/29188c520a3233c03b1e732c253f5724.jpg',
        stockType: 'on-hand', // available for immediate purchase
        tags: ['jersey', 'sports', 'performance', 'teamwear'],
        colors: [ { name: 'Red', hex: '#FF0000' }, { name: 'Blue', hex: '#0000FF' }, { name: 'White', hex: '#FFFFFF' } ],
        customizationOptions: [
            { type: 'Sublimation', areas: [{ name: 'Full Body', description: 'All-over sublimation print', imageUrl: '' }] },
            { type: 'Heat Transfer', areas: [{ name: 'Front Number', description: 'Player number', imageUrl: '' }, { name: 'Back Name', description: 'Player name', imageUrl: '' }] }
        ]
    },
    {
        id: 'hoodie-01',
        name: 'Premium Pullover Hoodie',
        brand: 'Level Apparel',
        category: 'Hoodies',
        description: 'A cozy and stylish pullover hoodie made from a soft cotton-poly blend. Perfect for everyday wear or as part of a team uniform.',
        imageUrl: 'https://i.pinimg.com/736x/5f/c7/31/5fc731a89a3f1140b2067b57850028e3.jpg',
        stockType: 'custom-order',
        tags: ['hoodie', 'pullover', 'unisex', 'fleece'],
        colors: [ { name: 'Black', hex: '#212121' }, { name: 'Charcoal', hex: '#36454F' }, { name: 'Maroon', hex: '#800000' } ],
        customizationOptions: [
            { type: 'Embroidery', areas: [{ name: 'Left Chest', description: 'Logo embroidery', imageUrl: '' }] },
            { type: 'Heat Transfer', areas: [{ name: 'Back', description: 'Large back print', imageUrl: '' }, { name: 'Sleeve', description: 'Sleeve print', imageUrl: '' }] }
        ]
    }
    // ... add more products as needed, following the new structure
];

export const initialCollectionsData: Collection[] = [
    {
        id: 'all-apparel',
        name: 'All Apparel',
        description: 'Browse our full range of customizable apparel.',
        productIds: initialProductsData.map(p => p.id)
    },
    {
        id: 'on-hand-stock',
        name: 'On-Hand Stock',
        description: 'Products available for immediate purchase. No minimum order.',
        productIds: initialProductsData.filter(p => p.stockType === 'on-hand').map(p => p.id)
    },
    {
        id: 'custom-orders',
        name: 'Custom Orders',
        description: 'Products fully customizable for your team, brand, or event.',
        productIds: initialProductsData.filter(p => p.stockType === 'custom-order').map(p => p.id)
    }
];

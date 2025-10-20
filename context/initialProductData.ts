import { Product } from '../types';

// The initial data that will be loaded if the database is empty.
export const initialProductsData: Product[] = ([
    // --- Apparel ---
    {
        id: 'top-01',
        name: 'Classic Crew Neck T-Shirt',
        price: 25.00,
        imageUrls: {
            'White': [
                "https://i.pinimg.com/736x/4a/94/22/4a94225d4321ecc951e8af6634109137.jpg",
               "https://i.pinimg.com/1200x/7c/2a/32/7c2a329cdfdd7995b818ead38a0730df.jpg",
                "https://i.pinimg.com/1200x/a2/5f/24/a25f2486e92badceeac47ebdba7c0eb6.jpg",
            ],
            'Black': [
                "https://i.pinimg.com/736x/ab/a9/6e/aba96e5ee2287c3968c4d1220e97db3b.jpg",
                "https://i.pinimg.com/1200x/a6/67/35/a66735b243baa425c6aeb3924eb75412.jpg",
                "https://i.pinimg.com/1200x/d6/7d/db/d67ddb3b9de26573771ebfdfa2d92173.jpg",
            ],
            'Heather Grey': [],
            'Navy': [],
        },
        url: '#',
        isBestseller: true,
        description: 'The quintessential t-shirt, perfected. Made from premium combed cotton for a soft feel and a perfect canvas for printing or embroidery. A reliable choice for any bulk order.',
        availableSizes: [
            { name: 'XS', width: 16, length: 26 },
            { name: 'S', width: 18, length: 28 },
            { name: 'M', width: 20, length: 29 },
            { name: 'L', width: 22, length: 30 },
            { name: 'XL', width: 24, length: 31 },
            { name: 'XXL', width: 26, length: 32 },
        ],
        availableColors: [ { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#212121' }, { name: 'Heather Grey', hex: '#B2B2B2' }, { name: 'Navy', hex: '#000080' } ],
        category: 'Tops',
        categoryGroup: 'Apparel',
        gender: 'Unisex',
        materialId: 'fabric-1',
        mockupImageUrl: "https://i.pinimg.com/736x/4a/94/22/4a94225d4321ecc951e8af6634109137.jpg",
        mockupArea: { top: 30, left: 35, width: 30, height: 40 },
    },
    // ... (rest of initial product data objects)
] as Omit<Product, 'displayOrder'>[]).map((p, index) => ({ ...p, displayOrder: index }));

export const initialCollectionsData = Array.from(new Set(initialProductsData.map(p => p.categoryGroup))).sort();

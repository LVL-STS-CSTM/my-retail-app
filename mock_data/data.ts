
import { Product, ContentData } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Organic Cotton Tee',
    description: 'A classic t-shirt made from 100% organic ringspun cotton. Soft, comfortable, and eco-friendly.',
    collection: ['Tees', 'Basics'],
    basePrice: 25.00,
    materialId: 'mat_001',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
    ],
    sizes: [
      { name: 'S', additionalPrice: 0 },
      { name: 'M', additionalPrice: 0 },
      { name: 'L', additionalPrice: 2.50 },
      { name: 'XL', additionalPrice: 2.50 },
      { name: 'XXL', additionalPrice: 5.00 },
    ],
    imageUrls: {
        'White': [
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1620799140408-edc6d5d53355?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Black': [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586963351373-25199b93b3e8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Navy': [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
  },
  {
    id: 'prod_002',
    name: 'Recycled Polyester Hoodie',
    description: 'Stay warm in this cozy hoodie made from a blend of organic cotton and recycled polyester. Features a double-lined hood and front pouch pocket.',
    collection: ['Hoodies', 'Outerwear'],
    basePrice: 55.00,
    materialId: 'mat_002',
    colors: [
      { name: 'Heather Grey', hex: '#B2BEB5' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Forest Green', hex: '#228B22' },
    ],
    sizes: [
      { name: 'S', additionalPrice: 0 },
      { name: 'M', additionalPrice: 0 },
      { name: 'L', additionalPrice: 5.00 },
      { name: 'XL', additionalPrice: 5.00 },
    ],
     imageUrls: {
        'Heather Grey': [
            'https://images.unsplash.com/photo-1606115915090-be18f2404229?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Charcoal': [
             'https://images.unsplash.com/photo-1556107383-a1c499c5a24d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Forest Green': [
            'https://images.unsplash.com/photo-1599815152233-82a155452f14?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
  },
  {
    id: 'prod_003',
    name: 'Hemp Baseball Cap',
    description: 'A stylish and sustainable 6-panel cap made from durable hemp fabric. Features an adjustable strap for a perfect fit.',
    collection: ['Hats', 'Accessories'],
    basePrice: 30.00,
    materialId: 'mat_003',
    colors: [
      { name: 'Natural', hex: '#F5F5DC' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Black', hex: '#000000' },
    ],
    sizes: [
      { name: 'One Size', additionalPrice: 0 },
    ],
     imageUrls: {
        'Natural': [
            'https://images.unsplash.com/photo-1588796869812-32d829923a1a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Olive': [
            'https://images.unsplash.com/photo-1533893360-7063dfa33075?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Black': [
           'https://images.unsplash.com/photo-1534215754734-18e3d13e349e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
  },
    {
    id: 'prod_004',
    name: 'Performance Athletic Shorts',
    description: 'Lightweight, moisture-wicking shorts perfect for any workout. Made from a high-performance recycled synthetic blend.',
    collection: ['Activewear'],
    basePrice: 40.00,
    materialId: 'mat_004',
    colors: [
      { name: 'Graphite', hex: '#383428' },
      { name: 'Royal Blue', hex: '#4169E1' },
    ],
    sizes: [
        { name: 'S', additionalPrice: 0 },
        { name: 'M', additionalPrice: 0 },
        { name: 'L', additionalPrice: 0 },
        { name: 'XL', additionalPrice: 0 },
    ],
    imageUrls: {
       'Graphite': [
            'https://images.unsplash.com/photo-1591178598428-1bbf2c61099b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        'Royal Blue': [
            'https://images.unsplash.com/photo-1594499468122-811b7f809d84?q=80&w=1894&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
  },
];

export const initialContent: ContentData = {
  hero: {
    title: 'Sustainable Style, Delivered.',
    subtitle: 'High-quality, eco-friendly apparel for your brand, team, or personal style.',
    ctaButton: { text: 'Browse Products', link: '/collection/All' },
  },
  collections: ['Tees', 'Hoodies', 'Hats'],
  collectionInfo: {
      'Tees': {
        name: 'T-Shirts',
        description: 'Comfortable, stylish, and sustainable tees for every occasion.',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1784&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      'Hoodies': {
        name: 'Hoodies & Sweatshirts',
        description: 'Stay warm and cozy with our premium, eco-friendly hoodies.',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a6e69317505?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      'Hats': {
          name: 'Hats & Headwear',
          description: 'Top off your look with our stylish and sustainable hats.',
          imageUrl: 'https://images.unsplash.com/photo-1521369909019-2afaf982560a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
        'Activewear': {
          name: 'Activewear',
          description: 'High-performance gear that is good for you and the planet.',
          imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
       'Basics': {
          name: 'Everyday Basics',
          description: 'The essential building blocks for a sustainable wardrobe.',
          imageUrl: 'https://images.unsplash.com/photo-1563389234303-9037a3bb3a28?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
       'Accessories': {
          name: 'Accessories',
          description: 'The finishing touches for a complete, conscious look.',
          imageUrl: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
        'All': {
          name: 'All Products',
          description: 'Browse our full catalog of sustainable apparel and accessories.',
          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
  },
  collectionImages: {
      'Tees': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1784&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'Hoodies': 'https://images.unsplash.com/photo-1556821840-3a6e69317505?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'Hats': 'https://images.unsplash.com/photo-1521369909019-2afaf982560a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  materials: [
      {
          id: 'mat_001',
          name: 'Organic Ringspun Cotton',
          description: 'Grown without synthetic pesticides and fertilizers, organic cotton is soft, breathable, and hypoallergenic. Our ringspun process creates a stronger, smoother, and more durable yarn, perfect for premium t-shirts.',
          imageUrl: 'https://images.unsplash.com/photo-1606502391295-8240f25b84c8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          properties: {
              composition: '100% Organic Cotton',
              weight_gsm: 180,
              weave: 'Jersey Knit',
              certifications: 'GOTS, OEKO-TEX Standard 100'
          },
          bestFor: ['T-shirts', 'Everyday Wear', 'Sensitive Skin']
      },
      {
          id: 'mat_002',
          name: 'Recycled Polyester Fleece',
          description: 'A soft, warm, and durable fabric made from post-consumer recycled plastic bottles (rPET). It has excellent moisture-wicking properties and retains its shape well, making it ideal for hoodies and outerwear.',
          imageUrl: 'https://images.unsplash.com/photo-1628174923297-35d3d4993994?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          properties: {
              composition: '85% Organic Cotton, 15% Recycled Polyester',
              weight_gsm: 320,
              weave: 'Fleece',
              certifications: 'GRS (Global Recycled Standard), OCS Blended'
          },
           bestFor: ['Hoodies', 'Sweatshirts', 'Cold Weather']
      },
      {
          id: 'mat_003',
          name: 'Hemp Canvas',
          description: 'Hemp is a highly sustainable and durable natural fiber. It requires minimal water and no pesticides to grow. Our hemp canvas is strong, breathable, and becomes softer with each wash, making it perfect for hats and bags.',
          imageUrl: 'https://images.unsplash.com/photo-1594950953623-28c460d3c0cf?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          properties: {
              composition: '100% Hemp',
              weight_gsm: 280,
              weave: 'Canvas',
              certifications: 'European Flax'
          },
          bestFor: ['Hats', 'Bags', 'Durable Accessories']
      },
       {
          id: 'mat_004',
          name: 'Recycled Performance Blend',
          description: 'A high-tech blend of recycled nylon and spandex, designed for optimal performance. It offers 4-way stretch, excellent moisture management, and a lightweight feel for athletic activities.',
          imageUrl: 'https://images.unsplash.com/photo-1619961304115-802c3a5e3a3f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          properties: {
              composition: '90% Recycled Nylon, 10% Spandex',
              weight_gsm: 150,
              weave: 'Knit',
              certifications: 'GRS (Global Recycled Standard)'
          },
          bestFor: ['Activewear', 'Leggings', 'Workout Tops']
      }
  ],
  community: {
    title: 'Join the Aura Community',
    subtitle: 'Discover how brands and creators are bringing their visions to life with our sustainable apparel.',
    backgroundImage: 'https://images.unsplash.com/photo-1505240214841-336e65b50113?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ctaButton: { text: 'Explore Community', link: '/community' },
  },
  communityPosts: [
      { 
          title: 'Sunrise Coffee Co. Crewnecks', 
          description: 'Outfitting our baristas with the coziest, custom-embroidered hoodies from Aura.', 
          imageUrl: 'https://images.unsplash.com/photo-1621281318625-22d7335e2b83?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          link: '#'
      },
      {
          title: 'National Park Foundation Tees', 
          description: 'Our latest collection of park-themed tees, printed on Aura’s organic cotton.', 
          imageUrl: 'https://images.unsplash.com/photo-1632168996192-3693e59b6628?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          link: '#'
      },
      { 
          title: 'IndieFest 2024 Merch', 
          description: 'The official merch for this year's festival, featuring sustainable hats and tees.', 
          imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          link: '#'
       },
  ],
  about: {
    title: 'About Aura',
    subtitle: 'We believe in a future where apparel is made sustainably, ethically, and with purpose.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    missionStatement: 'Our mission is to make sustainable and ethical apparel accessible to everyone. We partner with certified manufacturers, use eco-friendly materials, and maintain transparent processes to provide high-quality products that you can feel good about. From small businesses to large organizations, we provide the canvas for your vision.',
    teamMembers: [
      { name: 'Alex Chen', role: 'Founder & CEO', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Maria Garcia', role: 'Head of Sustainability', imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'David Lee', role: 'Lead Designer', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ],
     values: [
      {
          title: 'Sustainability',
          description: 'We are committed to using renewable materials and minimizing our environmental impact at every stage of the supply chain.'
      },
      {
          title: 'Transparency',
          description: 'We believe in open and honest communication. We provide full traceability for our products, from raw material to finished garment.'
      },
      {
          title: 'Quality',
          description: 'Our products are built to last. We focus on durable materials and timeless design to create apparel that you can wear for years to come.'
      }
  ]
  },
};

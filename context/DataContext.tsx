import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, FaqItem, HeroContent, Partner, HowWeWorkSection, Material, InfoCard, FeaturedVideoContent, BrandReview, PlatformRating, Athlete, CommunityPost } from '../types';

interface DataContextType {
    products: Product[];
    collections: string[];
    faqs: FaqItem[];
    heroContents: HeroContent[];
    partners: Partner[];
    howWeWorkSections: HowWeWorkSection[];
    materials: Material[];
    infoCards: InfoCard[];
    featuredVideoContent: FeaturedVideoContent;
    brandReviews: BrandReview[];
    platformRatings: PlatformRating[];
    athletes: Athlete[];
    communityPosts: CommunityPost[];
    isLoading: boolean;
    error: string | null;
    updateData: <T>(key: string, data: T) => Promise<boolean>;
    fetchData: () => Promise<void>;
}

const defaultFeaturedVideo: FeaturedVideoContent = {
    isVisible: false,
    title: '',
    description: '',
    youtubeVideoUrl: ''
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const dataKeys = [
    'products', 'collections', 'faqs', 'heroContents', 'partners',
    'howWeWorkSections', 'materials', 'infoCards', 'featuredVideoContent',
    'brandReviews', 'platformRatings', 'athletes', 'communityPosts'
];

const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<Partial<Omit<DataContextType, 'isLoading' | 'error' | 'updateData' | 'fetchData'>>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const responses = await Promise.all(dataKeys.map(key =>
                fetch(`/api/data/${key}`).then(res => {
                    if (!res.ok) {
                        if (res.status === 404) return null;
                        throw new Error(`Failed to fetch ${key}: ${res.statusText}`);
                    }
                    return res.json();
                })
            ));

            const newData: Partial<Omit<DataContextType, 'isLoading' | 'error' | 'updateData' | 'fetchData'>> = {};
            responses.forEach((resData, index) => {
                if (resData !== null) {
                    (newData as any)[dataKeys[index]] = resData;
                }
            });

            if (newData.products) {
                newData.products = newData.products.map(product => {
                    const productWithSlug = {
                        ...product,
                        urlSlug: generateSlug(product.name)
                    };
                    if (productWithSlug.availableColors) {
                        productWithSlug.availableColors = productWithSlug.availableColors.map(color => ({
                            ...color,
                            urlSlug: generateSlug(color.name)
                        }));
                    }
                    return productWithSlug;
                });
            }

            setData(newData);

        } catch (err: any) {
            console.error("Failed to fetch site data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async <T,>(key: string, newData: T): Promise<boolean> => {
        try {
            const token = `${sessionStorage.getItem('adminUser')}:${sessionStorage.getItem('adminPass')}`;
            const response = await fetch(`/api/data/${key}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            setData(prev => ({ ...prev, [key]: newData }));
            return true;

        } catch (err: any) {
            console.error(`Failed to update data for key ${key}:`, err);
            setError(`Failed to save ${key}: ${err.message}`);
            return false;
        }
    };

    const value: DataContextType = {
        products: data.products || [],
        collections: data.collections || [],
        faqs: data.faqs || [],
        heroContents: data.heroContents || [],
        partners: data.partners || [],
        howWeWorkSections: data.howWeWorkSections || [],
        materials: data.materials || [],
        infoCards: data.infoCards || [],
        featuredVideoContent: data.featuredVideoContent || defaultFeaturedVideo,
        brandReviews: data.brandReviews || [],
        platformRatings: data.platformRatings || [],
        athletes: data.athletes || [],
        communityPosts: data.communityPosts || [],
        isLoading,
        error,
        updateData,
        fetchData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

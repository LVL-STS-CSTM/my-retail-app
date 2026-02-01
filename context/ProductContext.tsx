
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductContextType {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/data/products`);
            if (!res.ok) {
                if (res.status === 404) {
                    setProducts([]);
                    return;
                };
                throw new Error(`Failed to fetch products: ${res.statusText}`);
            }
            let fetchedProducts = await res.json();
            if (fetchedProducts) {
                fetchedProducts = fetchedProducts.map((product: Product) => {
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
            setProducts(fetchedProducts);
        } catch (err: any) {
            console.error("Failed to fetch site products:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const value: ProductContextType = {
        products,
        isLoading,
        error,
        fetchProducts,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

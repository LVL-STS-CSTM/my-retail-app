
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductDetail from './ProductDetail';
import ProductGrid from './ProductGrid';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { products } = useProducts();

    const selectedProduct = products.find(p => p.id === productId);

    const relatedProducts = products
        .filter(p => p.category === selectedProduct?.category && p.id !== selected-product?.id)
        .slice(0, 4);

    if (!selectedProduct) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    return (
        <div>
            <ProductDetail />
            
            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-16 border-t border-gray-200">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-8">
                        You Might Also Like
                    </h2>
                    <ProductGrid products={relatedProducts} />
                </div>
            )}
        </div>
    );
};

export default ProductPage;

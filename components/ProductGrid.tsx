



import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin: string = '0px 0px -150px 0px'): boolean => {
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin }
        );
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);
    return isIntersecting;
};

/**
 * @interface ProductGridProps
 * @description Props for the ProductGrid component.
 * @property {Product[]} products - An array of product data to be displayed in the grid.
 * @property {(product: Product) => void} onProductClick - The callback function to be passed to each ProductCard.
 * @property {'grid-sm' | 'grid-lg'} [layout] - The grid layout style.
 */
interface ProductGridProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    layout?: 'grid-sm' | 'grid-lg';
}

/**
 * @description A component that arranges multiple ProductCard components into a responsive grid.
 */
const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, layout = 'grid-sm' }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(gridRef, '0px 0px -25% 0px');

    // Dynamically set grid classes based on layout prop
    const gridClasses = layout === 'grid-lg'
        ? 'grid-cols-1 sm:grid-cols-2 gap-4'
        : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5';

    return (
        <section className="max-w-[1840px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-12">
            {/* The grid layout adjusts the number of columns based on the screen size. */}
            <div ref={gridRef} className={`grid ${gridClasses}`}>
                {/* Map over the products array and render a ProductCard for each one. */}
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                        style={{ transitionDelay: `${Math.min(index * 100, 1000)}ms` }}
                    >
                        <ProductCard product={product} onProductClick={onProductClick} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductGrid;
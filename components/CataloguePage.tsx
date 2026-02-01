
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';
import { useProductFilters } from '../hooks/useProductFilters';
import FilterSidebar from './FilterSidebar';
import { ViewGridSmallIcon, ViewGridLargeIcon, FilterIcon } from './icons';
import { useData } from '../context/DataContext';

interface CataloguePageProps {
    products: Product[];
    onProductClick: (product: Product, colorSlug?: string) => void;
    initialFilter: { type: 'group' | 'category' | 'gender'; value: string } | null;
    onNavigate: (pageOrPath: string, filterValue?: string | null) => void;
}

const CataloguePage: React.FC<CataloguePageProps> = ({ products, onProductClick, initialFilter, onNavigate }) => {
    const { collections } = useData();
    const {
        filteredProducts,
        selectedFilters,
        showBestsellersOnly,
        handleFilterChange,
        setShowBestsellersOnly,
        clearFilters
    } = useProductFilters(products, initialFilter);

    const [sortOrder, setSortOrder] = useState<'default' | 'name-asc' | 'price-asc' | 'price-desc'>('default');
    const [layout, setLayout] = useState<'grid-sm' | 'grid-lg'>('grid-sm');
    const [isFilterVisible, setIsFilterVisible] = useState(true);

    const sortedProducts = useMemo(() => {
        let sorted = [...filteredProducts];
        switch (sortOrder) {
            case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'price-asc': sorted.sort((a, b) => (a.basePrice || Infinity) - (b.basePrice || Infinity)); break;
            case 'price-desc': sorted.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0)); break;
            default: break; // Add default sorting if needed
        }
        return sorted;
    }, [filteredProducts, sortOrder]);

    const memoizedFilterOptions = useMemo(() => {
        const countItems = (items: Product[], key: 'category' | 'gender') => {
            return items.reduce((acc: Record<string, number>, product: Product) => {
                const value = product[key];
                if (value) {
                   acc[value] = (acc[value] || 0) + 1;
                }
                return acc;
            }, {});
        };

        const productsForCategoryCount = selectedFilters.group ? products.filter(p => p.category === selectedFilters.group) : [];
        const categoryCounts = countItems(productsForCategoryCount, 'category');
        const genderCounts = countItems(products, 'gender');
        
        const categoriesToShow = selectedFilters.group 
            ? Array.from(new Set(products.filter(p => p.category === selectedFilters.group).map(p => p.category))).sort()
            : [];
        const allGenders: ('Men' | 'Women' | 'Unisex')[] = ['Men', 'Women', 'Unisex'];
    
        return {
            groups: collections.map(name => ({ name, count: products.filter(p => p.category === name).length })).sort((a,b) => a.name.localeCompare(b.name)),
            categories: categoriesToShow.map(name => ({ name, count: categoryCounts[name] || 0 })),
            genders: allGenders.map(name => ({ name, count: genderCounts[name] || 0 }))
        };
    }, [products, collections, selectedFilters]);

    return (
        <div className="bg-white min-h-screen">
            <div className="sticky top-14 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 flex flex-wrap justify-between items-center gap-y-4 gap-x-8">
                        <div className="flex items-center gap-4">
                             <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 lg:hidden">
                                <FilterIcon className="w-5 h-5" />
                                <span className="text-sm font-medium">Filters</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-x-6">
                            <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
                                <FilterIcon className="w-5 h-5"/>
                                {isFilterVisible ? 'Hide' : 'Show'} Filters
                            </button>
                             <div className="flex items-center gap-2">
                                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort by</label>
                                <select id="sort-by" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="bg-gray-50 text-gray-900 text-sm border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 py-1.5 pl-3 pr-8">
                                    <option value="default">Default</option>
                                    <option value="name-asc">Name: A-Z</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                            <div className="flex items-center p-0.5 bg-gray-200 rounded-lg">
                                <button onClick={() => setLayout('grid-lg')} title="Large grid" className={`p-1.5 rounded-md transition-colors ${layout === 'grid-lg' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:bg-gray-300'}`}><ViewGridLargeIcon className="w-5 h-5" /></button>
                                <button onClick={() => setLayout('grid-sm')} title="Small grid" className={`p-1.5 rounded-md transition-colors ${layout === 'grid-sm' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:bg-gray-300'}`}><ViewGridSmallIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
                    <aside className={`hidden lg:block lg:col-span-1 transition-all duration-300 ${isFilterVisible ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        {isFilterVisible && 
                            <FilterSidebar 
                                isFilterVisible={isFilterVisible}
                                setIsFilterVisible={setIsFilterVisible}
                                clearFilters={clearFilters}
                                memoizedFilterOptions={memoizedFilterOptions}
                                selectedFilters={selectedFilters}
                                handleFilterChange={handleFilterChange}
                                showBestsellersOnly={showBestsellersOnly}
                                setShowBestsellersOnly={setShowBestsellersOnly}
                            />
                        }
                    </aside>
                    
                    <div className={isFilterVisible ? 'lg:col-span-3' : 'lg:col-span-4'}>
                        {sortedProducts.length > 0 ? (
                            <ProductGrid products={sortedProducts} onProductClick={onProductClick} layout={layout}/>
                        ) : (
                            <div className="text-center py-20 px-4">
                                <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters or clear them to see all products.</p>
                                <button onClick={clearFilters} className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                    &larr; Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 lg:hidden flex items-center justify-center p-4 transition-all duration-300 ${isFilterVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`} onClick={() => setIsFilterVisible(false)}>
                <div 
                    className={`bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col transform transition-all duration-300 ease-out ${isFilterVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FilterSidebar 
                        isMobile 
                        isFilterVisible={isFilterVisible}
                        setIsFilterVisible={setIsFilterVisible}
                        clearFilters={clearFilters}
                        memoizedFilterOptions={memoizedFilterOptions}
                        selectedFilters={selectedFilters}
                        handleFilterChange={handleFilterChange}
                        showBestsellersOnly={showBestsellersOnly}
                        setShowBestsellersOnly={setShowBestsellersOnly}
                    />
                </div>
            </div>
        </div>
    );
};

export default CataloguePage;

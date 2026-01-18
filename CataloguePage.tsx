
import React, { useState, useMemo, useEffect } from 'react';
import { Product, View } from '../types';
import ProductGrid from './ProductGrid';
import { useProductData } from '../context/ProductContext';
import { ViewGridSmallIcon, ViewGridLargeIcon, FilterIcon, CloseIcon } from './icons';
import Accordion from './Accordion';

interface CataloguePageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    initialFilter: { type: 'group' | 'category' | 'gender'; value: string } | null;
    isCataloguePage: boolean;
    onNavigate: (pageOrPath: View | string, filterValue?: string | null) => void;
}

const collectionImageMap: Record<string, string> = {
    'Apparel': 'https://i.pinimg.com/1200x/28/93/06/28930616e55b8bc704c4984b331757bd.jpg',
    'Workwear': 'https://i.pinimg.com/1200x/d2/ea/68/d2ea6887d01b0123265ca898df665739.jpg',
    'Headwear': 'https://i.pinimg.com/736x/da/11/be/da11befcd479d6380b6d867c44c96e1d.jpg',
    'Bags': 'https://i.pinimg.com/1200x/1b/b1/3d/1bb13db5f1cc9e/9f875452af076dd336.jpg',
    'Drinkware': 'https://i.pinimg.com/736x/b5/03/1b/b5031b0907073f5e643b96dafa038839.jpg',
    'Office & Stationery': 'https://i.pinimg.com/1200x/1f/a5/fa/1fa5fae51002209c82f4a5c982c5b8f3.jpg',
    'Accessories': 'https://i.pinimg.com/1200x/38/84/2f/38842fc75b3a1aff9e1afe6fc5362847.jpg',
    'Lifestyle': 'https://i.pinimg.com/1200x/ad/95/a4/ad95a4ffead7f65190a9540bd04f2825.jpg',
};

const categoryImageMap: Record<string, string> = {
    'Tops': 'https://i.pinimg.com/1200x/96/c6/15/96c615a3a848408fb70772223b360153.jpg',
    'Custom Jerseys': 'https://i.pinimg.com/1200x/c0/b4/5c/c0b45cb6885ae68e150339613511781f.jpg',
    'Bottoms': 'https://i.pinimg.com/736x/92/10/d4/9210d45ca970bca1ab6ab0dda700132a.jpg',
    'Outerwear': 'https://i.pinimg.com/1200x/6c/fc/4d/6cfc4d84d43a252963521bb2e5968cdc.jpg',
    'Aprons': 'https://i.pinimg.com/1200x/d2/ea/68/d2ea6887d01b0123265ca898df665739.jpg',
    'Vests': 'https://i.pinimg.com/1200x/97/47/ac/9747ac6eadce6202e655fa40a9eb8c88.jpg',
    'Caps': 'https://i.pinimg.com/736x/da/11/be/da11befcd479d6380b6d867c44c96e1d.jpg',
    'Beanies': 'https://i.pinimg.com/1200x/b5/08/fc/b508fc4ad55f62f2f472999240afdabd.jpg',
    'Tote Bags': 'https://i.pinimg.com/1200x/5f/b6/e3/5fb6e3f3f756473141786b06bc452042.jpg',
    'Backpacks': 'https://i.pinimg.com/1200x/1b/b1/3d/1bb13db5f1cc9e/9f875452af076dd336.jpg',
    'Mugs': 'https://i.pinimg.com/736x/b5/03/1b/b5031b0907073f5e643b96dafa038839.jpg',
    'Bottles': 'https://i.pinimg.com/1200x/b1/dc/8b/b1dc8b8c197794d626d340c36392016c.jpg',
    'Notebooks': 'https://i.pinimg.com/1200x/1f/a5/fa/1fa5fae51002209c82f4a5c982c5b8f3.jpg',
    'Patches': 'https://i.pinimg.com/1200x/38/84/2f/38842fc75b3a1aff9e1afe6fc5362847.jpg',
    'Home Goods': 'https://i.pinimg.com/1200x/5c/af/71/5caf710c94dd3f5b3418f97508e19c23.jpg',
    'Pet Products': 'https://i.pinimg.com/1200x/ad/95/a4/ad95a4ffead7f65190a9540bd04f2825.jpg',
    'Baby & Children': 'https://i.pinimg.com/1200x/00/8f/30/008f30c46f1ec098a9e064263497b17e.jpg',
};

const CollectionCard: React.FC<{ name: string; imageUrl: string; onClick: () => void }> = ({ name, imageUrl, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="relative group w-full overflow-hidden rounded-lg shadow-lg text-white text-left aspect-video"
            aria-label={`View ${name} collection`}
        >
            <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/800x450/4F4F4F/FFFFFF?text=Image+Not+Found';
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-none">
                <h2
                    className="font-oswald text-2xl md:text-3xl tracking-wider uppercase"
                    style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}
                >
                    {name}
                </h2>
            </div>
        </button>
    );
};

const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
    <div className="flex items-center gap-1 bg-gray-200 text-gray-800 text-sm font-medium pl-3 pr-1 py-1 rounded-full animate-fade-in">
        <span>{label}</span>
        <button onClick={onRemove} className="p-1 rounded-full hover:bg-gray-300">
            <CloseIcon className="w-3 h-3" />
        </button>
    </div>
);

const CataloguePage: React.FC<CataloguePageProps> = ({ products, onProductClick, initialFilter, isCataloguePage, onNavigate }) => {
    const { collections } = useProductData();
    const [sortOrder, setSortOrder] = useState<'default' | 'name-asc' | 'price-asc' | 'price-desc'>('default');
    const [layout, setLayout] = useState<'grid-sm' | 'grid-lg'>('grid-sm');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    const [selectedFilters, setSelectedFilters] = useState<{
        group: string | null;
        category: string[];
        gender: string[];
    }>({ group: null, category: [], gender: [] });
    const [showBestsellersOnly, setShowBestsellersOnly] = useState<boolean>(false);

    useEffect(() => {
        if (initialFilter) {
            const { type, value } = initialFilter;
            if (type === 'group') {
                setSelectedFilters({ group: value, category: [], gender: [] });
            } else if (type === 'category') {
                const productWithCategory = products.find(p => p.category === value);
                setSelectedFilters({ group: productWithCategory?.categoryGroup || null, category: [value], gender: [] });
            } else if (type === 'gender') {
                 setSelectedFilters({ group: null, category: [], gender: [value] });
            }
        } else {
            clearFilters();
        }
    }, [initialFilter, products]);
    
    useEffect(() => {
        const body = document.body;
        if (isFilterVisible && window.innerWidth < 1024) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
        return () => {
            body.style.overflow = 'auto';
        };
    }, [isFilterVisible]);

    const collectionData = useMemo(() => {
        return collections.map(collectionName => {
            const defaultImage = 'https://placehold.co/800x450?text=No+Image';
            const imageUrl = collectionImageMap[collectionName] || defaultImage;
            return { name: collectionName, imageUrl };
        });
    }, [collections]);
    
    const isAnyFilterActive = useMemo(() => {
        return selectedFilters.group !== null || selectedFilters.category.length > 0 || selectedFilters.gender.length > 0 || showBestsellersOnly;
    }, [selectedFilters, showBestsellersOnly]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        if (selectedFilters.group) {
            filtered = filtered.filter(p => p.categoryGroup === selectedFilters.group);
        }
        if (selectedFilters.category.length > 0) {
            filtered = filtered.filter(p => selectedFilters.category.includes(p.category));
        }
        if (selectedFilters.gender.length > 0) {
            filtered = filtered.filter(p => selectedFilters.gender.includes(p.gender));
        }
        if (showBestsellersOnly) {
            filtered = filtered.filter(p => p.isBestseller);
        }
        
        let sorted = [...filtered];

        switch (sortOrder) {
            case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'price-asc': sorted.sort((a, b) => (a.price || Infinity) - (b.price || Infinity)); break;
            case 'price-desc': sorted.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
            default: sorted.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)); break;
        }
        
        return sorted;
    }, [products, selectedFilters, sortOrder, showBestsellersOnly]);

    const bannerImage = useMemo(() => {
        if (!isAnyFilterActive) return undefined;
        if (selectedFilters.category.length === 1 && selectedFilters.group && selectedFilters.gender.length === 0) {
            return categoryImageMap[selectedFilters.category[0]];
        }
        if (selectedFilters.group && selectedFilters.category.length === 0) {
            return collectionData.find(c => c.name === selectedFilters.group)?.imageUrl;
        }
        const firstMatchingProduct = filteredAndSortedProducts[0];
        return firstMatchingProduct ? Object.values(firstMatchingProduct.imageUrls || {}).flat()[0] : undefined;
    }, [isAnyFilterActive, selectedFilters, collectionData, filteredAndSortedProducts]);

    const pageTitle = useMemo(() => {
        if (selectedFilters.group) return selectedFilters.group;
        if (isAnyFilterActive) return "Filtered Results";
        return isCataloguePage ? "All Collections" : "All Products";
    }, [selectedFilters, isAnyFilterActive, isCataloguePage]);

    const memoizedFilterOptions = useMemo(() => {
        const countItems = (items: Product[], key: 'categoryGroup' | 'category' | 'gender') => {
            return items.reduce((acc: Record<string, number>, product: Product) => {
                const value = product[key];
                if (typeof value === 'string' && value) {
                   acc[value] = (acc[value] || 0) + 1;
                }
                return acc;
            }, {});
        };
    
        const groupCounts = countItems(products, 'categoryGroup');
        const productsForCategoryCount = selectedFilters.group ? products.filter(p => p.categoryGroup === selectedFilters.group) : [];
        const categoryCounts = countItems(productsForCategoryCount, 'category');
        const genderCounts = countItems(products, 'gender');
        
        const allGroups = collections;
        const categoriesToShow = selectedFilters.group 
            ? Array.from(new Set(products.filter(p => p.categoryGroup === selectedFilters.group).map(p => p.category))).sort()
            : [];
        const allGenders: ('Men' | 'Women' | 'Unisex')[] = ['Men', 'Women', 'Unisex'];
    
        return {
            groups: allGroups.map(name => ({ name, count: groupCounts[name] || 0 })).sort((a,b) => a.name.localeCompare(b.name)),
            categories: categoriesToShow.map(name => ({ name, count: categoryCounts[name] || 0 })),
            genders: allGenders.map(name => ({ name, count: genderCounts[name] || 0 }))
        };
    }, [products, collections, selectedFilters]);
    
    const handleGroupChange = (groupName: string) => {
        onNavigate('catalogue', groupName);
    };

    const handleCategoryChange = (categoryName: string) => {
        setSelectedFilters(prev => {
            const currentCategories = prev.category;
            const newCategories = currentCategories.includes(categoryName)
                ? currentCategories.filter(c => c !== categoryName)
                : [...currentCategories, categoryName];
            return { ...prev, category: newCategories };
        });
    };

    const handleGenderChange = (genderName: string) => {
        setSelectedFilters(prev => {
            const currentGenders = prev.gender;
            const newGenders = currentGenders.includes(genderName)
                ? currentGenders.filter(g => g !== genderName)
                : [...currentGenders, genderName];
            return { ...prev, gender: newGenders };
        });
    };
    
    const clearFilters = () => {
        setSelectedFilters({ group: null, category: [], gender: [] });
        setShowBestsellersOnly(false);
        if(!isCataloguePage) onNavigate('all-products');
        else onNavigate('catalogue');
    };

    const FilterPanel: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
        <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center border-b">
                <h3 className="font-semibold text-lg">Filters</h3>
                {isMobile ? (
                    <button onClick={() => setIsFilterVisible(false)}><CloseIcon className="w-6 h-6"/></button>
                ) : (
                    <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-black">Clear all</button>
                )}
            </div>
            <div className="p-4 space-y-2 overflow-y-auto flex-grow">
                 <div>
                    <h4 className="px-1 pt-2 pb-1 text-sm font-semibold uppercase tracking-wider text-gray-800">Collection</h4>
                    <div className="pt-2 space-y-1">
                        {memoizedFilterOptions.groups.map(({ name }) => {
                            const isSelected = selectedFilters.group === name;
                            return (
                                <button 
                                    key={name} 
                                    onClick={() => handleGroupChange(name)}
                                    className={`w-full text-left flex items-center justify-between space-x-2 p-2 rounded-md text-sm transition-colors ${isSelected ? 'bg-gray-800 text-white font-semibold' : 'hover:bg-gray-100'}`}
                                >
                                    <span>{name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedFilters.group && memoizedFilterOptions.categories.length > 0 && (
                    <Accordion title="Category" theme="light">
                        <div className="pt-2 space-y-1">
                            {memoizedFilterOptions.categories.map(({ name, count }) => {
                                const isChecked = selectedFilters.category.includes(name);
                                const isDisabled = count === 0 && !isChecked;
                                return (
                                    <label key={name} className={`flex items-center justify-between space-x-2 p-1 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={isChecked} onChange={() => handleCategoryChange(name)} disabled={isDisabled} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:bg-gray-200" />
                                            <span className="text-sm">{name}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{count}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </Accordion>
                )}
                 <Accordion title="Gender" theme="light">
                     <div className="pt-2 space-y-1">
                        {memoizedFilterOptions.genders.map(({ name, count }) => {
                            const isChecked = selectedFilters.gender.includes(name);
                            const isDisabled = count === 0 && !isChecked;
                             return (
                                <label key={name} className={`flex items-center justify-between space-x-2 p-1 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={isChecked} onChange={() => handleGenderChange(name)} disabled={isDisabled} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:bg-gray-200" />
                                        <span className="text-sm">{name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{count}</span>
                                </label>
                            );
                        })}
                    </div>
                 </Accordion>
                 <Accordion title="More Filters" theme="light">
                    <div className="pt-2 space-y-1">
                        <label className="flex items-center justify-between space-x-2 p-1 rounded hover:bg-gray-100 cursor-pointer">
                            <span className="text-sm">Bestsellers Only</span>
                            <input type="checkbox" checked={showBestsellersOnly} onChange={() => setShowBestsellersOnly(prev => !prev)} className="h-5 w-9 rounded-full bg-gray-200 relative cursor-pointer appearance-none transition-colors after:content-[''] after:h-4 after:w-4 after:rounded-full after:bg-white after:absolute after:top-0.5 after:left-0.5 after:shadow after:transition-transform checked:bg-black checked:after:translate-x-4" />
                        </label>
                    </div>
                </Accordion>
            </div>
            {isMobile && (
                 <div className="p-4 border-t bg-white sticky bottom-0 rounded-b-2xl">
                    <button onClick={clearFilters} className="w-full py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">Clear all filters</button>
                 </div>
            )}
        </div>
    );
    
   // Find this section in your CataloguePage.tsx
if (isCataloguePage && !isAnyFilterActive) {
    return (
        <div className="bg-white min-h-screen">
            <section className="relative h-[45vh] bg-gray-800 flex flex-col items-center justify-center text-white text-center p-4">
                {/* Keep pointer-events-none here so clicks pass THROUGH the image/text to the background if needed, 
                    but usually, the section below is what matters */}
                <img src={collectionData[0]?.imageUrl || ''} alt="Product Collections" className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
                <div className="relative z-10 pointer-events-none">
                    <h1 className="font-heading text-4xl md:text-5xl tracking-tight uppercase">
                        Our Collections
                    </h1>
                </div>
            </section>
            
            {/* REMOVE pointer-events-none from this div or any wrapper around the grid */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    {collectionData.map((cat) => (
                        <div key={cat.name}>
                            <CollectionCard
                                name={cat.name}
                                imageUrl={cat.imageUrl}
                                onClick={() => onNavigate('catalogue', cat.name)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
    
    return (
        <div className="bg-white min-h-screen">
            <section className="relative h-[50vh] bg-gray-800 flex flex-col items-center justify-center text-white text-center p-4">
                {bannerImage && <img src={bannerImage} alt={pageTitle} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
                <div className="relative z-10 pointer-events-none">
                    <h1 className="font-heading text-4xl md:text-6xl tracking-tight uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                        {pageTitle}
                    </h1>
                </div>
            </section>
            
            <div className="sticky top-14 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 flex flex-wrap justify-between items-center gap-y-4 gap-x-8">
                        <div className="flex items-center gap-4">
                             <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 lg:hidden">
                                <FilterIcon className="w-5 h-5" />
                                <span className="text-sm font-medium">Filters</span>
                            </button>
                            <h2 className="text-xl font-oswald uppercase tracking-wider text-gray-900 hidden sm:block">
                                {pageTitle}
                            </h2>
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

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px8 py-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
                    <aside className={`hidden lg:block lg:col-span-1 transition-all duration-300 ${isFilterVisible ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        {isFilterVisible && <FilterPanel />}
                    </aside>
                    
                    <div className={isFilterVisible ? 'lg:col-span-3' : 'lg:col-span-4'}>
                        {isAnyFilterActive && (
                            <div className="mb-6 pb-4 border-b flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-sm mr-2">Now filtering:</span>
                                {selectedFilters.group && <FilterTag key={`group-${selectedFilters.group}`} label={selectedFilters.group} onRemove={() => handleGroupChange(selectedFilters.group!)} />}
                                {selectedFilters.category.map(f => <FilterTag key={`cat-${f}`} label={f} onRemove={() => handleCategoryChange(f)} />)}
                                {selectedFilters.gender.map(f => <FilterTag key={`gender-${f}`} label={f} onRemove={() => handleGenderChange(f)} />)}
                                {showBestsellersOnly && <FilterTag label="Bestsellers" onRemove={() => setShowBestsellersOnly(false)} />}
                            </div>
                        )}
                        {filteredAndSortedProducts.length > 0 ? (
                            <ProductGrid products={filteredAndSortedProducts} onProductClick={onProductClick} layout={layout}/>
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
                    <FilterPanel isMobile />
                </div>
            </div>
        </div>
    );
};

export default CataloguePage;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Color, ProductSize, View, Material } from '../types';
import { useQuote } from '../context/CartContext';
import { PlusIcon, TrashIcon } from './icons';
import Accordion from './Accordion';
import ProductGrid from './ProductGrid';
import MaterialCareModal from './MaterialCareModal';
import Button from './Button';

/**
 * @interface ProductPageProps
 * @description Props for the ProductPage component.
 * @property {Product} product - The product to be displayed and configured.
 * @property {(page: View, category?: string) => void} onNavigate - Callback function to navigate back to the catalogue.
 * @property {(message: string) => void} showToast - Function to trigger a toast notification.
 * @property {Material[]} materials - List of all available materials.
 * @property {Product[]} allProducts - All products for finding related items.
 * @property {(product: Product) => void} onProductClick - Callback to navigate to another product.
 */
interface ProductPageProps {
    product: Product;
    onNavigate: (page: View, category?: string) => void;
    showToast: (message: string) => void;
    materials: Material[];
    allProducts: Product[];
    onProductClick: (product: Product) => void;
}

/**
 * @description A redesigned, more compact file input component.
 */
const FileInput: React.FC<{label: string, file: File | null, setFile: (file: File | null) => void, accept: string}> = ({ label, file, setFile, accept }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50">
           <span className="text-sm text-gray-600 truncate pr-2">{file ? file.name : 'No file selected.'}</span>
           <div className="flex items-center">
                {file && (
                    <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline mr-2">
                        Remove
                    </button>
                )}
                <label className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500 bg-white rounded-md px-3 py-1 border border-gray-300 hover:bg-gray-50 shadow-sm">
                    <span>Upload</span>
                    <input type='file' className="sr-only" accept={accept} onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                </label>
           </div>
        </div>
    </div>
);


/**
 * @description The detailed product page, which acts as a configuration tool for adding items to a quote request.
 * Redesigned with a sticky configuration panel and a tabbed interface for a more compact and user-friendly experience.
 */
const ProductPage: React.FC<ProductPageProps> = ({ product, onNavigate, showToast, materials, allProducts, onProductClick }) => {
    // State for user's selections
    const [selectedColor, setSelectedColor] = useState<Color | null>(product.availableColors[0] || null);
    const [sizeQuantities, setSizeQuantities] = useState<{ [key: string]: number }>({});
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [designFile, setDesignFile] = useState<File | null>(null);
    const [customizations, setCustomizations] = useState<{ name: string; number: string; size: string }[]>([{ name: '', number: '', size: '' }]);
    
    // State and refs for mobile image swiper
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // State for Material Care Modal
    const [isCareModalOpen, setIsCareModalOpen] = useState(false);
    const [selectedCareImage, setSelectedCareImage] = useState<string | undefined>(undefined);

    // Get the image set for the currently selected color, with robust fallbacks.
    const imagesForDisplay = useMemo(() => {
        if (selectedColor && product.imageUrls[selectedColor.name] && product.imageUrls[selectedColor.name].length > 0) {
            return product.imageUrls[selectedColor.name];
        }
        // Fallback to the first color that has images.
        const firstColorWithImages = product.availableColors.find(c => product.imageUrls[c.name]?.length > 0);
        if (firstColorWithImages) {
            return product.imageUrls[firstColorWithImages.name];
        }
        // Ultimate fallback: flatten all image URLs and use them.
        return Object.values(product.imageUrls).flat();
    }, [selectedColor, product]);

    const [activeImageUrl, setActiveImageUrl] = useState<string>(imagesForDisplay[0] || '');

    // Access the addToQuote function from the global context.
    const { addToQuote } = useQuote();
    
    // Find the associated material for the product
    const material = useMemo(() => {
        if (!product.materialId || !materials) return null;
        return materials.find(m => m.id === product.materialId);
    }, [product.materialId, materials]);

    // Check if the product has a valid size chart to display
    const hasSizeChart = useMemo(() => {
        return product.availableSizes && product.availableSizes.length > 0 && product.availableSizes.some(s => s.width > 0 && s.length > 0);
    }, [product.availableSizes]);

    // Define the Minimum Order Quantity, using the custom product.moq if available.
    const MOQ = product.moq && product.moq > 0
        ? product.moq
        : (product.category === 'Custom Jerseys' ? 1 : 12);

    // Get related products for "You May Also Like"
    const relatedProducts = useMemo(() => {
        if (!allProducts) return [];
        return allProducts
            .filter(p => p.categoryGroup === product.categoryGroup && p.id !== product.id)
            .sort(() => 0.5 - Math.random()) // Shuffle
            .slice(0, 4); // Take 4 random products
    }, [allProducts, product]);


    // Add error handlers for broken image links to improve robustness.
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/94a3b8?text=Image+Error';
        e.currentTarget.onerror = null; // Prevent infinite loop
    };

    // useMemo to efficiently calculate the total quantity whenever sizeQuantities changes.
    const totalQuantity = useMemo(() => {
        // FIX: Add explicit types to reduce callback parameters to fix type inference issue.
        return Object.values(sizeQuantities).reduce((sum: number, qty: number) => sum + (qty || 0), 0);
    }, [sizeQuantities]);

    // useMemo to sort sizes intelligently. It handles standard apparel sizes and numerical sizes.
    const sortedSizes = useMemo(() => {
        const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        return [...product.availableSizes].sort((a, b) => {
            const aIsNumeric = /^\d+$/.test(a.name);
            const bIsNumeric = /^\d+$/.test(b.name);
            if (aIsNumeric && bIsNumeric) return parseInt(a.name, 10) - parseInt(b.name, 10);
            const aIndex = sizeOrder.indexOf(a.name.toUpperCase());
            const bIndex = sizeOrder.indexOf(b.name.toUpperCase());
            if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
            if(aIsNumeric) return -1;
            if(bIsNumeric) return 1;
            if(aIndex > -1) return -1;
            if(bIndex > -1) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [product.availableSizes]);
    
    // FIX: Add explicit type to the filter callback parameter to resolve the type error.
    const sizesWithQuantity = useMemo(() => sortedSizes.filter((size: ProductSize) => (sizeQuantities[size.name] || 0) > 0), [sortedSizes, sizeQuantities]);
    const customizationCountsPerSize = useMemo(() => {
        const counts: { [key: string]: number } = {};
        for (const cust of customizations) {
            if (cust.size) counts[cust.size] = (counts[cust.size] || 0) + 1;
        }
        return counts;
    }, [customizations]);

    // Effect to reset state when the product changes
    useEffect(() => {
        const firstColor = product.availableColors[0] || null;
        setSelectedColor(firstColor);
        setCustomizations([{ name: '', number: '', size: '' }]);
        setSizeQuantities({});
    }, [product]);

    // Effect to update the active image when the displayed image set changes (e.g., due to color selection)
    useEffect(() => {
        setActiveImageUrl(imagesForDisplay[0] || '');
    }, [imagesForDisplay]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, offsetWidth } = scrollContainerRef.current;
            const index = Math.round(scrollLeft / offsetWidth);
            if (index !== currentImageIndex) {
                setCurrentImageIndex(index);
            }
        }
    };
    
    // Material Care Modal Handlers
    const openCareModal = (imageUrl?: string) => {
        setSelectedCareImage(imageUrl);
        setIsCareModalOpen(true);
    };

    const closeCareModal = () => {
        setIsCareModalOpen(false);
        setSelectedCareImage(undefined);
    };

    const handleSizeQuantityChange = (sizeName: string, value: string) => {
        const quantity = parseInt(value, 10);
        setSizeQuantities(prev => ({ ...prev, [sizeName]: isNaN(quantity) || quantity < 0 ? 0 : quantity }));
    };

    const handleCustomizationChange = (index: number, field: 'name' | 'number' | 'size', value: string) => {
        const newCustomizations = [...customizations];
        const currentCust = newCustomizations[index];
        if (field === 'name') currentCust.name = value.toUpperCase();
        else if (field === 'number') { const val = value.replace(/[^0-9]/g, ''); if (val.length <= 2) currentCust.number = val; } 
        else currentCust.size = value;
        setCustomizations(newCustomizations);
    };

    const handleAddCustomization = () => setCustomizations(prev => [...prev, { name: '', number: '', size: '' }]);
    const handleRemoveCustomization = (index: number) => setCustomizations(prev => prev.filter((_, i) => i !== index));

    const handleAddToQuote = () => {
        if (!selectedColor) return;
        const isCustomJersey = product.category === 'Custom Jerseys';
        if (totalQuantity === 0) { alert('Please enter a quantity for at least one size.'); return; }

        if (totalQuantity < MOQ) {
            alert(`A minimum order quantity of ${MOQ} is required for this item.`);
            return;
        }
        
        if (isCustomJersey) {
            const filledCustomizations = customizations.filter(c => c.name.trim() || c.number.trim() || c.size);
            if (filledCustomizations.some(c => (c.name.trim() || c.number.trim()) && !c.size)) { alert('Please select a size for every customization row that has a name or number.'); return; }
            const finalCustomizationCounts: { [key: string]: number } = {};
            for (const cust of filledCustomizations) { if (cust.size) finalCustomizationCounts[cust.size] = (finalCustomizationCounts[cust.size] || 0) + 1; }
            for (const size of sortedSizes) {
                const needed = sizeQuantities[size.name] || 0; const entered = finalCustomizationCounts[size.name] || 0;
                if (needed !== entered) { alert(`Mismatch for size ${size.name}: Quantity is ${needed}, but you have provided ${entered} customization(s).`); return; }
            }
            for (const size in finalCustomizationCounts) { if (!sizeQuantities[size] || sizeQuantities[size] === 0) { alert(`You have provided customizations for size ${size}, but the quantity for this size is 0.`); return; } }
        }
        
        // FIX: Replaced filter().reduce() with a single typed reduce() to fix type inference issue on `qty > 0`.
        const finalSizeQuantities = Object.entries(sizeQuantities).reduce((acc: Record<string, number>, [size, qty]: [string, number]) => { if (qty > 0) { acc[size] = qty; } return acc; }, {});
        if (Object.keys(finalSizeQuantities).length === 0) return;
        const finalCustomizations = isCustomJersey ? customizations.filter(c => c.size && (c.name.trim() || c.number.trim())) : undefined;
        addToQuote(product, selectedColor, finalSizeQuantities, logoFile || undefined, designFile || undefined, finalCustomizations);
        showToast("Item added to quote!");
        setSizeQuantities({}); setLogoFile(null); setDesignFile(null); setCustomizations([{ name: '', number: '', size: '' }]);
    };
    
    // FIX: Use React.FC to correctly type the component and handle props like `key`.
    const ColorSwatch: React.FC<{ color: Color }> = ({ color }) => {
        const imageUrl = (product.imageUrls[color.name] && product.imageUrls[color.name][0]) || 'https://placehold.co/80x80/f1f5f9/94a3b8?text=N/A';
        const isSelected = selectedColor?.name === color.name;
        
        return (
            <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`relative w-20 h-20 rounded-md border-2 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${isSelected ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                aria-label={`Select color ${color.name}`}
            >
                <img
                    src={imageUrl}
                    alt={color.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
            </button>
        )
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => onNavigate('catalogue', product.category)} className="text-sm text-gray-600 hover:text-black mb-8">
                &larr; Back to {product.categoryGroup}
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* --- LEFT: Image Gallery --- */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Thumbnails (Desktop Only) */}
                        <div className="hidden md:flex flex-col gap-3">
                            {imagesForDisplay.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageUrl(url)}
                                    className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-md border-2 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${activeImageUrl === url ? 'border-transparent ring-2 ring-black ring-offset-1' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <img
                                        src={url}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image (Desktop) & Swiper (Mobile) */}
                        <div className="flex-grow relative">
                            {/* Swiper for mobile */}
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="md:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-lg"
                            >
                                {imagesForDisplay.map((url, index) => (
                                    <div key={index} className="w-full flex-shrink-0 snap-center">
                                        <div className="bg-gray-100 shadow-inner overflow-hidden aspect-[4/5]">
                                            <img
                                                src={url}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={handleImageError}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination dots for mobile */}
                            {imagesForDisplay.length > 1 && (
                                <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                                    {imagesForDisplay.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentImageIndex === index ? 'bg-black' : 'bg-gray-500 opacity-50'}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Static image for desktop */}
                            <div className="hidden md:block flex-grow">
                                <div className="bg-gray-100 rounded-lg shadow-inner overflow-hidden aspect-[4/5]">
                                    <img 
                                        src={activeImageUrl} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* --- RIGHT: Configuration Panel --- */}
                <div className="space-y-8">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">{product.category}</p>
                        <h1 className="font-oswald text-4xl tracking-tight text-gray-900 mt-1 uppercase">{product.name}</h1>
                        {product.price && <p className="text-2xl text-gray-800 mt-2">${product.price.toFixed(2)}</p>}
                    </div>
                    
                    {/* Color Selector */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Color: <span className="font-light">{selectedColor?.name}</span></h3>
                        <div className="flex flex-wrap gap-3">
                            {product.availableColors.map(color => <ColorSwatch key={color.name} color={color} />)}
                        </div>
                    </div>

                    {/* Sizing & Quantity */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Sizing & Quantity</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                            {sortedSizes.map(size => (
                                <div key={size.name}>
                                    <label htmlFor={`size-${size.name}`} className="block text-sm font-medium text-gray-700 mb-1">{size.name}</label>
                                    <input id={`size-${size.name}`} type="number" min="0" value={sizeQuantities[size.name] || ''} onChange={(e) => handleSizeQuantityChange(size.name, e.target.value)} placeholder="0" className="w-full text-center text-md font-medium border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black px-2 py-1.5 placeholder-gray-400"/>
                                </div>
                            ))}
                        </div>
                         <div className="mt-4 text-right">
                            <p className="text-sm font-medium text-gray-800">Total: {totalQuantity}</p>
                            <p className={`text-xs ${totalQuantity >= MOQ ? 'text-green-600' : 'text-red-500'}`}>MOQ: {MOQ} pieces</p>
                         </div>
                    </div>
                    
                    {product.category === 'Custom Jerseys' && (
                         <Accordion title="Jersey Customization" theme="light">
                            <div className="py-4 space-y-3">
                                <p className="text-xs text-gray-500">Add a row for each jersey. The number of customizations must match the quantity for each size.</p>
                                {sizesWithQuantity.length > 0 && (<div className="text-xs text-gray-600 space-y-1 p-2 border-l-2">{sizesWithQuantity.map(size => { const needed = sizeQuantities[size.name] || 0; const entered = customizationCountsPerSize[size.name] || 0; return (<p key={size.name} className={`flex justify-between font-medium ${needed === entered ? 'text-green-600' : 'text-orange-600'}`}><span>Size {size.name}:</span><span>{entered} / {needed} entered</span></p>); })}</div>)}
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border rounded-md p-2 bg-gray-50">
                                    {customizations.map((cust, index) => (
                                        <div key={index} className="grid grid-cols-[1fr,80px,80px,auto] items-center gap-2">
                                            <input type="text" value={cust.name} onChange={(e) => handleCustomizationChange(index, 'name', e.target.value)} placeholder="Name" className="w-full text-xs p-1 border rounded" />
                                            <input type="text" value={cust.number} onChange={(e) => handleCustomizationChange(index, 'number', e.target.value)} placeholder="No." className="w-full text-xs p-1 border rounded text-center" />
                                            <select value={cust.size} onChange={(e) => handleCustomizationChange(index, 'size', e.target.value)} className="w-full text-xs p-1 border rounded bg-white"><option value="">Size</option>{sortedSizes.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}</select>
                                            <button onClick={() => handleRemoveCustomization(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleAddCustomization} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center"><PlusIcon className="w-3 h-3 mr-1" /> Add Row</button>
                            </div>
                        </Accordion>
                     )}

                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Logo & Design Upload</h3>
                        <div className="space-y-4">
                            <FileInput label="Upload Team/Brand Logo" file={logoFile} setFile={setLogoFile} accept=".png,.jpg,.jpeg,.svg,.ai,.eps" />
                            <FileInput label="Upload Full Design File" file={designFile} setFile={setDesignFile} accept=".png,.jpg,.jpeg,.svg,.ai,.eps,.pdf" />
                            <p className="text-xs text-gray-500">For best results, upload vector files (.svg, .ai, .eps) or high-resolution images.</p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="solid"
                        onClick={handleAddToQuote}
                        disabled={!selectedColor || totalQuantity < MOQ}
                        className="w-full py-4"
                    >
                        {`Add ${totalQuantity > 0 ? totalQuantity : ''} To Quote`}
                    </Button>
                    
                    {/* --- ACCORDIONS for additional info --- */}
                    <div className="border-t pt-6 space-y-1">
                        <Accordion title="Description" theme="light">
                            <div className="py-4 text-gray-600 leading-relaxed text-sm">
                                {product.description}
                            </div>
                        </Accordion>
                        {hasSizeChart && (
                            <Accordion title="Size Chart" theme="light">
                                <div className="py-4 overflow-x-auto">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-50"><tr className="border-b"><th className="p-3 font-medium">Size</th><th className="p-3 font-medium">Width (in)</th><th className="p-3 font-medium">Length (in)</th></tr></thead>
                                        <tbody>
                                            {sortedSizes.map(size => (
                                                <tr key={size.name} className="border-b last:border-b-0"><td className="p-3 font-semibold">{size.name}</td><td className="p-3">{size.width}"</td><td className="p-3">{size.length}"</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Accordion>
                        )}
                        {material && (
                            <Accordion title="Material Tech" theme="light">
                                <div className="py-4 text-sm">
                                    <h3 className="text-md font-oswald uppercase text-gray-800 mb-2">{material.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {material.features.map(feature => (
                                            <span key={feature} className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{material.description}</p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => openCareModal(material.careImageUrl)}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            View Material Care
                                        </button>
                                    </div>
                                </div>
                            </Accordion>
                        )}
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-16 border-t border-gray-200">
                    <h2 className="font-oswald text-2xl md:text-3xl text-center mb-8 uppercase tracking-wider text-gray-900">
                        You May Also Like
                    </h2>
                    <ProductGrid products={relatedProducts} onProductClick={onProductClick} />
                </div>
            )}

            <MaterialCareModal 
                isOpen={isCareModalOpen}
                onClose={closeCareModal}
                imageUrl={selectedCareImage}
            />
        </div>
    );
};

export default ProductPage;

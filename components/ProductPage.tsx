
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Material, Color, ProductSize, View } from '../types';
import ProductGrid from './ProductGrid';
import { useQuote } from '../context/CartContext';
import MaterialCareModal from './MaterialCareModal';

interface ProductPageProps {
    product: Product;
    onNavigate: (page: View, path?: string) => void;
    showToast: (message: string) => void;
    materials: Material[];
    allProducts: Product[];
    onProductClick: (product: Product, colorSlug?: string) => void;
    initialColorSlug?: string;
}

// Helper to convert a string to a URL-friendly slug
const toSlug = (str: string) => str.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

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

const ProductPage: React.FC<ProductPageProps> = ({ 
    product,
    onNavigate, 
    showToast, 
    materials, 
    allProducts, 
    onProductClick, 
    initialColorSlug 
}) => {
    const initialColor = useMemo(() => {
        if (!product) return null;
        if (initialColorSlug) {
            return product.availableColors.find(c => toSlug(c.name) === initialColorSlug) || product.availableColors[0] || null;
        }
        return product.availableColors[0] || null;
    }, [product, initialColorSlug]);

    const [selectedColor, setSelectedColor] = useState<Color | null>(initialColor);
    const [sizeQuantities, setSizeQuantities] = useState<{ [key: string]: number }>({});
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [designFile, setDesignFile] = useState<File | null>(null);
    const [customizations, setCustomizations] = useState<{ name: string; number: string; size: string }[]>([{ name: '', number: '', size: '' }]);
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const [isCareModalOpen, setIsCareModalOpen] = useState(false);
    const [selectedCareImage, setSelectedCareImage] = useState<string | undefined>(undefined);

    const imagesForDisplay = useMemo(() => {
        if (!product) return [];
        if (selectedColor && product.imageUrls[selectedColor.name] && product.imageUrls[selectedColor.name].length > 0) {
            return product.imageUrls[selectedColor.name];
        }
        const firstColorWithImages = product.availableColors.find(c => product.imageUrls[c.name]?.length > 0);
        if (firstColorWithImages) {
            return product.imageUrls[firstColorWithImages.name];
        }
        return Object.values(product.imageUrls).flat();
    }, [selectedColor, product]);

    const [activeImageUrl, setActiveImageUrl] = useState<string>('');

    const { addToQuote } = useQuote();
    
    const material = useMemo(() => {
        if (!product?.materialId || !materials) return null;
        return materials.find(m => m.id === product.materialId);
    }, [product, materials]);

    const hasSizeChart = useMemo(() => {
        if (!product) return false;
        return product.availableSizes && product.availableSizes.length > 0 && product.availableSizes.some(s => s.width > 0 && s.length > 0);
    }, [product]);

    const MOQ = useMemo(() => {
        if (!product) return 12;
        return product.moq && product.moq > 0 
            ? product.moq 
            : (product.category === 'Custom Jerseys' ? 1 : 12);
    }, [product]);

    const relatedProducts = useMemo(() => {
        if (!allProducts || !product) return [];
        return allProducts
            .filter(p => p.categoryGroup === product.categoryGroup && p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [allProducts, product]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/94a3b8?text=Image+Error';
        e.currentTarget.onerror = null;
    };

    const totalQuantity = useMemo(() => {
        return Object.values(sizeQuantities).reduce((sum: number, qty: number) => sum + (qty || 0), 0);
    }, [sizeQuantities]);

    const sortedSizes = useMemo(() => {
        if (!product) return [];
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
    }, [product]);
    
    const sizesWithQuantity = useMemo(() => sortedSizes.filter((size: ProductSize) => (sizeQuantities[size.name] || 0) > 0), [sortedSizes, sizeQuantities]);
    const customizationCountsPerSize = useMemo(() => {
        const counts: { [key: string]: number } = {};
        for (const cust of customizations) {
            if (cust.size) counts[cust.size] = (counts[cust.size] || 0) + 1;
        }
        return counts;
    }, [customizations]);

    useEffect(() => {
        const initialColor = product.availableColors.find(c => toSlug(c.name) === initialColorSlug) || product.availableColors[0] || null;
        setSelectedColor(initialColor);
        setCustomizations([{ name: '', number: '', size: '' }]);
        setSizeQuantities({});
    }, [product, initialColorSlug]);

    useEffect(() => {
        if (imagesForDisplay.length > 0) {
            setActiveImageUrl(imagesForDisplay[currentImageIndex] || imagesForDisplay[0]);
        } else {
            setActiveImageUrl('https://placehold.co/600x800/f1f5f9/94a3b8?text=No+Image');
        }
    }, [imagesForDisplay, currentImageIndex]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, offsetWidth } = scrollContainerRef.current;
            const index = Math.round(scrollLeft / offsetWidth);
            if (index !== currentImageIndex) {
                setCurrentImageIndex(index);
                setActiveImageUrl(imagesForDisplay[index]);
            }
        }
    };
    
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
        if (!product || !selectedColor) return;
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
        
        const finalSizeQuantities = Object.entries(sizeQuantities).reduce((acc: Record<string, number>, [size, qty]: [string, number]) => { if (qty > 0) { acc[size] = qty; } return acc; }, {});
        if (Object.keys(finalSizeQuantities).length === 0) return;
        const finalCustomizations = isCustomJersey ? customizations.filter(c => c.size && (c.name.trim() || c.number.trim())) : undefined;
        addToQuote(product, selectedColor, finalSizeQuantities, logoFile || undefined, designFile || undefined, finalCustomizations);
        showToast("Item added to quote!");
        setSizeQuantities({}); setLogoFile(null); setDesignFile(null); setCustomizations([{ name: '', number: '', size: '' }]);
    };

    const handleColorSelect = (color: Color) => {
        setSelectedColor(color);
        onProductClick(product, toSlug(color.name));
    };
    
    const ColorSwatch: React.FC<{ color: Color }> = ({ color }) => {
        if (!product) return null;
        const imageUrl = (product.imageUrls[color.name] && product.imageUrls[color.name][0]) || 'https://placehold.co/80x80/f1f5f9/94a3b8?text=N/A';
        const isSelected = selectedColor?.name === color.name;
        
        return (
            <button
                key={color.name}
                onClick={() => handleColorSelect(color)}
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

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Product Not Found</h2>
                <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
                <button onClick={() => onNavigate('catalogue')} className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                    &larr; Back to Catalogue
                </button>
            </div>
        );
    }

    const isCustomJersey = product.category === 'Custom Jerseys';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => onNavigate('catalogue', product.categoryGroup)} className="text-sm text-gray-600 hover:text-black mb-8">
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
                        
                        {/* Main Image Viewport */}
                        <div className="relative flex-grow aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-inner group">
                            <div 
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-hidden"
                            >
                                {imagesForDisplay.map((url, index) => (
                                    <div key={index} className="flex-shrink-0 w-full h-full snap-center">
                                        <img
                                            src={url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Mobile Pagination Dots */}
                            {imagesForDisplay.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                                    {imagesForDisplay.map((_, i) => (
                                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-4 bg-black' : 'w-1.5 bg-black/30'}`} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: Product Details & Configurator --- */}
                <div className="space-y-10">
                    {/* Header Info */}
                    <div>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h1 className="font-oswald text-4xl uppercase tracking-wider text-gray-900 leading-none">{product.name}</h1>
                                <p className="mt-2 text-sm text-gray-500 uppercase tracking-widest">{product.category} • {product.gender}</p>
                            </div>
                        </div>
                        <p className="mt-6 text-gray-700 leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">1. Select Color</h3>
                            <span className="text-xs font-medium text-gray-500">{selectedColor?.name || 'Please select'}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.availableColors.map(color => (
                                <ColorSwatch key={color.name} color={color} />
                            ))}
                        </div>
                    </div>

                    {/* Size & Quantity Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">2. Enter Quantities</h3>
                            {hasSizeChart && (
                                <button className="text-xs font-bold text-indigo-600 hover:underline">
                                    View Size Chart
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                            {sortedSizes.map((size) => (
                                <div key={size.name} className="flex flex-col items-center gap-1.5">
                                    <label className="text-xs font-bold text-gray-500">{size.name}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={sizeQuantities[size.name] || ''}
                                        onChange={(e) => handleSizeQuantityChange(size.name, e.target.value)}
                                        placeholder="0"
                                        className="w-full h-10 text-center border-gray-300 rounded-lg focus:ring-black focus:border-black transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 italic">Minimum order: {MOQ} units</span>
                            <span className={`font-bold ${totalQuantity >= MOQ ? 'text-green-600' : 'text-gray-400'}`}>
                                Total: {totalQuantity} Units
                            </span>
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">3. Artwork & Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileInput label="Upload Logo" file={logoFile} setFile={setLogoFile} accept="image/*,.ai,.eps,.pdf" />
                            <FileInput label="Reference Image" file={designFile} setFile={setDesignFile} accept="image/*,.pdf" />
                        </div>
                    </div>

                    {/* Custom Jersey Features */}
                    {isCustomJersey && (
                        <div className="space-y-4 p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900">4. Names & Numbers</h3>
                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">Jersey Features</span>
                            </div>
                            
                            <div className="space-y-2">
                                {customizations.map((cust, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="NAME"
                                            value={cust.name}
                                            onChange={(e) => handleCustomizationChange(idx, 'name', e.target.value)}
                                            className="flex-grow h-9 text-xs border-indigo-200 rounded-md uppercase placeholder:text-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="#"
                                            value={cust.number}
                                            onChange={(e) => handleCustomizationChange(idx, 'number', e.target.value)}
                                            className="w-14 h-9 text-xs text-center border-indigo-200 rounded-md placeholder:text-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <select
                                            value={cust.size}
                                            onChange={(e) => handleCustomizationChange(idx, 'size', e.target.value)}
                                            className="w-20 h-9 text-xs border-indigo-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">SIZE</option>
                                            {sizesWithQuantity.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                        <button onClick={() => handleRemoveCustomization(idx)} className="p-2 text-indigo-300 hover:text-red-500 transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={handleAddCustomization}
                                className="w-full py-2 border border-dashed border-indigo-300 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                + Add Row
                            </button>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleAddToQuote}
                        className={`w-full py-4 rounded-xl text-lg font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] ${
                            totalQuantity >= MOQ 
                            ? 'bg-black text-white hover:bg-gray-800' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {totalQuantity >= MOQ ? 'Add to Quote Request' : `Need ${MOQ - totalQuantity} more to reach MOQ`}
                    </button>

                    {/* Product Tabs (Additional Info) */}
                    <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {material && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Fabric & Care</h4>
                                <div className="p-4 bg-gray-50 rounded-lg group cursor-pointer" onClick={() => openCareModal(material.careImageUrl)}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{material.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{material.description}</p>
                                        </div>
                                        <div className="w-10 h-10 flex-shrink-0 bg-white rounded-md border border-gray-200 p-1 group-hover:border-black transition-colors">
                                            <img src={material.imageUrl} alt={material.name} className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {product.details && (
                             <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Technical Specs</h4>
                                <ul className="space-y-1.5">
                                    {Object.entries(product.details).map(([key, value]) => (
                                        <li key={key} className="flex justify-between text-xs py-1 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium">{key}</span>
                                            <span className="text-gray-900 font-bold">{String(value)}</span>
                                        </li>
                                    ))}
                                </ul>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-16 border-t border-gray-200">
                    <h2 className="font-oswald text-2xl md:text-3xl text-center mb-8 uppercase tracking-wider text-gray-900">
                        You May Also Like
                    </h2>
                    <ProductGrid products={relatedProducts} onProductClick={(p) => onProductClick(p)} />
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

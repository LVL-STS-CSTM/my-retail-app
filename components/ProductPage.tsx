
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


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, FaqItem, Material, View } from '../types';
import { SearchIcon, CloseIcon } from './icons';

// --- Props Interface ---
interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onProductClick: (product: Product) => void;
    onNavigate: (page: View, value?: string | null) => void;
    collections: string[];
    faqs: FaqItem[];
    materials: Material[];
}

// --- Result Types ---
type SearchResultProduct = { type: 'product'; data: Product };
type SearchResultCategory = { type: 'category'; data: { name: string; type: 'group' | 'category' } };
type SearchResultFaq = { type: 'faq'; data: FaqItem };
type SearchResultMaterial = { type: 'material'; data: Material };

type CategorizedResults = {
    products: SearchResultProduct[];
    categories: SearchResultCategory[];
    help: (SearchResultFaq | SearchResultMaterial)[];
};

// --- Highlight Component ---
const Highlight: React.FC<{ text: string | undefined; highlight: string }> = ({ text = '', highlight }) => {
    if (!highlight.trim() || !text) {
        return <span>{text}</span>;
    }
    // Escape regex special characters in the highlight string
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
        <span className="truncate">
            {parts.map((part, i) =>
                regex.test(part) ? <strong key={i} className="font-bold text-black">{part}</strong> : <span key={i}>{part}</span>
            )}
        </span>
    );
};

// --- Quick Searches ---
const quickSearches = ['Hoodies', 'Caps', 'Custom Jerseys', 'Bestsellers', 'Workwear'];

// --- Main Component ---
const SearchModal: React.FC<SearchModalProps> = ({
    isOpen,
    onClose,
    products,
    onProductClick,
    onNavigate,
    collections,
    faqs,
    materials
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // --- Effects ---
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            setTimeout(() => setSearchTerm(''), 300);
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // --- Search Logic ---
    const results = useMemo<CategorizedResults>(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        if (!lowercasedTerm) {
            return { products: [], categories: [], help: [] };
        }

        const matchedProducts = products
            .filter(p =>
                p.name.toLowerCase().includes(lowercasedTerm) ||
                p.description.toLowerCase().includes(lowercasedTerm) ||
                p.category.toLowerCase().includes(lowercasedTerm) ||
                (p.isBestseller && 'bestsellers'.includes(lowercasedTerm))
            )
            .map(p => ({ type: 'product', data: p } as SearchResultProduct))
            .slice(0, 5); // Limit product results

        const matchedCollections = collections
            .filter(c => c.toLowerCase().includes(lowercasedTerm))
            .map(c => ({ type: 'category', data: { name: c, type: 'group' } } as SearchResultCategory));

        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
        const matchedCategories = uniqueCategories
            .filter(c => c.toLowerCase().includes(lowercasedTerm))
            .map(c => ({ type: 'category', data: { name: c, type: 'category' } } as SearchResultCategory));
        
        const allCategories = [...matchedCollections, ...matchedCategories].slice(0, 4);

        // FIX: Explicitly typing the `f` parameter as `FaqItem` in the filter callback lets TypeScript know its type and access its properties like 'question' and 'answer'.
        const matchedFaqs = faqs
            .filter((f: FaqItem) => f.question.toLowerCase().includes(lowercasedTerm) || f.answer.toLowerCase().includes(lowercasedTerm))
            .map(f => ({ type: 'faq', data: f } as SearchResultFaq));

        const matchedMaterials = materials
            .filter(m => m.name.toLowerCase().includes(lowercasedTerm) || m.description.toLowerCase().includes(lowercasedTerm))
            .map(m => ({ type: 'material', data: m } as SearchResultMaterial));
        
        const allHelp = [...matchedFaqs, ...matchedMaterials].slice(0, 4);

        return { products: matchedProducts, categories: allCategories, help: allHelp };
    }, [searchTerm, products, collections, faqs, materials]);

    const hasResults = results.products.length > 0 || results.categories.length > 0 || results.help.length > 0;

    // --- Render Functions ---
    const renderContent = () => {
        if (searchTerm.trim() && !hasResults) {
            return (
                <div className="p-8 text-center text-gray-500">
                    <h3 className="text-lg font-semibold text-gray-800">No results found for "{searchTerm}"</h3>
                    <p className="mt-2">Try a different search term or browse our full collection.</p>
                    <button 
                        onClick={() => onNavigate('catalogue')}
                        className="mt-4 px-4 py-2 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800"
                    >
                        View Full Catalogue
                    </button>
                </div>
            );
        }

        if (searchTerm.trim() && hasResults) {
            return (
                <div className="divide-y divide-gray-100">
                    {results.products.length > 0 && (
                        <div className="p-4">
                            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Products</h3>
                            <ul className="space-y-2">
                                {results.products.map(({ data: p }) => {
                                    const allImages = Object.values(p.imageUrls || {}).flat();
                                    const imageUrl = allImages[0] || 'https://placehold.co/100x120?text=No+Image';
                                    return (
                                        <li key={p.id}>
                                            <button className="w-full text-left flex items-center p-2 rounded-md hover:bg-gray-100" onClick={() => onProductClick(p)}>
                                                <img src={imageUrl} alt={p.name} className="w-12 h-16 object-cover rounded-md mr-4 bg-gray-100" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800"><Highlight text={p.name} highlight={searchTerm} /></p>
                                                    <p className="text-sm text-gray-500"><Highlight text={p.category} highlight={searchTerm} /></p>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    {results.categories.length > 0 && (
                         <div className="p-4">
                            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Categories</h3>
                            <ul className="space-y-1">
                                {results.categories.map(({ data: c }) => (
                                    <li key={c.name}>
                                        <button className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={() => onNavigate('catalogue', c.name)}>
                                            <Highlight text={c.name} highlight={searchTerm} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                     {results.help.length > 0 && (
                         <div className="p-4">
                            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Help & Info</h3>
                            <ul className="space-y-1">
                                {results.help.map((item) => {
                                    const key = item.type + '-' + item.data.id;
                                    const text = item.type === 'faq' ? item.data.question : item.data.name;
                                    const page = item.type === 'faq' ? 'faq' : 'materials';
                                    return (
                                        <li key={key}>
                                            <button className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={() => onNavigate(page)}>
                                                <Highlight text={text} highlight={searchTerm} />
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        return ( // Default view when search is empty
            <div className="p-6">
                <h3 className="font-semibold text-gray-700 mb-3">Quick Searches</h3>
                <div className="flex flex-wrap gap-2">
                    {quickSearches.map(term => (
                        <button 
                            key={term} 
                            onClick={() => setSearchTerm(term)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="fixed inset-0 bg-white/70 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl z-10 border border-gray-200">
                <div className="flex items-center p-4 border-b border-gray-200">
                    <SearchIcon className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for products, categories, and more..."
                        className="w-full text-lg bg-transparent focus:outline-none"
                    />
                    <button onClick={onClose} className="ml-3 text-gray-400 hover:text-black flex-shrink-0">
                        <CloseIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;

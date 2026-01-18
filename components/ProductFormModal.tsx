import React, { useState, useEffect } from 'react';
import { Product, Color, ProductSize } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon, PlusIcon, TrashIcon, SparklesIcon, ChevronDownIcon } from './icons';
import { generateProductDescription } from '../services/geminiService';

const isHexColor = (hex: string): boolean => /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex);

const toSlug = (str: string) => str.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

const getTextColorForBg = (hexColor: string): 'black' | 'white' => {
    if (!isHexColor(hexColor)) return 'black';
    try {
        let cleanHex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(char => char + char).join('');
        }
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? 'black' : 'white';
    } catch (e) {
        return 'black';
    }
};

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit: Product | null;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    urlSlug: '',
    imageUrls: {},
    url: '#',
    isBestseller: false,
    description: '',
    availableSizes: [],
    availableColors: [],
    category: '',
    categoryGroup: '',
    gender: 'Unisex',
    displayOrder: 0,
    price: 0,
    colors: [],
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, productToEdit }) => {
    const { products, collections, materials, updateData } = useData();
    const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(productToEdit || emptyProduct);
    const [manualId, setManualId] = useState('');
    const [idError, setIdError] = useState('');
    const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    
    // Accordion State
    const [expandedColors, setExpandedColors] = useState<Set<string>>(new Set());

    const toggleColorAccordion = (colorName: string) => {
        setExpandedColors(prev => {
            const next = new Set(prev);
            if (next.has(colorName)) {
                next.delete(colorName);
            } else {
                next.add(colorName);
            }
            return next;
        });
    };

    const addProduct = (newProduct: Product) => {
        const newProducts = [...products, newProduct];
        updateData('products', newProducts);
    }
    const updateProduct = (updatedProduct: Product) => {
        const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        updateData('products', newProducts);
    }

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                ...emptyProduct,
                ...productToEdit
            });
            // Expand all sections by default when editing
            setExpandedColors(new Set(productToEdit.availableColors.map(c => c.name)));
            setManualId('');
            setIdError('');
        } else {
            const defaultData = { ...emptyProduct };
            if (collections.length > 0) {
                defaultData.categoryGroup = collections[0];
            }
            setFormData(defaultData);
            setExpandedColors(new Set());
            setManualId('');
            setIdError('');
        }
    }, [productToEdit, isOpen, collections]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else if (name === 'moq' || name === 'price') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
        }
        else if (name === 'name') {
            setFormData(prev => ({ ...prev, name: value, urlSlug: toSlug(value) }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleImageUrlChange = (colorName: string, index: number, value: string) => {
        setFormData(prev => {
            const newImageUrls = { ...prev.imageUrls };
            const imagesForColor = [...(newImageUrls[colorName] || [])];
            imagesForColor[index] = value;
            newImageUrls[colorName] = imagesForColor;
            return { ...prev, imageUrls: newImageUrls };
        });
    };

    const handleAddImageUrl = (colorName: string) => {
        setFormData(prev => {
            const newImageUrls = { ...prev.imageUrls };
            const imagesForColor = [...(newImageUrls[colorName] || []), ''];
            newImageUrls[colorName] = imagesForColor;
            return { ...prev, imageUrls: newImageUrls };
        });
    };

    const handleRemoveImageUrl = (colorName: string, index: number) => {
        setFormData(prev => {
            const newImageUrls = { ...prev.imageUrls };
            if (!newImageUrls[colorName]) return prev;
            
            const imagesForColor = newImageUrls[colorName].filter((_, i) => i !== index);
            newImageUrls[colorName] = imagesForColor;
            return { ...prev, imageUrls: newImageUrls };
        });
    };

    const handleSizeChange = (index: number, field: keyof ProductSize, value: string | number) => {
        const newSizes = [...formData.availableSizes];
        const updatedSize = { ...newSizes[index] };
        
        if (field === 'width' || field === 'length') {
            updatedSize[field] = Number(value) || 0;
        } else {
            updatedSize[field] = value as string;
        }

        newSizes[index] = updatedSize;
        setFormData(prev => ({ ...prev, availableSizes: newSizes }));
    };

    const handleAddSize = () => {
        setFormData(prev => ({
            ...prev,
            availableSizes: [...prev.availableSizes, { name: '', width: 0, length: 0 }]
        }));
    };

    const handleRemoveSize = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            availableSizes: prev.availableSizes.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleAddColor = () => {
        if (newColor.name && newColor.hex) {
            setFormData(prev => {
                 const newImageUrls = { ...prev.imageUrls, [newColor.name]: [] };
                 const colorObj: Color = {
                     name: newColor.name,
                     hex: newColor.hex,
                     urlSlug: toSlug(newColor.name)
                 };
                return {
                    ...prev,
                    imageUrls: newImageUrls,
                    availableColors: [...prev.availableColors, colorObj],
                    colors: [...prev.colors, newColor.name]
                }
            });
            // Automatically expand the newly added color
            setExpandedColors(prev => new Set(prev).add(newColor.name));
            setNewColor({ name: '', hex: '#000000' });
        }
    };

    const handleRemoveColor = (colorNameToRemove: string) => {
        setFormData(prev => {
            const newImageUrls = { ...prev.imageUrls };
            delete newImageUrls[colorNameToRemove];
            return {
                ...prev,
                imageUrls: newImageUrls,
                availableColors: prev.availableColors.filter(c => c.name !== colorNameToRemove),
                colors: prev.colors.filter(c => c !== colorNameToRemove)
            }
        });
        setExpandedColors(prev => {
            const next = new Set(prev);
            next.delete(colorNameToRemove);
            return next;
        });
    };
    
    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.category) {
            alert('Please enter a Product Name and Category before generating a description.');
            return;
        }
        setIsGeneratingDesc(true);
        try {
            const description = await generateProductDescription(formData.name, formData.category);
            setFormData(prev => ({ ...prev, description }));
        } catch (error) {
            console.error("Description generation failed:", error);
            alert("Failed to generate description. Please check the console for details.");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalImageUrls: { [colorName: string]: string[] } = {};
        Object.entries(formData.imageUrls).forEach(([color, urls]) => {
            const trimmedUrls = urls.map(u => u.trim()).filter(Boolean);
            if (trimmedUrls.length > 0) {
                finalImageUrls[color] = trimmedUrls;
            }
        });

        if (!formData.name || Object.values(finalImageUrls).flat().length === 0 || !formData.category || !formData.categoryGroup) {
            alert('Please fill out all required fields: Name, Category, Group, and at least one image URL for any color.');
            return;
        }

        const dataToSave: any = {
            ...formData,
            imageUrls: finalImageUrls,
        };
        
        if (dataToSave.materialId === '') delete dataToSave.materialId;

        if (productToEdit && 'id' in dataToSave) {
            updateProduct(dataToSave as Product);
            onClose();
        } else {
            const trimmedId = manualId.trim();
            if (!trimmedId) {
                setIdError('Product ID cannot be empty.');
                return;
            }
            if (products.some(p => p.id === trimmedId)) {
                setIdError('This Product ID is already in use. Please choose another.');
                return;
            }

            const newProduct: Product = {
                ...(dataToSave as Omit<Product, 'id'>),
                id: trimmedId,
                displayOrder: products.length,
            };
            addProduct(newProduct);
            onClose();
        }
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID</label>
                            <input
                                type="text"
                                name="productId"
                                id="productId"
                                value={productToEdit ? productToEdit.id : manualId}
                                onChange={(e) => {
                                    if (!productToEdit) {
                                        setManualId(e.target.value.toUpperCase().replace(/\s/g, '-'));
                                        if (idError) setIdError('');
                                    }
                                }}
                                required
                                disabled={!!productToEdit}
                                className={`${darkInputStyles} ${productToEdit ? 'bg-gray-700 cursor-not-allowed' : ''}`}
                                placeholder="e.g., TSHIRT-001"
                            />
                            {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            />
                        </div>
                    </div>
                    
                    {/* Image URL Accordion Section */}
                    <div className="p-3 border rounded-md bg-gray-50">
                        <label className="block text-sm font-bold text-gray-700 mb-3 text-indigo-900">Image URLs by Color</label>
                        {formData.availableColors.length > 0 ? (
                            <div className="space-y-2">
                                {formData.availableColors.map(color => {
                                    const isExpanded = expandedColors.has(color.name);
                                    return (
                                        <div key={color.name} className="border rounded-md bg-white overflow-hidden shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => toggleColorAccordion(color.name)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span 
                                                        className="w-5 h-5 rounded-full border border-gray-300 shadow-inner" 
                                                        style={{ backgroundColor: color.hex }}
                                                    ></span>
                                                    <span className="font-semibold text-gray-800">{color.name}</span>
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {(formData.imageUrls[color.name] || []).length} images
                                                    </span>
                                                </div>
                                                <ChevronDownIcon 
                                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                                />
                                            </button>

                                            {isExpanded && (
                                                <div className="p-4 border-t bg-gray-50 space-y-3">
                                                    {(formData.imageUrls[color.name] || []).map((url, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <input 
                                                                type="url" 
                                                                value={url} 
                                                                onChange={(e) => handleImageUrlChange(color.name, index, e.target.value)} 
                                                                placeholder="https://example.com/image.jpg"
                                                                className={`flex-grow ${darkInputStyles}`}
                                                            />
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleRemoveImageUrl(color.name, index)} 
                                                                className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                                            >
                                                                <TrashIcon className="w-5 h-5"/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddImageUrl(color.name)}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center mt-1"
                                                    >
                                                        <PlusIcon className="w-4 h-4 mr-1"/> Add Another Image
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic py-2">Add colors in the section below to start uploading images.</p>
                        )}
                    </div>

                    {/* AI Description */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGeneratingDesc || !formData.name || !formData.category}
                                className="flex items-center text-xs text-indigo-600 hover:text-indigo-900 font-medium disabled:opacity-50 disabled:cursor-wait"
                            >
                                <SparklesIcon className="w-4 h-4 mr-1" />
                                {isGeneratingDesc ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>

                    {/* Taxonomy and Logistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                name="gender"
                                id="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="categoryGroup" className="block text-sm font-medium text-gray-700">Collection (Group)</label>
                            <select
                                name="categoryGroup"
                                id="categoryGroup"
                                value={formData.categoryGroup}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            >
                                <option value="" disabled>Select a collection</option>
                                {collections.map(collection => (
                                    <option key={collection} value={collection}>{collection}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="moq" className="block text-sm font-medium text-gray-700">MOQ</label>
                            <input
                                type="number"
                                name="moq"
                                id="moq"
                                value={('moq' in formData && formData.moq) ? formData.moq : ''}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="Default"
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={('price' in formData && formData.price) ? formData.price : ''}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={darkInputStyles}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="materialId" className="block text-sm font-medium text-gray-700">Material Tech (Optional)</label>
                        <select
                            name="materialId"
                            id="materialId"
                            value={formData.materialId || ''}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        >
                            <option value="">None</option>
                            {materials.map(material => (
                                <option key={material.id} value={material.id}>{material.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sizes Management */}
                    <div className="p-3 border rounded-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                        <div className="space-y-2">
                            {formData.availableSizes.map((size: ProductSize, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                    <input
                                        value={size.name}
                                        onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                                        placeholder="Size Name (e.g., L)"
                                        required
                                        className={darkInputStyles}
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={size.width}
                                        onChange={(e) => handleSizeChange(index, 'width', e.target.value)}
                                        placeholder="Width (in)"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm text-center placeholder-gray-400"
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={size.length}
                                        onChange={(e) => handleSizeChange(index, 'length', e.target.value)}
                                        placeholder="Length (in)"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm text-center placeholder-gray-400"
                                    />
                                    <button type="button" onClick={() => handleRemoveSize(index)} className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                                        <TrashIcon className="w-5 h-5 mx-auto"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                         <button type="button" onClick={handleAddSize} className="mt-3 text-sm text-indigo-600 hover:text-indigo-900 font-medium flex items-center">
                            <PlusIcon className="w-4 h-4 mr-1"/> Add Size
                        </button>
                    </div>

                    {/* Color Management */}
                    <div className="p-3 border rounded-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                        <div className="flex gap-2 mb-2 items-center">
                            <input
                                value={newColor.name}
                                onChange={e => setNewColor(c => ({ ...c, name: e.target.value }))}
                                placeholder="Color Name"
                                className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-colors"
                                style={{
                                    backgroundColor: isHexColor(newColor.hex) ? newColor.hex : '#FFFFFF',
                                    color: getTextColorForBg(newColor.hex)
                                }}
                            />
                            <input
                                value={newColor.hex}
                                onChange={e => setNewColor(c => ({ ...c, hex: e.target.value }))}
                                placeholder="Hex Code"
                                className="w-28 mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-colors"
                                style={{
                                    backgroundColor: isHexColor(newColor.hex) ? newColor.hex : '#FFFFFF',
                                    color: getTextColorForBg(newColor.hex)
                                }}
                            />
                             <input type="color" value={newColor.hex} onChange={e => setNewColor(c => ({...c, hex: e.target.value}))} className="w-9 h-9 p-0 border-none rounded-md cursor-pointer" />
                            <button type="button" onClick={handleAddColor} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"><PlusIcon className="w-5 h-5"/></button>
                        </div>
                         <div className="flex flex-wrap gap-2">
                            {formData.availableColors.map(color => (
                                <span key={color.name} className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium pl-1 pr-2 py-1 rounded-full border border-gray-200 shadow-sm">
                                    <span style={{backgroundColor: color.hex}} className="w-4 h-4 rounded-full mr-1.5 border border-gray-300"></span>
                                    {color.name}
                                    <button type="button" onClick={() => handleRemoveColor(color.name)} className="ml-1.5 hover:text-red-600 transition-colors"><CloseIcon className="w-3 h-3"/></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bestseller Toggle */}
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isBestseller"
                                name="isBestseller"
                                type="checkbox"
                                checked={formData.isBestseller}
                                onChange={handleInputChange}
                                className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isBestseller" className="font-medium text-gray-700">Mark as Bestseller</label>
                            <p className="text-gray-500">Bestsellers are featured on the homepage.</p>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f] transition-colors shadow-md">
                            Save Product
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
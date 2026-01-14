import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import ProductFormModal from './ProductFormModal';
import { DragHandleIcon, SearchIcon } from './icons';

// A simple sort icon component to show sort direction
const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    if (!direction) return <span className="w-4 h-4 inline-block text-gray-400"></span>; // No icon if not active sort key
    return direction === 'asc' ? <span className="w-4 h-4 inline-block ml-1">↑</span> : <span className="w-4 h-4 inline-block ml-1">↓</span>;
};

type SortableKeys = 'id' | 'name' | 'category' | 'categoryGroup' | 'gender';

const ProductManagement: React.FC = () => {
    const { products, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    // State for searching and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>(null);

    // State for drag-and-drop reordering
    const [localProductOrder, setLocalProductOrder] = useState<Product[]>([]);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // We are in reordering mode only if no search or sort is active.
    const isReorderingMode = !searchTerm && !sortConfig;

    // Initialize local order whenever the canonical product list from context changes.
    useEffect(() => {
        setLocalProductOrder([...products].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setHasOrderChanges(false);
    }, [products]);

    // Memoize the list of products to be displayed based on current state.
    const displayedProducts = useMemo(() => {
        // Start with the correct source: local order for reordering, canonical list otherwise.
        let items: Product[] = isReorderingMode ? [...localProductOrder] : [...products];

        // Apply search filter if there's a search term.
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            items = items.filter(p =>
                p.id.toLowerCase().includes(lowercasedTerm) ||
                p.name.toLowerCase().includes(lowercasedTerm) ||
                p.category.toLowerCase().includes(lowercasedTerm) ||
                p.categoryGroup.toLowerCase().includes(lowercasedTerm) ||
                p.gender.toLowerCase().includes(lowercasedTerm)
            );
        }

        // Apply sorting if a sort config is set.
        if (sortConfig) {
            items.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else if (!isReorderingMode) {
            // If not reordering but also not sorting, use the default display order.
            items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        }

        return items;
    }, [products, localProductOrder, searchTerm, sortConfig, isReorderingMode]);
    
    // Toggles sorting direction or changes sort key.
    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Resets view to default reordering mode.
    const resetToReorderingMode = () => {
        setSortConfig(null);
        setSearchTerm('');
    };

    const handleAddNew = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            const newProducts = products.filter(p => p.id !== productId);
            updateData('products', newProducts);
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        dragItem.current = index;
        e.currentTarget.classList.add('bg-gray-100', 'shadow-lg');
    };

    const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.classList.remove('bg-gray-100', 'shadow-lg');
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            const newProducts = [...localProductOrder];
            const draggedItemContent = newProducts.splice(dragItem.current, 1)[0];
            newProducts.splice(dragOverItem.current, 0, draggedItemContent);
            setLocalProductOrder(newProducts);
            setHasOrderChanges(true);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };
    
    // Save/Cancel for reordering
    const handleSaveOrder = () => {
        const reorderedProducts = localProductOrder.map((p, index) => ({ ...p, displayOrder: index }));
        updateData('products', reorderedProducts);
        setHasOrderChanges(false);
    };

    const handleCancelOrderChanges = () => {
        setLocalProductOrder([...products].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setHasOrderChanges(false);
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center flex-wrap gap-4">
                     <div className="relative w-full md:w-auto md:flex-grow max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search by ID, name, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm placeholder-gray-500"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {isReorderingMode && hasOrderChanges && (
                            <>
                                <button
                                    onClick={handleCancelOrderChanges}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveOrder}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Save Order
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                        >
                            Add New Product
                        </button>
                    </div>
                </div>

                {!isReorderingMode && (
                    <div className="p-3 bg-blue-50 border-b text-center text-sm text-blue-700">
                        Search or sort is active. Drag-and-drop reordering is disabled. 
                        <button onClick={resetToReorderingMode} className="font-semibold underline ml-2">Reset view</button>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                  className="px-3 py-3 w-10 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                  onClick={resetToReorderingMode}
                                  title="Reset to default reordering view"
                                >
                                    #
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                    onClick={() => requestSort('id')}
                                >
                                    Product ID <SortIcon direction={sortConfig?.key === 'id' ? sortConfig.direction : undefined} />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                    onClick={() => requestSort('name')}
                                >
                                    Product Name <SortIcon direction={sortConfig?.key === 'name' ? sortConfig.direction : undefined} />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                    onClick={() => requestSort('category')}
                                >
                                    Category <SortIcon direction={sortConfig?.key === 'category' ? sortConfig.direction : undefined} />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                    onClick={() => requestSort('categoryGroup')}
                                >
                                    Group <SortIcon direction={sortConfig?.key === 'categoryGroup' ? sortConfig.direction : undefined} />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                    onClick={() => requestSort('gender')}
                                >
                                    Gender <SortIcon direction={sortConfig?.key === 'gender' ? sortConfig.direction : undefined} />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOQ</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bestseller</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {displayedProducts.map((product, index) => (
                                <tr 
                                    key={product.id}
                                    draggable={isReorderingMode}
                                    onDragStart={isReorderingMode ? (e) => handleDragStart(e, index) : undefined}
                                    onDragEnter={isReorderingMode ? (e) => handleDragEnter(e, index) : undefined}
                                    onDragEnd={isReorderingMode ? handleDragEnd : undefined}
                                    onDragOver={isReorderingMode ? (e) => e.preventDefault() : undefined}
                                    className={`transition-shadow ${isReorderingMode ? 'cursor-grab' : ''}`}
                                >
                                    <td className="px-3 py-4 whitespace-nowrap text-gray-400 text-center">
                                        {isReorderingMode ? <DragHandleIcon className="w-5 h-5 inline-block"/> : index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{product.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoryGroup}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.moq ?? (product.category === 'Custom Jerseys' ? 1 : 12)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.isBestseller ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {displayedProducts.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-10 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <ProductFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    productToEdit={productToEdit}
                />
            )}
        </>
    );
};

export default ProductManagement;
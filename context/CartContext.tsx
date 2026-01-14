import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { QuoteItem, Product, Color } from '../types';

/**
 * @interface QuoteContextType
 * @description Defines the shape of the context that will be provided to consumers.
 * @property {QuoteItem[]} quoteItems - The array of items currently in the quote list.
 * @property {(...args) => void} addToQuote - Function to add a new item (or update an existing one) to the quote list.
 * @property {(quoteItemId: string) => void} removeFromQuote - Function to remove an item from the quote list.
 * @property {() => void} clearQuote - Function to empty the entire quote list.
 */
interface QuoteContextType {
    quoteItems: QuoteItem[];
    addToQuote: (product: Product, color: Color, sizeQuantities: { [key: string]: number }, logoFile?: File, designFile?: File, customizations?: { name: string; number: string; size: string }[]) => void;
    removeFromQuote: (quoteItemId: string) => void;
    clearQuote: () => void;
}

// Create the context with an initial value of undefined.
const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

/**
 * @description The provider component that wraps parts of the app that need access to the quote state.
 * It manages the quote state and provides the context value to its children.
 */
export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize state by trying to load from localStorage first.
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
        try {
            const localData = localStorage.getItem('quoteItems');
            if (localData) {
                // The loaded data will not have File objects because they cannot be serialized into JSON.
                // This is an accepted limitation for this feature. Files must be re-uploaded on a new session.
                return JSON.parse(localData);
            }
        } catch (error) {
            console.error("Could not parse quote items from localStorage", error);
        }
        return [];
    });

    // useEffect hook to persist the quoteItems state to localStorage whenever it changes.
    useEffect(() => {
        try {
            // Create a version of the items without the File objects before storing.
            const itemsToStore = quoteItems.map(item => {
                const { logoFile, designFile, ...rest } = item;
                return rest; // `rest` contains all properties except the files.
            });
            localStorage.setItem('quoteItems', JSON.stringify(itemsToStore));
        } catch (error) {
            console.error("Could not save quote items to localStorage", error);
        }
    }, [quoteItems]);

    /**
     * @description Adds a configured product to the quote list.
     * If an item with the same product ID and color already exists (and is not a custom jersey), it updates the quantities.
     * Otherwise, it adds a new item to the list. Custom jerseys are always added as new, unique items.
     */
    const addToQuote = (product: Product, color: Color, sizeQuantities: { [key: string]: number }, logoFile?: File, designFile?: File, customizations?: { name: string; number: string; size: string }[]) => {
        const isCustomizableItem = product.category === 'Custom Jerseys' && customizations && customizations.length > 0;

        // Always generate a unique ID for custom items to prevent merging.
        // For standard items, the ID is based on product and color to allow merging quantities.
        const quoteItemId = isCustomizableItem
            ? `custom-${product.id}-${color.name}-${Date.now()}`
            : `${product.id}-${color.name}`;
        
        setQuoteItems(prevItems => {
            // Find existing item only if it's NOT a custom item.
            const existingItemIndex = !isCustomizableItem
                ? prevItems.findIndex(item => item.quoteItemId === quoteItemId)
                : -1;
            
            // If the item already exists (and is not custom), update its quantities.
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingItemIndex];
                const newSizeQuantities = { ...existingItem.sizeQuantities };

                for (const size in sizeQuantities) {
                    newSizeQuantities[size] = (newSizeQuantities[size] || 0) + sizeQuantities[size];
                }
                
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    sizeQuantities: newSizeQuantities,
                    // Replace files if new ones are provided.
                    logoFile: logoFile || existingItem.logoFile,
                    designFile: designFile || existingItem.designFile,
                };
                return updatedItems;

            } else {
                // If the item is new OR it's a custom item, add it to the list.
                const newItem: QuoteItem = {
                    quoteItemId,
                    product,
                    selectedColor: color,
                    sizeQuantities,
                    logoFile,
                    designFile,
                    customizations,
                };
                return [...prevItems, newItem];
            }
        });
    };

    /**
     * @description Removes an item from the quote list based on its unique quoteItemId.
     */
    const removeFromQuote = (quoteItemId: string) => {
        setQuoteItems(prevItems => prevItems.filter(item => item.quoteItemId !== quoteItemId));
    };
    
    /**
     * @description Clears all items from the quote list.
     */
    const clearQuote = () => {
        setQuoteItems([]);
    };

    // Provide the state and functions to all children of this provider.
    return (
        <QuoteContext.Provider value={{ quoteItems, addToQuote, removeFromQuote, clearQuote }}>
            {children}
        </QuoteContext.Provider>
    );
};

/**
 * @description A custom hook for easy access to the QuoteContext.
 * This simplifies consuming the context in other components.
 * @returns {QuoteContextType} The context value.
 */
export const useQuote = (): QuoteContextType => {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
};
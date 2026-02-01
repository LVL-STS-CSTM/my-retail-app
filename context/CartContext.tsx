
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ProductColor } from '../types';

interface CartItem {
    product: Product;
    color: ProductColor;
    size: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string, colorName: string, size: string) => void;
    updateQuantity: (productId: string, colorName: string, size: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                i => i.product.id === newItem.product.id && i.color.name === newItem.color.name && i.size === newItem.size
            );
            if (existingItem) {
                return prevItems.map(i =>
                    i.product.id === newItem.product.id && i.color.name === newItem.color.name && i.size === newItem.size
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            } else {
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromCart = (productId: string, colorName: string, size: string) => {
        setCartItems(prevItems => prevItems.filter(
            i => !(i.product.id === productId && i.color.name === colorName && i.size === size)
        ));
    };

    const updateQuantity = (productId: string, colorName: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, colorName, size);
        } else {
            setCartItems(prevItems => prevItems.map(i =>
                i.product.id === productId && i.color.name === colorName && i.size === size
                    ? { ...i, quantity }
                    : i
            ));
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

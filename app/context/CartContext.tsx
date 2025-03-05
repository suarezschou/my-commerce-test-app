// app/context/CartContext.tsx
'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

interface CartContextType {
    cartId: string | null;
    setCartId: (cartId: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartId, setCartId] = useState<string | null>(null);

    return (
        <CartContext.Provider value={{ cartId, setCartId }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
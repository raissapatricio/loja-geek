import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
  shipping: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // Chave individual para cada usuário (ou 'guest' se deslogado)
  const cartStorageKey = user?.id ? `securecommerce_cart_${user.id}` : 'securecommerce_cart_guest';

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(cartStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sempre que o usuário logar, trocar de conta ou deslogar, carrega o carrinho específico dele
  useEffect(() => {
    try {
      const stored = localStorage.getItem(cartStorageKey);
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  }, [cartStorageKey]);

  // Persiste as alterações no carrinho do usuário ativo
  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items, cartStorageKey]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId) {
          return { ...i, quantity: Math.min(quantity, i.product.stock) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(cartStorageKey);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 299 ? 0 : subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}


import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCartProduct, getAddToCartProduct } from '@/services/user/cartService'
import { useToast } from "../hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: {
    id: string;
    userId: string
  }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getAddToCart: (id: string) => void
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {

  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (data) => {
    const req = { productId: data?.id, userId: data?.userId };
    try {
      const res = await addToCartProduct(req);
      if (res?.status === "success") {
        toast({
          title: "Added to Cart",
          description: "Product has been added to your cart successfully.",
          variant: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Failed to Add",
          description: res?.message || "Could not add product to cart.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Server Error",
        description: error?.response?.data?.message || "Something went wrong while adding to cart.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };


  const getAddToCart = async (userId: string) => {
    const req = { userId: userId };
    try {
      const res = await getAddToCartProduct(req);

      if (res?.status === "success") {
        setItems(res.cart || []);
      } else {
        toast({
          title: "Unable to Fetch Cart",
          description: res?.message || "No cart items found or request failed.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Server Error",
        description: error?.response?.data?.message || "Something went wrong while fetching cart items.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };


  const isInCart = (id: string): boolean => {
    return items.some(item => item.id === id);
  };

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  
  // const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0)  || 0;
  const totalItems = 0

  // const totalPrice = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalPrice = 0

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isInCart,
      getAddToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

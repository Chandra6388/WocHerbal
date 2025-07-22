
import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCartProduct, getAddToCartProduct, updateCartItem, removeCartItem } from '@/services/user/cartService'
import { useToast } from "../hooks/use-toast";
import { getUserFromToken } from '@/Utils/TokenData';
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  product: {
    _id: string,
    name: string,
    description: string,
    benefits: string,
    price: number,
    ratings: number,
    images: string;
    category: string,
    weight: number,
    stock: number,
    numOfReviews: number,

  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: {
    id: string;
    userId: string
  }) => void;
  removeFromCart: (id: string, userId: string) => void;
  updateQuantity: (id: string, quantity: number, userId: string) => void;
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
  const [items, setItems] = useState([]);
  const userdata = getUserFromToken() as { id: string };
  const { isAuthenticated } = useAuth();

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
        getAddToCart(data?.userId)
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

   useEffect(() => {
    if (userdata?.id) {
        getAddToCart(userdata.id);
    }
    if(!isAuthenticated){
      setItems([])
    }
  }, [userdata?.id , isAuthenticated]);

  const getAddToCart = async (userId: string) => {
    const req = { userId: userId };
    try {
      const res = await getAddToCartProduct(req);

      if (res?.status === "success") {
        setItems(res.cart?.items || []);
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
    return items.some(item => item?.product?._id === id);
  };

  const removeFromCart = async (id: string, userId: string) => {
    const req = { id, userId };

    try {
      const res = await removeCartItem(req);

      if (res?.status === "success") {
        setItems(current => current.filter(item => item.id !== id));
        getAddToCart(userId)
        toast({
          title: "Item Removed",
          description: "The product has been removed from your cart.",
          variant: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Failed to Remove",
          description: res?.message || "Unable to remove the item from the cart.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error removing cart item:", error);
      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while removing the item from your cart.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number, userId: string) => {
    const req = { productId: id, quantity, userId };
    try {
      const res = await updateCartItem(req);
      if (res?.status === "success") {
        toast({
          title: "Success",
          description: "Cart value updated successfully.",
          variant: "success",
          duration: 3000,
        });
        getAddToCart(userId)
        setItems(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );

      } else {
        toast({
          title: "Unable to Update Cart",
          description: res?.message || "Something went wrong.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error updating cart quantity:", error);
      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while updating the cart.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const clearCart = () => {
    setItems([]);
  };


  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

import React from 'react';
import { X, ShoppingCart, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface AddToCartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const AddToCartPopup = ({ isOpen, onClose, product }: AddToCartPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-semibold">Added to Cart!</span>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-2xl font-bold text-accent">₹{product.price}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Link to="/cart" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddToCartPopup;
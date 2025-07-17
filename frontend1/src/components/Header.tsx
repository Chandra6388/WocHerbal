import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Menu, X, ShoppingCart, User, LogOut, Settings, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import ReviewUpload from './ReviewUpload';
import { useIsMobile } from '../hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReviewUpload, setShowReviewUpload] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminAccess = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-cream-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-forest-500 to-earth-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-playfair font-bold text-forest-800">WocHerbal</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-forest-700 hover:text-forest-500 transition-colors">Home</Link>
            <Link to="/user/products" className="text-forest-700 hover:text-forest-500 transition-colors">Products</Link>
            <Link to="/blog" className="text-forest-700 hover:text-forest-500 transition-colors">Blogs</Link>
            <Link to="/about" className="text-forest-700 hover:text-forest-500 transition-colors">About</Link>
            <Link to="/testimonials" className="text-forest-700 hover:text-forest-500 transition-colors">Testimonials</Link>
            <Link to="/contact" className="text-forest-700 hover:text-forest-500 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setShowReviewUpload(true)}
                className="p-2 text-forest-700 hover:text-forest-500 transition-colors"
                title="Write a Review"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            )}
            
            <Link to="/user/cart" className="relative p-2 text-forest-700 hover:text-forest-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-earth-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-forest-700">Hi, {user.name}</span>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminAccess}
                    className="text-xs"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                )}
                <Link to="/user/profile" className="p-2 text-forest-700 hover:text-forest-500 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-forest-700 hover:text-forest-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <button
              className="md:hidden p-2 text-forest-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cream-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-forest-700 hover:text-forest-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-forest-700 hover:text-forest-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/blog"
                className="text-forest-700 hover:text-forest-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>
              <button
                onClick={() => {
                  setShowReviewUpload(true);
                  setIsMenuOpen(false);
                }}
                className="text-forest-700 hover:text-forest-500 transition-colors text-left"
              >
                Review
              </button>
            </nav>
          </div>
        )}

        {showReviewUpload && (
          <ReviewUpload onClose={() => setShowReviewUpload(false)} />
        )}
      </div>
    </header>
  );
};

export default Header;
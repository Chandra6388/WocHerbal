import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { getPrimaryProduct } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import AddToCartPopup from './AddToCartPopup';

const HeroSection = () => {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const primaryProduct = getPrimaryProduct();

  const handleAddToCart = () => {
   navigate('/checkout', { state: { product: primaryProduct, quantity: 1 } });
  };

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-br from-background via-accent/5 to-muted/10">
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Product Image */}
          <div className="relative mb-8">
            <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 to-muted/5 relative group">
              <img 
                src={primaryProduct.images} 
                alt={primaryProduct.name}
                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Price and Buy Button */}
          <div className="text-center mb-8 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-bold text-foreground">₹{primaryProduct.price}</span>
              <span className="text-xl text-muted-foreground line-through">₹{primaryProduct.originalPrice}</span>
              <div className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                {Math.round(((primaryProduct.originalPrice - primaryProduct.price) / primaryProduct.originalPrice) * 100)}% OFF
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-muted-foreground">({primaryProduct.reviews} reviews)</span>
            </div>

            <Button 
              variant="premium" 
              size="lg" 
              className="group w-full max-w-xs"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Buy Now - ₹{primaryProduct.price}
            </Button>
          </div>

          {/* Hero Text Content */}
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Packed with 100 Benefits
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground leading-tight">
                Packed with{' '}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  100 Benefits
                </span>{' '}
                in Every Drop.
              </h1>
              
              <p className="text-lg text-muted-foreground">
                WOC Herbal Hair Oil brings you the perfect blend of traditional Ayurveda and modern science. 
                Each bottle contains 30+ carefully selected natural ingredients for complete hair transformation.
              </p>
            </div>
            {/* Product highlights */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground text-sm">Made in India</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground text-sm">100% Authentic Ingredients</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground text-sm">Aromatic Therapy</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground text-sm">Long-Lasting Results</span>
              </div>
            </div>

            <Link to="/products">
              <Button variant="outline" size="lg" className="w-full max-w-xs">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Packed with 100 Benefits
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight">
                Packed with{' '}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  100 Benefits
                </span>{' '}
                in Every Drop.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                WOC Herbal Hair Oil brings you the perfect blend of traditional Ayurveda and modern science. 
                Each bottle contains 30+ carefully selected natural ingredients for complete hair transformation.
              </p>
            </div> 

            {/* Product highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Made in India</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">100% Authentic Ingredients</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Aromatic Therapy</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Long-Lasting Results</span>
              </div>
            </div>

            {/* Pricing and CTA */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl md:text-4xl font-bold text-foreground">₹{primaryProduct.price}</span>
                <span className="text-xl text-muted-foreground line-through">₹{primaryProduct.originalPrice}</span>
                <div className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                  {Math.round(((primaryProduct.originalPrice - primaryProduct.price) / primaryProduct.originalPrice) * 100)}% OFF
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-muted-foreground">({primaryProduct.reviews} reviews)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="premium" 
                  size="lg" 
                  className="group"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Buy Now - ₹{primaryProduct.price}
                </Button>
                <Link to="/products">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Product Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 to-muted/5 relative group">
              <img 
                src={primaryProduct.images} 
                alt={primaryProduct.name}
                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Floating elements for visual appeal */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>

      {/* Add to Cart Popup */}
      <AddToCartPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
        product={{
          id: primaryProduct._id,
          name: primaryProduct.name,
          price: primaryProduct.price,
          image: primaryProduct.images
        }} 
      />
    </section>
  );
};

export default HeroSection;
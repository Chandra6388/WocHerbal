
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Shield, Truck, Award, Check, Sparkles, Leaf, Heart, Zap, ArrowRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { featuredProduct } from '../data/products';
import AddToCartPopup from './AddToCartPopup';

const Hero = () => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const productImages = [
    featuredProduct.image,
    "/lovable-uploads/4654272e-82ea-4eff-8386-6d9f4a2fcced.png",
    featuredProduct.image
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const keyIngredients = [
    { name: "Tulsi", benefit: "Reduces scalp odor", color: "from-green-400 to-emerald-500", icon: "🌿" },
    { name: "Amla", benefit: "Natural anti-aging", color: "from-yellow-400 to-green-500", icon: "🟢" },
    { name: "Brahmi", benefit: "Scalp soother", color: "from-blue-400 to-cyan-500", icon: "🧠" },
    { name: "Moringa", benefit: "Root strength", color: "from-green-500 to-teal-500", icon: "🌱" }
  ];

  const benefits = [
    { icon: <Shield className="w-6 h-6" />, text: "100% Natural", color: "text-green-600", bg: "bg-green-50" },
    { icon: <Award className="w-6 h-6" />, text: "Clinically Tested", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: <Truck className="w-6 h-6" />, text: "Free Delivery", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: <Star className="w-6 h-6" />, text: "1200+ Reviews", color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  const handleAddToCart = () => {
    addToCart({
      id: featuredProduct.id,
      name: featuredProduct.name,
      price: featuredProduct.price,
      image: featuredProduct.image
    });
    setIsAdded(true);
    setShowPopup(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-background via-secondary/10 to-accent/5 relative overflow-hidden">
      {/* Creative Floating Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-accent/30 to-green-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <Leaf className="w-8 h-8 text-accent/40" />
        </div>
        <div className="absolute bottom-1/3 left-1/6 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6 text-green-500/40" />
        </div>
        <div className="absolute top-2/3 right-1/6 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="w-7 h-7 text-pink-400/40" />
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Enhanced */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              {/* Premium Badge with Animation */}
              <div className="inline-flex items-center bg-gradient-to-r from-accent/10 via-green-500/10 to-accent/10 border border-accent/30 text-accent px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                🌿 Premium Ayurvedic Formula
                <Zap className="w-4 h-4 ml-2 text-yellow-500" />
              </div>
              
              {/* Enhanced Title with Creative Typography */}
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-playfair font-bold text-foreground leading-tight">
                  <span className="inline-block hover:scale-110 transition-transform duration-300">Discover</span>
                  <span className="text-accent block relative group cursor-pointer">
                    <span className="relative z-10 hover:text-green-600 transition-colors duration-300">WHY</span>
                    <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-green-400/20 to-accent/20 blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-accent to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </span>
                  <span className="bg-gradient-to-r from-accent via-green-600 to-teal-500 bg-clip-text text-transparent hover:from-green-600 hover:to-accent transition-all duration-500">WOC</span>
                </h1>
                
                {/* Animated Subtitle */}
                <div className="text-2xl md:text-3xl font-playfair text-muted-foreground mt-4">
                  IS A <span className="text-foreground font-bold bg-gradient-to-r from-foreground via-accent to-green-600 bg-clip-text text-transparent animate-pulse">GAME-CHANGER</span>
                  <br />
                  <span className="text-accent font-script text-4xl block mt-2 hover:text-green-600 transition-colors duration-300 cursor-pointer">you'll absolutely love ❤️</span>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Premium Ayurvedic herbal hair oil that combines traditional Panchgavya 
                with powerful natural ingredients for healthy, beautiful hair transformation.
                <span className="block mt-2 text-accent font-semibold">✨ Experience the magic of nature</span>
              </p>
            </div>

            {/* Enhanced Key Ingredients with Creative Layout */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center group cursor-pointer">
                <Leaf className="w-6 h-6 mr-2 text-accent group-hover:animate-spin transition-all duration-300" />
                Key Natural Ingredients
                <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {keyIngredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${ingredient.color} p-5 rounded-2xl text-white shadow-lg transform hover:scale-110 hover:rotate-2 transition-all duration-500 cursor-pointer group relative overflow-hidden`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute top-2 right-2 text-2xl group-hover:animate-bounce">
                      {ingredient.icon}
                    </div>
                    <div className="font-bold text-lg mb-1 group-hover:text-yellow-200 transition-colors">
                      {ingredient.name}
                    </div>
                    <div className="text-sm opacity-90 group-hover:opacity-100">
                      {ingredient.benefit}
                    </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-3 ${benefit.bg} backdrop-blur-sm p-5 rounded-2xl border border-accent/20 hover:shadow-xl hover:border-accent/40 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`${benefit.color} group-hover:animate-pulse`}>{benefit.icon}</div>
                  <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-4 bg-gradient-to-r from-accent via-green-600 to-teal-500 hover:from-green-600 hover:via-accent hover:to-green-700 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-accent/50 relative overflow-hidden group"
                onClick={handleAddToCart}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2 animate-bounce" />
                    Added to Cart ✨
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Add to Cart - ₹999
                  </>
                )}
              </Button>
              
              <Link to="/products">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-accent/40 hover:bg-gradient-to-r hover:from-accent/10 hover:to-green-500/10 hover:border-accent/60 transition-all duration-300 transform hover:scale-105 group">
                  <Heart className="w-5 h-5 mr-2 group-hover:text-red-500 group-hover:animate-pulse transition-colors" />
                  Explore Product
                  <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Enhanced Product Showcase */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Enhanced Background Effects */}
              <div className="absolute -inset-16 bg-gradient-to-r from-accent/10 via-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -inset-12 bg-gradient-to-l from-accent/20 to-green-400/20 rounded-3xl blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -inset-8 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-3xl blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:rotate-1 relative z-10 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-lg border-2 border-accent/30 hover:border-accent/50">
                <CardContent className="p-8 relative">
                  {/* Premium Badge with Animation */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-bounce hover:animate-spin">
                    ⭐ PREMIUM
                  </div>
                  
                  {/* Image Carousel Effect */}
                  <div className="aspect-square overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-accent/5 via-green-500/5 to-blue-500/5 relative group">
                    <img
                      src={productImages[currentImageIndex]}
                      alt={featuredProduct.name}
                      className="w-full h-full object-contain transition-all duration-1000 hover:scale-110 group-hover:rotate-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 group-hover:to-accent/10 transition-all duration-500"></div>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {productImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? 'bg-accent scale-125' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-playfair font-bold text-foreground mb-2 hover:text-accent transition-colors cursor-pointer">
                        {featuredProduct.name}
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-accent animate-pulse" />
                        {featuredProduct.volume} • Premium Ayurvedic Formula
                        <span className="ml-2 animate-bounce">🌿</span>
                      </p>
                    </div>
                    
                    {/* Enhanced Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-5 h-5 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform cursor-pointer" 
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground font-semibold">({featuredProduct.rating}/5)</span>
                      <span className="text-muted-foreground">• {featuredProduct.reviews} reviews</span>
                      <span className="text-green-600 font-semibold animate-pulse">💚</span>
                    </div>
                    
                    {/* Enhanced Pricing */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-accent/5 to-green-500/5 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-foreground">₹{featuredProduct.price}</span>
                        {featuredProduct.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">₹{featuredProduct.originalPrice}</span>
                        )}
                      </div>
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        23% OFF 🔥
                      </div>
                    </div>

                    {/* Enhanced Quick Benefits */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-accent/20">
                      {[
                        { text: "Reduces Hair Fall", color: "bg-red-500/10 text-red-600", icon: "🛡️" },
                        { text: "Natural Shine", color: "bg-yellow-500/10 text-yellow-600", icon: "✨" },
                        { text: "Scalp Health", color: "bg-blue-500/10 text-blue-600", icon: "🧠" },
                        { text: "Root Strength", color: "bg-green-500/10 text-green-600", icon: "💪" }
                      ].map((benefit, index) => (
                        <div 
                          key={index}
                          className={`text-center p-3 ${benefit.color} rounded-xl hover:scale-105 transition-transform cursor-pointer group`}
                        >
                          <div className="text-lg mb-1 group-hover:animate-bounce">{benefit.icon}</div>
                          <div className="text-xs font-semibold">{benefit.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Popup */}
      <AddToCartPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={{
          id: featuredProduct.id,
          name: featuredProduct.name,
          price: featuredProduct.price,
          image: featuredProduct.image
        }}
      />
    </section>
  );
};

export default Hero;

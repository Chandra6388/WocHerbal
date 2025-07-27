import React, { useState } from "react";
import { ShoppingBag, Star, Heart, Zap } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import AddToCartPopup from "./AddToCartPopup";

const Products = () => {
  const { addToCart, isInCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    {
      id: "1",
      name: "Immunity Boost Complex",
      description:
        "Natural blend of elderberry, echinacea, and vitamin C to strengthen your immune system.",
      price: 49.99,
      priceDisplay: "$49.99",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=300&fit=crop",
      icon: <Heart className="w-6 h-6" />,
      benefits: ["Immune Support", "Antioxidant Rich", "Daily Wellness"],
    },
    {
      id: "2",
      name: "Energy & Vitality Blend",
      description:
        "Revitalize your day with our premium ginseng and adaptogen formula.",
      price: 39.99,
      priceDisplay: "$39.99",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop",
      icon: <Zap className="w-6 h-6" />,
      benefits: ["Natural Energy", "Mental Clarity", "Stress Relief"],
    },
    {
      id: "3",
      name: "Digestive Harmony Tea",
      description:
        "Soothing blend of chamomile, ginger, and peppermint for digestive wellness.",
      price: 24.99,
      priceDisplay: "$24.99",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=300&fit=crop",
      icon: <Star className="w-6 h-6" />,
      benefits: ["Digestive Health", "Calming Effect", "Natural Relief"],
    },
  ];

  const handleAddToCart = (product: any) => {
    if (!isInCart(product.id)) {
      addToCart({
        id: product.id,
        // name: product.name,
        // price: product.price,
        // image: product.image,
        userId: "someUserId", // Replace with actual userId if needed
        quantity: 1,
      });
      setSelectedProduct(product);
      setShowPopup(true);
    }
  };

  return (
    <section id="products" className="py-20 relative">
      <div className="curved-section bg-gradient-to-b from-cream-50 to-white"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-forest-800 mb-6">
            Premium Herbal
            <span className="block bg-gradient-to-r from-forest-500 to-earth-500 bg-clip-text text-transparent">
              Wellness Collection
            </span>
          </h2>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto">
            Carefully crafted formulations that blend traditional herbal wisdom
            with modern scientific research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-fade-in-up border border-cream-200"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Mobile Layout: Image First */}
              <div className="space-y-4">
                {/* Product Image */} 
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 md:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                    <div className="text-forest-600">{product.icon}</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-earth-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    New
                  </div>
                </div>
                {/* Product Title - Mobile: Below Image */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-lg md:text-xl font-playfair font-bold text-forest-800">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-earth-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <p className="text-forest-600 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
                {/* Benefits */}
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="bg-forest-100 text-forest-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                {/* Price and CTA - Mobile: Full Width Button Below */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl md:text-2xl font-playfair font-bold text-forest-800">
                      {product.priceDisplay}
                    </span>
                  </div>

                  {/* Add to Cart Button - Mobile Optimized */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id)}
                    className={`w-full py-3 md:py-2 md:px-6 md:w-auto rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm md:text-base ${
                      isInCart(product.id)
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-forest-500 to-earth-500 text-white"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-forest-300 text-forest-700 px-8 py-4 rounded-full hover:bg-forest-50 transition-all duration-300 font-semibold">
            View All Products
          </button>
        </div>

        {/* Add to Cart Popup */}
        {selectedProduct && (
          <AddToCartPopup
            isOpen={showPopup}
            product={selectedProduct}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </section>
  );
};

export default Products;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getAllProducts } from '@/services/admin/productService';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string;
  images: string; 
  category: string;
  stock: number;
  soldCount?: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  tags: string[];
  weight: string;
  ratings: number;
  reviews: {
    user?: string;
    name?: string;
    rating?: number;
    comment?: string;
  }[];
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        // Assuming response.data contains the products array
        // You can set the products state here if needed
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "men", name: "For Men" },
    { id: "women", name: "For Women" },
    { id: "growth", name: "Hair Growth" },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images
    });
  };
 

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    getAllProducts()
      .then(data => {
        if (data?.status === 'success') {
          setProducts(data.products);
          console.log("data", data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(error => {
        toast.error('Failed to fetch products');
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of premium Ayurvedic hair care products made with
            traditional Panchgavya and natural herbs
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.images}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </CardHeader>

              <CardContent className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">
                      {product.ratings} ({product.reviews.length})
                    </span>
                  </div>
                  {product.stock > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      In Stock
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-primary">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  Award,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { getProductById } from "../services/productsServices";
import { getUserFromToken } from "@/Utils/TokenData";

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string;
  ratings: number;
   productReviews: {
    user?: string;
    rating?: string;
    comment?: string;
  }[];
  stock: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  ingredients: string[];
};

interface Review {
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);
  const userdata = getUserFromToken() as { id: string };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById({ productId: id });
        if (response?.status === "error") {
          navigate("/products");
          return;
        }
        setProduct(response?.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        // navigate('/products');
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {
    navigate("/cart", {
      state: {
        product,
      },
    });
    // addToCart({
    //   id: product._id,
    //   userId: userdata?.id as string,
    //   quantity: quantity,
    // });
  };

  const handleBuyNow = () => {
    navigate("/cart");
  };

  
  const getAvgRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };


  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product?.images}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
                {product?.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold ml-1">{getAvgRating((product?.productReviews || []).map(r => ({ rating: Number(r.rating) || 0 }))) || 0}</span>
                  <span className="text-muted-foreground ml-1">({product?.productReviews?.length || 0} reviews)</span>
                </div>
                {product?.stock > 0 && (
                  <Badge variant="secondary">In Stock</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ₹{product?.price}
                </span>
                {product?.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product?.originalPrice}
                  </span>
                )}
                {product?.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round(
                      ((product?.originalPrice - product?.price) /
                        product?.originalPrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-lg">
              {product?.description}
            </p>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div> */}
              <div className="flex gap-4">
                {isInCart(product?._id) ? (
                  <Button
                    onClick={() => navigate("/cart")}
                    className="w-full"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
                {/* <Button
                  size="lg"
                  variant="outline"
                  onClick={handleBuyNow}
                  className="flex-1"
                  disabled={!product.stock}
                >
                  Buy Now
                </Button> */}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold">100% Natural</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold">Free Delivery</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold">Clinically Tested</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{product?.benefits}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Natural Ingredients
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[]?.map((ingredient, index) => (
                      <div
                        key={index}
                        className="bg-secondary p-3 rounded-lg text-center"
                      >
                        <span className="font-medium">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Customer Reviews
                  </h3>
                  <div className="space-y-4">
                    {product?.productReviews?.length > 0 ? (
                      product.productReviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < (Number(review?.rating) || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 font-semibold">{review?.user || 'Anonymous'}</span>
                          </div>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No reviews yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

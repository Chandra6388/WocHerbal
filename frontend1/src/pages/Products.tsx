// ... your imports stay the same
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getUserProducts } from "@/services/admin/productService";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserFromToken } from "@/Utils/TokenData";
import { getRocketShipmentsAvailabilty } from "@/services/admin/rocketShippment";
import {
  Addfavorlist,
  getfavorlist,
  removeFavorlist,
} from "@/services/productsServices";

import { getCategory } from "@/services/admin/productService";

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
  status: "active" | "inactive" | "out-of-stock";
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

interface Category {
  _id?: string;
  name: string;
  status: "active" | "inactive" | "out-of-stock";
}
const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const { items, addToCart, isInCart } = useCart();
  const [favorList, setFavorList] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const userdata = getUserFromToken() as { id: string };
  const [pincodeInputs, setPincodeInputs] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    getProducts();
    handleGetFavorites();
  }, []);

  const getAllCategory = () => {
    getCategory()
      .then((data) => {
        if (data?.status == "success") {
          setCategory(data.allCategory);
        } else {
          setCategory([]);
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "default",
          duration: 4000,
        });
        console.error(error);
      });
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated && !userdata?.id) {
      navigate("/login");
      return;
    }
    addToCart({ id: product._id, userId: userdata?.id as string });
  };

  const getProducts = async () => {
    try {
      const data = await getUserProducts();
      if (data?.status === "success") {
        setProducts(data.products);
      } else {
        setProducts([]);
        toast({
          title: "No Products Found",
          description:
            data?.message || "No products were returned from the server.",
          variant: "default",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Fetch Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while fetching products.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleAddToFavorites = (product: Product) => {
    Addfavorlist({ productId: product._id })
      .then((data) => {
        if (data?.status === "success") {
          toast({
            title: "Added to Favorites",
            description: `${product.name} has been added to your favorites.`,
            variant: "success",
            duration: 3000,
          });
          handleGetFavorites();
        } else {
          toast({
            title: "Failed to Add",
            description: data?.message || "Could not add product to favorites.",
            variant: "destructive",
            duration: 3000,
          });
        }
      })
      .catch((error: any) => {
        console.error("Error adding to favorites:", error);
        toast({
          title: "Something went wrong",
          description: error?.message || "Unable to add product to favorites.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const handleGetFavorites = () => {
    if (!isAuthenticated) return;
    const req = { id: userdata?.id };
    getfavorlist(req)
      .then((data) => {
        if (data?.status === "success") {
          setFavorList(data.favorites || []);
        } else {
          toast({
            title: "Failed to Load Favorites",
            description:
              data?.message || "Unable to fetch your favorite products.",
            variant: "destructive",
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        toast({
          title: "Error",
          description: "Something went wrong while fetching favorites.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const handleRemoveFromFavorites = (productId: string) => {
    removeFavorlist({ productId })
      .then((data) => {
        if (data?.status === "success") {
          toast({
            title: "Removed from Favorites",
            description:
              "Product was successfully removed from your favorites.",
            variant: "success",
            duration: 3000,
          });
          handleGetFavorites();
        } else {
          toast({
            title: "Failed to Remove",
            description:
              data?.message || "Could not remove product from favorites.",
            variant: "destructive",
            duration: 3000,
          });
        }
      })
      .catch((error: any) => {
        console.error("Error removing from favorites:", error);
        toast({
          title: "Server Error",
          description:
            error?.message ||
            "Something went wrong while removing from favorites.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const handleVerifyPincode = async (product: Product) => {
    try {
      const payload = {
        delivery_postcode: pincodeInputs[product._id],
        cod: 0,
        weight: product.weight || "0.5",
      };

      const response = await getRocketShipmentsAvailabilty(payload);
      console.log("res", response);
      if (response?.available) {
        toast({
          title: "Pincode Verified",
          description: `Delivery is available for ${
            pincodeInputs[product._id]
          }.`,
          variant: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Delivery Unavailable",
          description: `No delivery available for ${
            pincodeInputs[product._id]
          }.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error verifying pincode:", error);
      toast({
        title: "Verification Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while verifying the pincode.",
        variant: "destructive",
        duration: 3000,
      });
    }
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
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            All Products
          </Button>
          {category.map((category) => (
            <Button
              key={category._id}
              variant={
                selectedCategory === category._id ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category._id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts?.map((product) => (
            <Card
              key={product._id}
              className="group hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  {product.stock === 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      Out of Stock
                    </div>
                  )}
                  {isAuthenticated && (
                    <div className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow-md cursor-pointer hover:text-red-500 transition-colors">
                      {favorList.some((fav) => fav._id === product._id) ? (
                        <Heart
                          className="w-5 h-5"
                          style={{ color: "red" }}
                          fill="red"
                          stroke="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromFavorites(product._id);
                          }}
                        />
                      ) : (
                        <Heart
                          className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToFavorites(product);
                          }}
                        />
                      )}
                    </div>
                  )}
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
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

              <div className="flex items-center gap-2 mb-3 px-4">
                <input
                  type="number"
                  placeholder="Enter pincode"
                  className="border rounded px-2 py-1 text-sm w-2/3"
                  value={pincodeInputs[product._id] || ""}
                  onChange={(e) =>
                    setPincodeInputs((prev) => ({
                      ...prev,
                      [product._id]: e.target.value,
                    }))
                  }
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVerifyPincode(product)}
                >
                  Verify Pincode
                </Button>
              </div>

              <CardFooter className="p-4 pt-0">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

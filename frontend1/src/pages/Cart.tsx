import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { getUserFromToken } from "@/Utils/TokenData";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { toast } = useToast();
  const userdata = getUserFromToken() as { id: string };
  const {
    getAddToCart,
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState<number>(1);

  const location = useLocation();
  const productdata = location?.state?.product;
  console.log("location?.state?.product", location?.state?.product);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to get started
          </p>
          <Link to="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-playfair font-bold text-foreground mb-8">
          Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* {items?.map((item) => ( */}
            <Card key={productdata?._id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={productdata?.images}
                    alt={productdata?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {productdata?.name}
                    </h3>
                    <p className="text-primary font-bold">
                      ₹{productdata?.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ₹{productdata?.price * quantity}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeFromCart(productdata?._id, userdata.id)
                      }
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* ))} */}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{productdata?.price * quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{Math.round(totalPrice * 0.18)}</span>
                </div> */}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{Math.round(productdata?.price * quantity)}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    navigate("/checkout", { state: { productdata } })
                  }
                >
                  Proceed to Checkout
                </Button>

                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

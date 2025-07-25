import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { createOrder, createOrderByrazorpay } from "@/services/admin/User";
import { toast } from "sonner";
import { loadRazorpayScript } from "@/Utils/RazorpayLoader";
import { updateStockAndSoldCount } from "@/services/admin/productService";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: any;
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => any;
  }
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const addressString = user?.address
    ? typeof user.address === "string"
      ? user.address
      : `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}, ${user.address.country}`
    : "";

  const [formData, setFormData] = useState({
    _id: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: addressString,
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay",
  });

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
    if (!isAuthenticated) navigate("/auth", { state: { from: "/checkout" } });
  }, [items.length, isAuthenticated, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formattedItems = items.map((item) => ({
    product: item.id,
    quantity: item.quantity,
    name: item?.name,
    image: item?.image,
    price: item?.price,
  }));

  const createOrderPayload = (paymentId: string | null = null) => ({
    user: user?._id,
    orderItems: formattedItems,
    shippingInfo: {
      address: formData.address,
      city: formData.city,
      postalCode: formData.pincode,
      country: "India",
      phoneNo: formData.phone,
    },

    paymentInfo: {
      id: paymentId || "COD",
      status: paymentId ? "Paid" : "Pending",
      method:
        formData.paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.paymentMethod === "cod") {
      try {
        const orderRes = await createOrder(createOrderPayload());
        if (orderRes.status === "success") {
          const productIds = items.map((item) => item.id);
          await updateStockAndSoldCount(productIds);
          toast.success("Order placed successfully!");
          clearCart();
          navigate("/orders");
        } else {
          toast.error("Order save failed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to place order.");
      }
      return;
    }

    // Handle Razorpay
    try {
      const isLoaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      const finalAmount = Math.round(totalPrice * 1.18);
      const { order } = await createOrderByrazorpay({ amount: finalAmount });

      const options: RazorpayOptions = {
        key: "rzp_test_Yg6vhSeAq4hucc",
        amount: finalAmount,
        currency: "INR",
        order_id: order._id,
        name: "My E-Commerce Store",
        description: "Order Payment",
        handler: async (response: any) => {
          try {
            const orderRes = await createOrder(
              createOrderPayload(response.razorpay_payment_id)
            );
            if (orderRes.status === "success") {
              // Update stock and soldCount for all products in the order
              const productIds = items.map((item) => item.id);
              await updateStockAndSoldCount({ ids: productIds });
              toast.success("Order placed successfully!");
              clearCart();
              navigate("/orders");
            } else {
              toast.error("Order save failed!");
            }
          } catch (err) {
            console.error(err);
            toast.error("Failed to save order.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#528FF0",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error("Razorpay Error:", err.message || err);
      toast.error("Payment initialization failed!");
    }
  };

  if (items.length === 0 || !isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-playfair font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === "razorpay"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Razorpay (UPI/Card/Net Banking)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{Math.round(totalPrice * 0.18)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{Math.round(totalPrice * 1.18)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

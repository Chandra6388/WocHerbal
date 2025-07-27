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
import { useToast } from "../hooks/use-toast";
import { RAZORPAY_KEY_ID } from "@/Utils/privateKeys";
import { loadRazorpayScript } from "@/Utils/RazorpayLoader";
import { updateStockAndSoldCount } from "@/services/admin/productService";
import { getRocketShipmentsAvailabilty } from "@/services/admin/rocketShippment";
import { getUserProfile } from "@/services/authSerives";
import { getUserFromToken } from "@/Utils/TokenData";

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
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userdata = getUserFromToken() as { id: string };
  const [profiledata, setProfiledata] = useState(null);

  const addressString = user?.address
    ? typeof user.address === "string"
      ? user.address
      : `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}, ${user.address.country}`
    : "";

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: addressString,
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      getProfiledata();
    }
  }, [isAuthenticated]);

  const getProfiledata = () => {
    getUserProfile({ id: userdata?.id })
      .then((res) => {
        if (res?.status === "success") {
          setProfiledata(res?.user);
          setFormData((prev) => ({
            ...prev,
            _id: res.user._id || "",
            name: res.user.name || "",
            email: res.user.email || "",
            phone: res.user.phone || "",
            address: res.user?.address?.street || "",
            city: res.user?.address?.city || "",
            state: res?.user?.address?.state || "",
            pincode: res?.user?.address?.zipCode || "",
          }));
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch profile data.",
          variant: "destructive",
        });
      });
  };

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
    product: item?.product?._id,
    quantity: item?.quantity,
    name: item?.product?.name,
    image: item?.product?.images,
    price: item?.product?.price,
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
      name: formData.name,
      email: formData.email,
      state: formData.state,
    },
    paymentInfo: {
      id: paymentId || "COD",
      status: paymentId ? "Paid" : "Pending",
      method:
        formData.paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery",
    },
    totalPrice: totalPrice,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (
      formData.paymentMethod !== "razorpay" &&
      formData.paymentMethod !== "cod"
    ) {
      toast({
        title: "Error",
        description: "Please select a valid payment method.",
        variant: "destructive",
      });
      return;
    }

    let weightData = items.reduce((acc, item) => {
      const itemWeight = item?.product?.weight || 0.5;
      return acc + itemWeight * item.quantity;
    }, 0);

    weightData = Number((weightData / 1000).toFixed(2));

    const payload = {
      delivery_postcode: formData.pincode,
      cod: formData.paymentMethod === "cod" ? 1 : 0,
      weight: weightData,
    };

    const response = await getRocketShipmentsAvailabilty(payload);

    if (!response?.available) {
      toast({
        title: "Error",
        description: "No courier service available for the provided pincode.",
        variant: "destructive",
      });
      return;
    }

    // if (formData.paymentMethod === "cod") {
    //   try {
    //     const orderRes = await createOrder(createOrderPayload());
    //     if (orderRes.status === "success") {
    //       const productIds = items.map((item) => ({
    //         product: item.product._id,
    //         quantity: item.quantity,
    //       }));

    //       await updateStockAndSoldCount(productIds);
    //       toast.success("Order placed successfully!");
    //       clearCart();
    //       navigate("/orders");
    //     } else {
    //       toast.error("Order save failed!");
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     toast.error("Failed to place order.");
    //   }
    //   return;
    // }

    // Handle Razorpay
    try {
      const isLoaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      const finalAmount = Math.round(totalPrice * 1.18);
      const { order } = await createOrderByrazorpay({ amount: finalAmount });
      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order._id,
        name: "My E-Commerce Store",
        description: "Order Payment",
        handler: async (response: any) => {
          try {
            const orderRes = await createOrder(
              createOrderPayload(response.razorpay_payment_id)
            );
            if (orderRes.success) {
              const productIds = items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
              }));
              await updateStockAndSoldCount(productIds);
              toast({
                title: "success",
                description: "Order placed successfully!",
                variant: "success",
              });
              clearCart();
              navigate("/orders");
            } else {
              toast({
                title: "error",
                description: "Order save failed!",
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error(err);
            toast({
              title: "error",
              description: "Failed to save order!",
              variant: "destructive",
            });
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
      toast({
        title: "Error",
        description: "Payment initialization failed!",
        variant: "destructive",
      });
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
                    key={item?.product?._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item?.product?.images}
                        alt={item?.product?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item?.product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{item?.product?.price * item?.quantity}
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

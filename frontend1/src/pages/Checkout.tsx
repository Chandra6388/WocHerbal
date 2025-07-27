import { useState, useEffect } from "react";
// import { useCart } from "../contexts/CartContext";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { createOrder, createOrderByrazorpay } from "@/services/admin/User";
import { useToast } from "../hooks/use-toast";
import { RAZORPAY_KEY_ID } from "@/Utils/privateKeys";
import { loadRazorpayScript } from "@/Utils/RazorpayLoader";
import { updateStockAndSoldCount } from "@/services/admin/productService";
import { getRocketShipmentsAvailabilty } from "@/services/admin/rocketShippment";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP } from "@/services/authSerives";
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

interface UserData {
  email?: string;
  [key: string]: any;
}

const userdata = getUserFromToken() as UserData;


const Checkout = () => {
  const location = useLocation();
  const productdata = location?.state?.product;
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const addressString = user?.address
    ? typeof user.address === "string"
      ? user.address
      : `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}, ${user.address.country}`
    : "";

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: userdata?.email || "",
    phone: "",
    address: addressString,
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay",
  });

  // OTP related states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSubtotal = () => {
    return Math.round(productdata?.price * location?.state?.quantity);
  };

  const formattedItems = {
    product: productdata?._id,
    quantity: location?.state?.quantity,
    name: productdata?.name,
    image: productdata?.images,
    price: productdata?.price,
  };

  const createOrderPayload = (paymentId: string | null = null) => ({
    user: user?._id,
    orderItems: [formattedItems],
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
    totalPrice: getSubtotal(),
  });

  // Send OTP function
  const handleSendOTP = async () => {
    setIsOtpLoading(true);
    try {
      const data = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
        },
      };
      const otpResponse = await sendOTP(data);
      if (otpResponse.status) {
        setOtpSent(true);
        toast({
          title: "Success",
          description: "OTP sent to your email successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verifyResponse = await verifyOTP({
        email: formData.email,
        otp: otp,
      });

      if (verifyResponse.status) {
        toast({
          title: "Success",
          description: "OTP verified successfully!",
          variant: "success",
        });
        setIsOtpModalOpen(false);
        await proceedWithOrder();
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);
      toast({
        title: "Error",
        description: "OTP verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const proceedWithOrder = async () => {
    try {
      const isLoaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      const finalAmount = Math.round(getSubtotal() * 1.18);
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
              const productIds = [
                {
                  product: productdata._id,
                  quantity: location?.state?.quantity,
                },
              ];
              await updateStockAndSoldCount(productIds);
              toast({
                title: "Success",
                description: "Order placed successfully!",
                variant: "default",
              });

              navigate("/orders");
            } else {
              toast({
                title: "Error",
                description: "Order save failed!",
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error(err);
            toast({
              title: "Error",
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

    // Check shipping availability
    let weightData = 0.5; // Default weight for single product
    if (productdata?.weight) {
      weightData = (productdata.weight * location?.state?.quantity) / 1000;
    }

    const payload = {
      delivery_postcode: formData.pincode,
      cod: formData.paymentMethod === "cod" ? 1 : 0,
      weight: Number(weightData.toFixed(2)),
    };

    try {
      const response = await getRocketShipmentsAvailabilty(payload);
      console.log("Shipping Availability Response:", response?.available);

      if (!response?.available) {
        toast({
          title: "Error",
          description:
            response?.message ||
            "No courier service available for this pincode.",
          variant: "destructive",
        });
        return; // ⛔️ STOP here if not available
      }
    } catch (error) {
      console.error("Shipping Availability Error:", error);
      toast({
        title: "Error",
        description: "Failed to check shipping availability.",
        variant: "destructive",
      });
      return; // ⛔️ STOP on failure
    }

    if (!isAuthenticated) {
      setIsOtpModalOpen(true);
      await handleSendOTP();
    } else {
      await proceedWithOrder();
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-playfair font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                        value={formData?.email}
                        onChange={handleInputChange}
                        disabled={userdata?.email == null || userdata?.email === "" ? false : true} // Disable if email is already set from token
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      type="number"
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
                        type="number"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={location?.state?.product?.images}
                      alt={location?.state?.product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">
                        {location?.state?.product?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {location?.state?.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ₹
                    {location?.state?.product?.price *
                      location?.state?.quantity}
                  </p>
                </div>
                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{Math.round(getSubtotal())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* OTP Verification Modal */}
        <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verify Email</DialogTitle>
              <DialogDescription>
                We've sent a 6-digit verification code to {formData.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleSendOTP}
                  variant="outline"
                  disabled={isOtpLoading}
                  className="flex-1"
                >
                  {isOtpLoading ? "Sending..." : "Resend OTP"}
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isVerifyingOtp || otp.length !== 6}
                  className="flex-1"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify & Place Order"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Checkout;

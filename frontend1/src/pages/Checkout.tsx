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
import { createOrder, createOrderByrazorpay , verifyByrazorpay } from "@/services/admin/User";
import { useToast } from "../hooks/use-toast";
import { RAZORPAY_KEY_ID } from "@/Utils/privateKeys";
import { loadRazorpayScript } from "@/Utils/RazorpayLoader";
import { updateStockAndSoldCount } from "@/services/admin/productService";
import { getRocketShipmentsAvailabilty } from "@/services/admin/rocketShippment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP } from "@/services/authSerives";
import { getUserFromToken } from "@/Utils/TokenData";
import axios from "axios";

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
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Validation function to check if a value is empty, null, or undefined
  const isEmptyOrInvalid = (value: any): boolean => {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    );
  };

  // Comprehensive validation function
  const validateFormData = (): { isValid: boolean; errorMessage: string } => {
    // Check if product data exists
    if (!productdata || isEmptyOrInvalid(productdata._id)) {
      return {
        isValid: false,
        errorMessage:
          "Product information is missing. Please go back and select a product.",
      };
    }

    // Check if quantity exists
    if (!location?.state?.quantity || location.state.quantity <= 0) {
      return {
        isValid: false,
        errorMessage:
          "Invalid quantity. Please go back and select a valid quantity.",
      };
    }

    // Check required form fields
    const requiredFields = [
      { field: formData.name, name: "Full Name" },
      { field: formData.email, name: "Email" },
      { field: formData.phone, name: "Phone Number" },
      { field: formData.address, name: "Address" },
      { field: formData.city, name: "City" },
      { field: formData.state, name: "State" },
      { field: formData.pincode, name: "Pincode" },
    ];

    for (const { field, name } of requiredFields) {
      if (isEmptyOrInvalid(field)) {
        return {
          isValid: false,
          errorMessage: `${name} is required and cannot be empty.`,
        };
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid email address.",
      };
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid 10-digit phone number.",
      };
    }

    // Pincode validation (Indian pincode format)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode.trim())) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid 6-digit pincode.",
      };
    }

    // Payment method validation
    if (!["razorpay", "cod"].includes(formData.paymentMethod)) {
      return {
        isValid: false,
        errorMessage: "Please select a valid payment method.",
      };
    }

    return { isValid: true, errorMessage: "" };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSubtotal = () => {
    if (!productdata?.price || !location?.state?.quantity) {
      return 0;
    }
    return Math.round(productdata.price * location.state.quantity);
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

  // Send OTP function with validation
  const handleSendOTP = async () => {
    // Validate essential fields before sending OTP
    if (isEmptyOrInvalid(formData.email)) {
      toast({
        title: "Error",
        description: "Email is required to send OTP.",
        variant: "destructive",
      });
      return;
    }

    if (isEmptyOrInvalid(formData.name)) {
      toast({
        title: "Error",
        description: "Name is required to send OTP.",
        variant: "destructive",
      });
      return;
    }

    if (isEmptyOrInvalid(formData.phone)) {
      toast({
        title: "Error",
        description: "Phone number is required to send OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsOtpLoading(true);
    try {
      const data = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.pincode.trim(),
        },
      };
      const otpResponse = await sendOTP(data);
      if (otpResponse?.status) {
        setOtpSent(true);
        toast({
          title: "Success",
          description: "OTP sent to your email successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description:
            otpResponse?.message || "Failed to send OTP. Please try again.",
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
    const otpValue = otp.join("");
    if (isEmptyOrInvalid(otpValue) || otpValue.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    if (isEmptyOrInvalid(formData.email)) {
      toast({
        title: "Error",
        description: "Email is required for OTP verification.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verifyResponse = await verifyOTP({
        email: formData.email.trim(),
        otp: otpValue,
      });

      if (verifyResponse?.status) {
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
          description:
            verifyResponse?.message || "Invalid OTP. Please try again.",
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

  // const proceedWithOrder = async () => {
  //   // Final validation before processing order
  //   const validation = validateFormData();
  //   if (!validation.isValid) {
  //     toast({
  //       title: "Validation Error",
  //       description: validation.errorMessage,
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //    await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  //     const finalAmount = Math.round(getSubtotal());
  //     if (finalAmount <= 0) {
  //       toast({
  //         title: "Error",
  //         description: "Invalid order amount. Please check your order details.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     const orderResponse = await createOrderByrazorpay({ amount: finalAmount });
  //     if (!orderResponse?.order?.id) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to create payment order. Please try again.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     const { order } = orderResponse;

  //     const options: RazorpayOptions = {
  //       key: RAZORPAY_KEY_ID,
  //       amount: order.amount,
  //       currency: "INR",
  //       order_id: order._id,
  //       name: "My E-Commerce Store",
  //       description: "Order Payment",
  //       handler: async (response: any) => {
  //         try {
  //           if (!response?.razorpay_payment_id) {
  //             toast({
  //               title: "Error",
  //               description: "Payment verification failed. Please contact support.",
  //               variant: "destructive",
  //             });
  //             return;
  //           }

  //           const orderRes = await createOrder(
  //             createOrderPayload(response.razorpay_payment_id)
  //           );
  //           if (orderRes?.success) {
  //             const productIds = [
  //               {
  //                 product: productdata._id,
  //                 quantity: location?.state?.quantity,
  //               },
  //             ];
  //             await updateStockAndSoldCount(productIds);
  //             toast({
  //               title: "Success",
  //               description: "Order placed successfully!",
  //               variant: "default",
  //             });

  //             navigate("/orders", { state: { orderId: order.id } });
  //           } else {
  //             toast({
  //               title: "Error",
  //               description: orderRes?.message || "Order save failed!",
  //               variant: "destructive",
  //             });
  //           }
  //         } catch (err) {
  //           console.error(err);
  //           toast({
  //             title: "Error",
  //             description: "Failed to save order!",
  //             variant: "destructive",
  //           });
  //         }
  //       },
  //       prefill: {
  //         name: formData.name.trim(),
  //         email: formData.email.trim(),
  //         contact: formData.phone.trim(),
  //       },
  //       theme: {
  //         color: "#528FF0",
  //       },
  //     };

  //     const razorpay = new window.Razorpay(options);
  //     razorpay.open();
  //   } catch (err: any) {
  //     console.error("Razorpay Error:", err.message || err);
  //     toast({
  //       title: "Error",
  //       description: err?.message || "Payment initialization failed!",
  //       variant: "destructive",
  //     });
  //   }
  // };


const proceedWithOrder = async () => {
  const validation = validateFormData();
  if (!validation.isValid) {
    toast({
      title: "Validation Error",
      description: validation.errorMessage,
      variant: "destructive",
    });
    return;
  }

  try {
    await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

    const finalAmount = Math.round(getSubtotal());
    if (finalAmount <= 0) {
      toast({
        title: "Error",
        description: "Invalid order amount. Please check your order details.",
        variant: "destructive",
      });
      return;
    }

    const orderResponse = await createOrderByrazorpay({ amount: finalAmount });
    const { order } = orderResponse;

    if (!order?.id) {
      toast({
        title: "Error",
        description: "Failed to create payment order. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id, // ✅ Razorpay order ID
      name: "My E-Commerce Store",
      description: "Order Payment",

      handler: async (response: any) => {
        try {
          if (
            !response?.razorpay_payment_id ||
            !response?.razorpay_order_id ||
            !response?.razorpay_signature
          ) {
            toast({
              title: "Error",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
            return;
          }

          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyRes = await verifyByrazorpay(data); 

          if (verifyRes?.success == false) {

            toast({
              title: "Error",
              description: "Signature verification failed.",
              variant: "destructive",
            });
            return;
          }

          const orderRes = await createOrder(
            createOrderPayload(response.razorpay_payment_id)
          );

          if (orderRes?.success) {
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
            navigate("/orders", { state: { orderId: order.id } });
          } else {
            toast({
              title: "Error",
              description: orderRes?.message || "Order save failed!",
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error(err);
          toast({
            title: "Error",
            description: "Payment verification request failed!",
            variant: "destructive",
          });
        }
      },

      prefill: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        contact: formData.phone.trim(),
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
      description: err?.message || "Payment initialization failed!",
      variant: "destructive",
    });
  }
};




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateFormData();
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Check if essential keys exist
    if (isEmptyOrInvalid(RAZORPAY_KEY_ID)) {
      toast({
        title: "Configuration Error",
        description:
          "Payment gateway configuration is missing. Please contact support.",
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
      delivery_postcode: formData.pincode.trim(),
      cod: formData.paymentMethod === "cod" ? 1 : 0,
      weight: Number(weightData.toFixed(2)),
    };

    try {
      const response = await getRocketShipmentsAvailabilty(payload);
      // console.log("Shipping Availability Response:", response);

      if (!response?.available) {
        toast({
          title: "Shipping Error",
          description:
            response?.message ||
            "No courier service available for this pincode. Please try a different pincode.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.error("Shipping Availability Error:", error);
      toast({
        title: "Shipping Error",
        description: "Failed to check shipping availability. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      setIsOtpModalOpen(true);
      await handleSendOTP();
    } else {
      await proceedWithOrder();
    }
  };

  // Early return if essential data is missing
  if (!productdata || !location?.state?.quantity) {
    return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Invalid Order
              </h2>
              <p className="text-muted-foreground mb-4">
                Product information is missing. Please go back and select a
                product.
              </p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData?.email}
                        onChange={handleInputChange}
                        disabled={
                          userdata?.email == null || userdata?.email === ""
                            ? false
                            : true
                        }
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your complete address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        type="tel"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
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
                <Label>Enter OTP</Label>
                <div className="flex gap-2 justify-center mt-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val) return;
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        // Move focus to next box
                        const next = document.getElementById(
                          `otp-box-${idx + 1}`
                        );
                        if (next) (next as HTMLInputElement).focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          const newOtp = [...otp];
                          if (otp[idx]) {
                            newOtp[idx] = "";
                            setOtp(newOtp);
                          } else if (idx > 0) {
                            const prev = document.getElementById(
                              `otp-box-${idx - 1}`
                            );
                            if (prev) (prev as HTMLInputElement).focus();
                          }
                        }
                      }}
                      id={`otp-box-${idx}`}
                      className="w-10 h-12 border rounded text-center text-xl font-bold focus:outline-primary bg-background"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
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
                  disabled={isVerifyingOtp || otp.join("").length !== 6}
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

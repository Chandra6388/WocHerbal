import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Image, Phone, Star, Edit3, Save, X } from "lucide-react";
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
import { useToast } from "../hooks/use-toast";
import {
  getUserProfile,
  updateProfile as updateProfileAPI,
} from "@/services/authSerives";
import { getmyOrder } from "@/services/user/orderService";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserFromToken } from "@/Utils/TokenData";
import ReviewModal from "@/components/reviewModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string | Address;
  avatar?: {
    url: string;
    public_id: string;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const userdata = getUserFromToken() as { id: string };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiledata, setProfiledata] = useState<UserProfile | null>(null);
  const [myAllOrder, setMyAllOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const rating = 0

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      getProfiledata();
      myOrder();
    }
  }, [isAuthenticated]);

  const getProfiledata = () => {
    getUserProfile({ id: userdata?.id })
      .then((res) => {
        if (res?.status === "success") {
          setProfiledata(res?.user);

          const addr =
            typeof res.user.address === "object" && res.user.address !== null
              ? res.user.address
              : {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              };

          setFormData({
            name: res.user.name || "",
            email: res.user.email || "",
            phone: res.user.phone || "",
            address: addr,
          });
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

  const myOrder = () => {
    getmyOrder({ id: userdata?.id })
      .then((res) => {
        if (res?.status === "success") {
          setMyAllOrder(res?.orders);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const success = await updateProfileAPI({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        id: userdata?.id,
      });

      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setIsModalOpen(false);
        getProfiledata();
      } else {
        toast({
          title: "Update Failed",
          description: "Something went wrong while updating your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-playfair font-bold text-foreground">
              My Profile
            </h1>
            <Button onClick={() => setIsModalOpen(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {profiledata?.avatar?.url && (
            <div className="flex justify-center mb-4">
              <img
                src={profiledata.avatar.url}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name</Label>
                  <p className="mt-1 text-lg">{profiledata?.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="mt-1 text-lg">{profiledata?.email}</p>
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <p className="mt-1 text-lg">
                  {profiledata?.phone || "Not provided"}
                </p>
              </div>
              <div>
                <Label>Address</Label>
                <p className="mt-1 text-lg">
                  {profiledata?.address &&
                    typeof profiledata.address === "object"
                    ? `${profiledata.address.street}, ${profiledata.address.city}, ${profiledata.address.state} ${profiledata.address.zipCode}, ${profiledata.address.country}`
                    : "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {myAllOrder?.length == 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Your order history will appear here once you make your first
                    purchase.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate("/products")}
                  >
                    Shop Now
                  </Button>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="text-sm font-semibold text-gray-700">Product</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700">Quantity</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700">Price</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700"></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {myAllOrder?.map((order) =>
                        order.orderItems.map((item, index) => (
                          <TableRow key={`${order._id}-${index}`} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs sm:text-sm text-gray-500 text-center px-1">
                                      No Image
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-gray-700">{item.quantity}</TableCell>
                            <TableCell className="text-gray-700">₹{item.price}</TableCell>
                            <TableCell>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus || "Unknown"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {order.orderStatus == "Delivered" && (
                                <div
                                  className="flex w-48 items-center cursor-pointer"
                                  onClick={() => {
                                    setOpen(true);
                                    setSelectedProduct(item);
                                  }}
                                >
                                  {[...Array(1)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-6 h-6 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                  <Badge className="ml-2">
                                    {rating ? rating : "Rate & Review Product"}
                                  </Badge>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                    <Link to="/orderhistory">
                    <Button>
                      <Edit3 className="w-4 h-4 mr-2" />
                      View More
                    </Button>
                  </Link>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground mb-2">
              Edit Your Profile
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Make changes to your personal information. Click save when you're
              done.
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="123456"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ReviewModal product={selectedProduct} open={open} setModal={setOpen} />

    </div>
  );
};

export default Profile;

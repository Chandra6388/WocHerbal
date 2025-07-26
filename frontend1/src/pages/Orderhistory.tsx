import React, { useEffect, useState } from "react";
import { getmyOrder } from "@/services/user/orderService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReviewModal from "@/components/reviewModal";
import { createProductReview } from "@/services/productsServices"
import { getUserFromToken } from "@/Utils/TokenData";


const Orderhistory = () => {
  const userdata = getUserFromToken() as { id: string };

  const [myAllOrder, setMyAllOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getmyOrder({});
        setMyAllOrder(res.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

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

  const rating = 0

  console.log("My All Orders:", myAllOrder);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Order History</h2>
      <div className="overflow-auto rounded-lg shadow">
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
                      <div className="flex w-48 items-center space-x-3">
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
                      {order.orderStatus === "Delivered" && (
                        <div
                          className="flex items-center cursor-pointer"
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
          </Table>
        </div>
      </div>
      <ReviewModal product={selectedProduct} open={open} setModal={setOpen} />
    </div>
  );
};

export default Orderhistory;

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, Download, Edit } from "lucide-react";
import { getAllOrder } from "@/services/admin/order";
import { useToast } from "@/hooks/use-toast";
import {
  UpdateOrderStatus,
  getRocketShipmentsAvailabilty,
} from "@/services/admin/rocketShippment";

interface Order {
  _id: string;
  customerName: string;
  product: string;
  amount: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: orderItems[];
  shippingInfo: {
    address: string;
    city: string;
    phoneNo: string;
    postalCode: string;
    country: string;
  };
  paymentInfo: {
    id: string;
    status: string;
    method: string;
  };
  paidAt: string;
  itemsPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
  orderStatus: string;
  createdAt: string;
  paymentStatus: string;
  deliveryStatus?: string;
  date: string;
  trackingId?: string;
}

interface orderItems {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
  _id: string;
}

type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState<{
    deliveryStatus: string;
    trackingId: string;
  }>({
    deliveryStatus: "pending",
    trackingId: "",
  });

  const allOrder = async () => {
    const req = { user: "admin" };
    try {
      const res = await getAllOrder(req);

      if (res?.status === "success" && Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else {
        setOrders([]);
        toast({
          title: "No Orders Found",
          description: res?.message || "No orders available right now.",
          variant: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while fetching orders.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    allOrder();
  }, []);

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleUpdateOrder = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      deliveryStatus: order.deliveryStatus,
      trackingId: order.trackingId || "",
    });
    setIsUpdateDialogOpen(true);
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id ? { ...order, ...updateData } : order
        )
      );
      toast({
        title: "success",
        description: "Order updated successfully!",
        variant: "success",
        duration: 3000,
      });
      setIsUpdateDialogOpen(false);
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      [
        "Order ID",
        "Customer",
        "Product",
        "Amount",
        "Payment Status",
        "Delivery Status",
        "Date",
      ].join(","),
      ...orders.map((order) =>
        [
          order._id,
          order.customerName,
          order.product,
          order.amount,
          order.paymentStatus,
          order.deliveryStatus,
          order.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "success",
      description: "Orders exported successfully!",
      variant: "success",
      duration: 3000,
    });
  };

  const handleUpdateStatus = async (
    _id: string,
    value: OrderStatus
  ): Promise<void> => {
    console.log("->", _id, value);

    let req = {
      shipment_id: "899981858",
      courier_id: 10,
    };

    let UpdateData = await UpdateOrderStatus(req);
    console.log("UpdateData", UpdateData);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and delivery status
          </p>
        </div>
        <Button onClick={handleExportOrders}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Order Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell>{order?.user?.name}</TableCell>
                  <TableCell>{order.orderItems[0]?.name}</TableCell>
                  <TableCell>₹ {order?.totalPrice}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.orderStatus)}
                  </TableCell>
                  <TableCell>{getDeliveryStatusBadge("pending")}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <select
                        // value={order.status}
                        onChange={
                          (e) =>
                            handleUpdateStatus(
                              order._id,
                              e.target.value as OrderStatus
                            ) // ✅ Correct
                        }
                        className="px-2 py-1 text-xs border rounded"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out-for-delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update delivery status and tracking information for order{" "}
              {selectedOrder?._id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status</Label>
              <select
                id="deliveryStatus"
                value={updateData.deliveryStatus}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    deliveryStatus: e.target.value as
                      | "pending"
                      | "shipped"
                      | "delivered",
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                id="trackingId"
                value={updateData.trackingId}
                onChange={(e) =>
                  setUpdateData({ ...updateData, trackingId: e.target.value })
                }
                placeholder="Enter tracking ID"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Order
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;

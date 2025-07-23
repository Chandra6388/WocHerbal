import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/services/admin/rocketShippment";
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
} from "@/components/ui/dialog";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  Download,
  Filter,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface OrderTracking {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: string;
  customer_name:string;
  products: { name: string }[];
  shipments: {
    awb: string;
    delivered_date: string;
  }[];
  channel_created_at: string;
  total:number;
  amount: number;
  status:
    | "confirmed"
    | "processing"
    | "shipped"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";
  trackingNumber: string;
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  carrier: string;
  timeline: {
    status: string;
    date: string;
    time: string;
    location: string;
    description: string;
  }[];
}

const OrderTracking = () => {
  const [orders, setOrders] = useState<OrderTracking[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(
    null
  );
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

  useEffect(() => {
    GetOrders();
  }, []);


  console.log("orders", orders)

// const filteredOrders = orders?.filter((order) => {
//   const search = searchTerm.toLowerCase();

//   const matchesSearch =
//     order?.id?.toString().includes(search) ||
//     order?.pickup_address_detail?.name?.toLowerCase().includes(search) ||
//     // order?.orderId?.toLowerCase().includes(search) ||
//     // order?.trackingNumber?.toLowerCase().includes(search);

//   const matchesStatus =
//     statusFilter === "all" || order.status === statusFilter;

//   return matchesSearch && matchesStatus;
// });


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
        );
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "out-for-delivery":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "shipped":
      case "out-for-delivery":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleViewTracking = (order: OrderTracking) => {
    setSelectedOrder(order);
    setIsTrackingDialogOpen(true);
  };

  const handleUpdateStatus = (
    orderId: string,
    newStatus: OrderTracking["status"]
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success("Order status updated successfully!");
  };

  const handleExportData = () => {
    const csvContent = [
      [
        "Order ID",
        "Customer",
        "Product",
        "Amount",
        "Status",
        "Tracking Number",
        "Order Date",
        "Estimated Delivery",
      ].join(","),
      ...orders.map((order) =>
        [
          order.orderId,
          order.customerName,
          order.product,
          order.amount,
          order.status,
          order.trackingNumber,
          order.orderDate,
          order.estimatedDelivery,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "order-tracking.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Order tracking data exported successfully!");
  };

  const statusCounts = {
    total: orders.length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const GetOrders = async () => {
    try {
      let getOrdersData = await getOrders({});
      console.log(getOrdersData.data.data);
      setOrders(getOrdersData.data.data);
    } catch (error) {}
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Tracking</h1>
          <p className="text-muted-foreground">
            Track and manage order deliveries
          </p>
        </div>
        <Button onClick={handleExportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{statusCounts.confirmed}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{statusCounts.processing}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{statusCounts.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{statusCounts.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Tracking List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Order ID, Customer, or Tracking Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.channel_created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{order.products?.[0]?.name}</p>
                  </TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">
                        {order.shipments[0].awb || "--"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.carrier}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        Est:{" "}
                        {new Date(order.shipments?.[0]?.delivered_date).toLocaleDateString()}
                      </p>
                      {order.actualDelivery && (
                        <p className="text-sm text-green-600">
                          Delivered:{" "}
                          {new Date(order.actualDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTracking(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            order.id,
                            e.target.value as OrderTracking["status"]
                          )
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

      {/* Tracking Details Dialog */}
      <Dialog
        open={isTrackingDialogOpen}
        onOpenChange={setIsTrackingDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Tracking Details</DialogTitle>
            <DialogDescription>
              Complete tracking information for {selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">
                        {selectedOrder.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tracking Number:
                      </span>
                      <span className="font-mono text-sm">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="font-medium">
                        {selectedOrder.carrier}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        ₹{selectedOrder.amount}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-full">
                        <p className="font-medium">
                          {selectedOrder.customerName}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{selectedOrder.customerEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{selectedOrder.customerPhone}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-muted-foreground mt-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <span>{selectedOrder.shippingAddress}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tracking Timeline */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tracking Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-foreground">
                                {event.status}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {event.date} at {event.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {event.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTracking;

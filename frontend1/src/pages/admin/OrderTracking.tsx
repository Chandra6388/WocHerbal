import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/services/admin/rocketShippment";
import { getRocketShipmentsAvailabilty, assignAwb, cancelShipment, cancelorder } from "@/services/admin/rocketShippment";
import Swal from "sweetalert2";
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
  customer_email: string;
  customer_phone: string;
  product: string;
  customer_name: string;
  customer_pincode: string;
  customer_address: string;
  customer_city?: string;
  customer_state?: string;
  products: { name: string }[];
  shipments: {
    awb: string;
    delivered_date: string;
    id: string;
    pickup_scheduled_date?: string;
    pickedup_timestamp?: string;
  }[];
  channel_created_at: string;
  total: number;
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
  pickup_address_detail?: {
    city?: string;
    [key: string]: any;
  };
}

const OrderTracking = () => {

  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

  useEffect(() => {
    GetOrders();
  }, []);


  // PICKUP SCHEDULED
  // CANCELLATION REQUESTED
  // CANCELED
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
        );
      case "PICKUP SCHEDULED":
        return <Badge className="bg-purple-100 text-purple-800">Pickup Scheduled</Badge>;
      case "out-for-delivery":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "CANCELED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "CANCELLATION REQUESTED":
        return (<Badge className="bg-blue-100 text-blue-800">Cancellation Requested</Badge>);
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

  const handleUpdateStatus = async (
    order: OrderTracking,
    newStatus: OrderTracking["status"]
  ) => {
    const firstShipment = order?.shipments?.[0];

    if (!firstShipment) {
      toast.error("Shipment data is missing");
      return;
    }

    // Helper: show SweetAlert confirmation modal
    const confirmAction = async (title: string, text: string) => {
      return await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, continue!",
        cancelButtonText: "No, keep it",
      });
    };

    if (newStatus === "confirmed") {
      const payload = {
        delivery_postcode: order.customer_pincode,
        cod: 0,
        weight: "0.5",
      };

      try {
        const response = await getRocketShipmentsAvailabilty(payload);

        if (!response?.couriers?.length) {
          toast.error("No courier available for this shipment");
          return;
        }

        const Req = {
          shipment_id: firstShipment.id,
          courier_id: response.couriers[0].courier_company_id,
        };

        const assignAwbResponse = await assignAwb(Req);

        if (assignAwbResponse?.status === "success") {
          toast.success("AWB assigned successfully!");
        } else {
          toast.error("Failed to assign AWB");
        }

      } catch (error) {
        console.error("Error in AWB assignment:", error);
        toast.error("Something went wrong while assigning AWB");
      }

    } else {
      // Cancel flow
      if (firstShipment.awb) {
        // Shipment with AWB
        const result = await confirmAction(
          "Are you sure?",
          "This will cancel the shipment with AWB."
        );

        if (result.isConfirmed) {
          const payload = { awbs: firstShipment.awb };

          try {
            await cancelShipment(payload);
            toast.success("Shipment cancelled successfully!");
          } catch (error) {
            console.error("Error cancelling shipment:", error);
            toast.error("Failed to cancel shipment");
          }
        }
      } else {
        // Shipment without AWB
        const result = await confirmAction(
          "Are you sure?",
          "This will cancel the order without an AWB."
        );

        if (result.isConfirmed) {
          const payload = { orderId: order.id };

          try {
            await cancelorder(payload);
            toast.success("Order cancelled successfully!");
          } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Failed to cancel order");
          }
        }
      }
    }
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
      setOrders(getOrdersData.data.data);
    } catch (error) { }
  };


  return (
    <div className="p-6 space-y-6">
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
                        {order.customer_email || "--"}
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
                            order,
                            e.target.value as OrderTracking["status"]
                          )
                        }
                        className="px-2 py-1 text-xs border rounded"
                      >
                        <option value="all">Change Status</option>
                        <option value="confirmed">Confirmed</option>

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

      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen} >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Tracking Details</DialogTitle>
            <DialogDescription>
              Complete tracking information for {selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">
                        {selectedOrder?.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tracking Number:
                      </span>
                      <span className="font-mono text-sm">
                        {selectedOrder.shipments[0].awb || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="font-medium">
                        {selectedOrder?.carrier || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedOrder?.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        ₹{selectedOrder?.total || "--"}
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
          {selectedOrder?.customer_name || "--"}
        </p>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{selectedOrder?.customer_email || "--"}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{selectedOrder?.customer_phone || "--"}</span>
        </div>

        <div className="flex items-start space-x-2 text-sm text-muted-foreground mt-2">
          <MapPin className="w-4 h-4 mt-0.5" />
          <span>
            {selectedOrder?.customer_address}, {selectedOrder?.customer_city},{" "}
            {selectedOrder?.customer_state} - {selectedOrder?.customer_pincode}
          </span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

              </div>

              {/* Tracking Timeline */}
              <div>
                <Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tracking Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="relative border-s border-gray-300 ml-4 mt-2">
                        {[
                          {
                            status: "Order Created",
                            timestamp: selectedOrder?.channel_created_at,
                            location: selectedOrder?.customer_city,
                            remarks: "Order successfully created"
                          },
                          {
                            status: "Pickup Scheduled",
                            timestamp: selectedOrder?.shipments?.[0]?.pickup_scheduled_date !== "0000-00-00 00:00:00"
                              ? selectedOrder?.shipments?.[0]?.pickup_scheduled_date
                              : null,
                            location: selectedOrder?.pickup_address_detail?.city,
                            remarks: "Courier will pick up the package"
                          },
                          {
                            status: "Picked Up",
                            timestamp: selectedOrder?.shipments?.[0]?.pickedup_timestamp,
                            location: selectedOrder?.pickup_address_detail?.city,
                            remarks: "Package picked up by delivery partner"
                          },
                          {
                            status: "Out for Delivery",
                            timestamp: selectedOrder?.shipments?.[0]?.pickup_scheduled_date,
                            location: selectedOrder?.customer_city,
                            remarks: "Courier is out for delivery"
                          },
                          {
                            status: "Delivered",
                            timestamp: selectedOrder?.shipments?.[0]?.delivered_date,
                            location: selectedOrder?.customer_city,
                            remarks: "Package delivered"
                          }
                        ]
                          .filter(item => item.timestamp)
                          .map((item, idx) => (
                            <li key={idx} className="mb-6 ms-4">
                              <div className="absolute w-3 h-3 bg-blue-600 rounded-full -start-1.5 border border-white" />
                              <time className="block text-sm text-gray-500">
                                {item.timestamp || "—"}
                              </time>
                              <h3 className="text-base font-semibold text-gray-900">{item.status}</h3>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Location:</span> {item.location || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">{item.remarks}</p>
                            </li>
                          ))}
                      </ol>
                    </CardContent>
                  </Card>


                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder?.timeline?.map((event, index) => (
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

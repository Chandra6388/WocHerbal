
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, Package, Truck, CheckCircle, Clock, MapPin, 
  Eye, Edit, Download, Filter, AlertCircle, Phone, Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderTracking {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: string;
  amount: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
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
  const [orders, setOrders] = useState<OrderTracking[]>([
    {
      id: '1',
      orderId: 'ORD-2024-001',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@gmail.com',
      customerPhone: '+91 98765 43210',
      product: 'WOC Panchgavya Ayurvedic Oil',
      amount: 999,
      status: 'shipped',
      trackingNumber: 'TRK123456789',
      shippingAddress: '123 MG Road, Mumbai, Maharashtra 400001',
      orderDate: '2024-01-10',
      estimatedDelivery: '2024-01-15',
      carrier: 'BlueDart',
      timeline: [
        { status: 'Order Confirmed', date: '2024-01-10', time: '10:30 AM', location: 'Mumbai Hub', description: 'Order received and confirmed' },
        { status: 'Processing', date: '2024-01-10', time: '2:15 PM', location: 'Warehouse', description: 'Order being prepared for shipment' },
        { status: 'Shipped', date: '2024-01-11', time: '11:00 AM', location: 'Mumbai Hub', description: 'Package dispatched for delivery' },
        { status: 'In Transit', date: '2024-01-12', time: '9:45 AM', location: 'Delhi Hub', description: 'Package in transit to destination' }
      ]
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      customerName: 'Raj Kumar',
      customerEmail: 'raj.kumar@yahoo.com',
      customerPhone: '+91 87654 32109',
      product: 'Ayurvedic Hair Oil Set',
      amount: 1299,
      status: 'out-for-delivery',
      trackingNumber: 'TRK987654321',
      shippingAddress: '456 CP Avenue, Delhi 110001',
      orderDate: '2024-01-08',
      estimatedDelivery: '2024-01-13',
      carrier: 'DTDC',
      timeline: [
        { status: 'Order Confirmed', date: '2024-01-08', time: '3:20 PM', location: 'Delhi Hub', description: 'Order received and confirmed' },
        { status: 'Processing', date: '2024-01-09', time: '10:30 AM', location: 'Warehouse', description: 'Order being prepared for shipment' },
        { status: 'Shipped', date: '2024-01-09', time: '4:45 PM', location: 'Delhi Hub', description: 'Package dispatched for delivery' },
        { status: 'Out for Delivery', date: '2024-01-13', time: '8:00 AM', location: 'Local Facility', description: 'Package out for delivery' }
      ]
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      customerName: 'Anita Patel',
      customerEmail: 'anita.patel@hotmail.com',
      customerPhone: '+91 76543 21098',
      product: 'Natural Hair Serum',
      amount: 599,
      status: 'delivered',
      trackingNumber: 'TRK456789123',
      shippingAddress: '789 SG Highway, Ahmedabad, Gujarat 380001',
      orderDate: '2024-01-05',
      estimatedDelivery: '2024-01-10',
      actualDelivery: '2024-01-09',
      carrier: 'FedEx',
      timeline: [
        { status: 'Order Confirmed', date: '2024-01-05', time: '11:15 AM', location: 'Ahmedabad Hub', description: 'Order received and confirmed' },
        { status: 'Processing', date: '2024-01-05', time: '3:30 PM', location: 'Warehouse', description: 'Order being prepared for shipment' },
        { status: 'Shipped', date: '2024-01-06', time: '9:20 AM', location: 'Ahmedabad Hub', description: 'Package dispatched for delivery' },
        { status: 'Out for Delivery', date: '2024-01-09', time: '7:30 AM', location: 'Local Facility', description: 'Package out for delivery' },
        { status: 'Delivered', date: '2024-01-09', time: '6:15 PM', location: 'Customer Address', description: 'Package delivered successfully' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case 'out-for-delivery':
        return <Badge className="bg-orange-100 text-orange-800">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
      case 'out-for-delivery':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleViewTracking = (order: OrderTracking) => {
    setSelectedOrder(order);
    setIsTrackingDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderTracking['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success('Order status updated successfully!');
  };

  const handleExportData = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Tracking Number', 'Order Date', 'Estimated Delivery'].join(','),
      ...filteredOrders.map(order => [
        order.orderId,
        order.customerName,
        order.product,
        order.amount,
        order.status,
        order.trackingNumber,
        order.orderDate,
        order.estimatedDelivery
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order-tracking.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Order tracking data exported successfully!');
  };

  const statusCounts = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Tracking</h1>
          <p className="text-muted-foreground">Track and manage order deliveries</p>
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderId}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{order.product}</p>
                  </TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">{order.trackingNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.carrier}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">Est: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                      {order.actualDelivery && (
                        <p className="text-sm text-green-600">Delivered: {new Date(order.actualDelivery).toLocaleDateString()}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewTracking(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderTracking['status'])}
                        className="px-2 py-1 text-xs border rounded"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out-for-delivery">Out for Delivery</option>
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
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Tracking Details</DialogTitle>
            <DialogDescription>Complete tracking information for {selectedOrder?.orderId}</DialogDescription>
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
                      <span className="font-medium">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking Number:</span>
                      <span className="font-mono text-sm">{selectedOrder.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="font-medium">{selectedOrder.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">₹{selectedOrder.amount}</span>
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
                        <p className="font-medium">{selectedOrder.customerName}</p>
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
                              <h4 className="font-semibold text-foreground">{event.status}</h4>
                              <span className="text-sm text-muted-foreground">{event.date} at {event.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">📍 {event.location}</p>
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

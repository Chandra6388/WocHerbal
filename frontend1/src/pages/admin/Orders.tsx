
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, Download, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  paymentStatus: 'paid' | 'failed' | 'pending';
  deliveryStatus: 'pending' | 'shipped' | 'delivered';
  date: string;
  trackingId?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Priya Sharma',
      product: 'Organic Lavender Oil',
      amount: 299,
      paymentStatus: 'paid',
      deliveryStatus: 'delivered',
      date: '2024-01-15',
      trackingId: 'TRK123456'
    },
    {
      id: 'ORD-002',
      customerName: 'Raj Kumar',
      product: 'Tea Tree Oil',
      amount: 249,
      paymentStatus: 'paid',
      deliveryStatus: 'shipped',
      date: '2024-01-14',
      trackingId: 'TRK123457'
    },
    {
      id: 'ORD-003',
      customerName: 'Anita Patel',
      product: 'Organic Lavender Oil',
      amount: 299,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      date: '2024-01-13'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState<{
    deliveryStatus: 'pending' | 'shipped' | 'delivered';
    trackingId: string;
  }>({
    deliveryStatus: 'pending',
    trackingId: ''
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleUpdateOrder = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      deliveryStatus: order.deliveryStatus,
      trackingId: order.trackingId || ''
    });
    setIsUpdateDialogOpen(true);
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      setOrders(orders.map(order =>
        order.id === selectedOrder.id
          ? { ...order, ...updateData }
          : order
      ));
      toast.success('Order updated successfully!');
      setIsUpdateDialogOpen(false);
    }
  };

  const handleExportOrders = () => {
    // Simple CSV export simulation
    const csvContent = [
      ['Order ID', 'Customer', 'Product', 'Amount', 'Payment Status', 'Delivery Status', 'Date'].join(','),
      ...orders.map(order => [
        order.id,
        order.customerName,
        order.product,
        order.amount,
        order.paymentStatus,
        order.deliveryStatus,
        order.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and delivery status</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell>{getDeliveryStatusBadge(order.deliveryStatus)}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUpdateOrder(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
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
              Update delivery status and tracking information for order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status</Label>
              <select
                id="deliveryStatus"
                value={updateData.deliveryStatus}
                onChange={(e) => setUpdateData({...updateData, deliveryStatus: e.target.value as 'pending' | 'shipped' | 'delivered'})}
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
                onChange={(e) => setUpdateData({...updateData, trackingId: e.target.value})}
                placeholder="Enter tracking ID"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">Update Order</Button>
              <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
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

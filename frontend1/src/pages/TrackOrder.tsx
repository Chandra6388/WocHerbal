
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check localStorage for orders
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const order = orders.find((o: any) => o.id === orderId);
      
      if (order) {
        setOrderData({
          ...order,
          tracking: {
            status: 'shipped',
            estimatedDelivery: '2024-01-15',
            trackingNumber: 'WOC' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            updates: [
              { date: '2024-01-10', time: '10:30 AM', status: 'Order Confirmed', description: 'Your order has been confirmed and is being prepared.' },
              { date: '2024-01-11', time: '2:15 PM', status: 'Processing', description: 'Your order is being processed at our facility.' },
              { date: '2024-01-12', time: '11:00 AM', status: 'Shipped', description: 'Your order has been shipped and is on its way.' },
              { date: '2024-01-13', time: '9:45 AM', status: 'In Transit', description: 'Package is in transit to your delivery location.' }
            ]
          }
        });
      } else {
        setOrderData(null);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
      case 'in transit':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
            Track Your
            <span className="block text-accent">Order</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your order ID to track the status and location of your WOC product
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Enter Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., ORD1234567890"
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? 'Searching...' : 'Track Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Results */}
        {orderData && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Order ID:</span> {orderData.id}</p>
                      <p><span className="text-muted-foreground">Order Date:</span> {new Date(orderData.orderDate).toLocaleDateString()}</p>
                      <p><span className="text-muted-foreground">Total Amount:</span> ₹{orderData.totalPrice}</p>
                      <p><span className="text-muted-foreground">Status:</span> 
                        <span className="ml-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          {orderData.tracking.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Tracking Number:</span> {orderData.tracking.trackingNumber}</p>
                      <p><span className="text-muted-foreground">Estimated Delivery:</span> {orderData.tracking.estimatedDelivery}</p>
                      <p><span className="text-muted-foreground">Delivery Address:</span> {orderData.customerInfo.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderData.tracking.updates.map((update, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(update.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">{update.status}</h4>
                          <span className="text-sm text-muted-foreground">{update.date} at {update.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {orderData === null && orderId && !isLoading && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
                <p className="text-muted-foreground">
                  We couldn't find an order with ID "{orderId}". Please check your order ID and try again.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

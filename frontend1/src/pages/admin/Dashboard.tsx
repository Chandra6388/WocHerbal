
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  DollarSign, Package, ShoppingCart, TrendingUp, Users, Eye, 
  AlertTriangle, Clock, CheckCircle, Star, ArrowUp, ArrowDown,
  Globe, Smartphone, Monitor, Activity, Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {getDashboardStats} from '@/services/admin/dashbaord';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardStats();
  }, []);


  console.log('Dashboard Data:', dashboardData?.stats?.revenue?.total);

  // Enhanced dummy data with more comprehensive metrics
  const salesData = [
    { day: 'Mon', sales: 1200, orders: 24, visitors: 450 },
    { day: 'Tue', sales: 1580, orders: 31, visitors: 520 },
    { day: 'Wed', sales: 1800, orders: 36, visitors: 480 },
    { day: 'Thu', sales: 900, orders: 18, visitors: 380 },
    { day: 'Fri', sales: 2200, orders: 44, visitors: 620 },
    { day: 'Sat', sales: 2800, orders: 56, visitors: 750 },
    { day: 'Sun', sales: 2000, orders: 40, visitors: 580 },
  ];

  const topProducts = [
    { name: 'WOC Panchgavya Oil', sales: 156, revenue: 155844, growth: 12.5 },
    { name: 'Ayurvedic Hair Oil', sales: 89, revenue: 89000, growth: -2.1 },
    { name: 'Herbal Scalp Treatment', sales: 67, revenue: 67000, growth: 8.3 },
    { name: 'Natural Hair Serum', sales: 45, revenue: 45000, growth: 15.2 },
  ];

  const trafficSources = [
    { name: 'Direct', value: 45, color: '#8884d8' },
    { name: 'Social Media', value: 30, color: '#82ca9d' },
    { name: 'Search Engine', value: 20, color: '#ffc658' },
    { name: 'Email', value: 5, color: '#ff7c7c' },
  ];

  const deviceData = [
    { device: 'Mobile', percentage: 65, users: 3250 },
    { device: 'Desktop', percentage: 30, users: 1500 },
    { device: 'Tablet', percentage: 5, users: 250 },
  ];

  const recentActivities = [
    { type: 'order', message: 'New order #ORD-2024-001 received', time: '2 min ago', status: 'success' },
    { type: 'user', message: 'New user registration: priya@email.com', time: '5 min ago', status: 'info' },
    { type: 'payment', message: 'Payment confirmed for order #ORD-2024-000', time: '8 min ago', status: 'success' },
    { type: 'stock', message: 'Low stock alert: WOC Panchgavya Oil (5 left)', time: '12 min ago', status: 'warning' },
    { type: 'review', message: 'New 5-star review on Ayurvedic Hair Oil', time: '15 min ago', status: 'success' },
  ];

  const stats = [
    { 
      title: 'Total Revenue Today', 
      value: dashboardData?.stats?.revenue?.total, 
      change: '+12.5%', 
      changeType: 'positive',
      icon: DollarSign, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Orders Today',
      value: dashboardData?.stats?.orders?.total || '0',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Active Users', 
      value: dashboardData?.stats?.users?.total || '0',
      change: '+24.1%',
      changeType: 'positive',
      icon: Users, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Conversion Rate', 
      value: '3.24%', 
      change: '-0.5%',
      changeType: 'negative',
      icon: TrendingUp, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Page Views', 
      value: '8,429', 
      change: '+18.7%',
      changeType: 'positive',
      icon: Eye, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      title: 'Live Visitors', 
      value: '127', 
      change: 'Live',
      changeType: 'neutral',
      icon: Activity, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'user': return <Users className="w-4 h-4 text-green-600" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'stock': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center text-sm">
                    {stat.changeType === 'positive' && <ArrowUp className="w-3 h-3 text-green-600 mr-1" />}
                    {stat.changeType === 'negative' && <ArrowDown className="w-3 h-3 text-red-600 mr-1" />}
                    <span className={`font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales & Orders Overview</CardTitle>
            <CardDescription>Revenue and order trends for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `₹${value}` : value,
                  name === 'sales' ? 'Revenue' : 'Orders'
                ]} />
                <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="orders" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales • ₹{product.revenue.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center">
                    {product.growth > 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'destructive' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Analytics & Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Analytics</CardTitle>
            <CardDescription>How users access your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.device === 'Mobile' && <Smartphone className="w-5 h-5 text-blue-600" />}
                    {device.device === 'Desktop' && <Monitor className="w-5 h-5 text-green-600" />}
                    {device.device === 'Tablet' && <Globe className="w-5 h-5 text-purple-600" />}
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-12">{device.percentage}%</span>
                    <span className="text-sm text-muted-foreground">{device.users} users</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Stock levels and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Low Stock Alert</p>
                    <p className="text-sm text-red-600">3 products below minimum stock</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-800">Restock Needed</p>
                    <p className="text-sm text-yellow-600">5 products need restocking</p>
                  </div>
                </div>
                <Badge variant="secondary">Warning</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Well Stocked</p>
                    <p className="text-sm text-green-600">12 products in good stock</p>
                  </div>
                </div>
                <Badge variant="default">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

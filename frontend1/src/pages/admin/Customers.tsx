
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Search, Eye, Edit, Trash2, UserPlus, Download, Filter,
  Mail, Phone, MapPin, Calendar, ShoppingBag, Star
} from 'lucide-react';
import { getAllUser, updateUserStatus, deletUser } from '@/services/admin/User';
import { useToast } from "@/hooks/use-toast";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    city: string,
    country: string,
    street: string
  };
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  lastOrder: string;
  rating: number;
}

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    allUsers()
  }, [])

  const allUsers = async () => {
    try {
      const req = { user: "admin" }
      const res = await getAllUser(req);
      if (res?.status === "success" && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setCustomers([]);
      toast({
        title: "Server Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred while fetching users.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const req = { user: 'admin', id: customerId };
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This customer will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    // Step 2: Proceed with deletion
    try {
      const res = await deletUser(req);

      if (res?.status === 'success') {
        toast({
          title: 'Customer Deleted',
          description: 'Customer has been successfully deleted.',
          variant: 'success',
          duration: 4000,
        });

        allUsers(); // Refresh user list
      } else {
        toast({
          title: 'Failed to Delete',
          description: res?.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Unexpected error occurred while deleting the customer.',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  const handleUpdateStatus = async (customer: Customer) => {
    const newStatus: 'active' | 'inactive' =
      customer.status === 'active' ? 'inactive' : 'active';

    const result = await Swal.fire({
      title: 'Change Status?',
      text: `Are you sure you want to change ${customer.name}'s status to "${newStatus}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    const req = {
      id: customer._id,
      status: newStatus,
      user: 'admin',
    };

    try {
      const res = await updateUserStatus(req);
      if (res?.status === 'success') {
        toast({
          title: 'Status Updated',
          description: `Customer "${customer.name}" has been marked as "${newStatus}".`,
          variant: 'success',
          duration: 4000,
        });

        allUsers?.(); // Refresh user list
      } else {
        toast({
          title: 'Failed to Update',
          description: res?.message || 'Unable to update user status. Please try again.',
          variant: 'destructive',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);

      toast({
        title: 'Server Error',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'An unexpected error occurred while updating customer status.',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  const handleExportCustomers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Status', 'Join Date'].join(','),
      ...filteredCustomers.map(customer => [
        customer?.name,
        customer?.email,
        customer?.phone,
        customer?.totalOrders,
        customer?.totalSpent,
        customer?.status,
        customer?.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
        title: 'success',
        description: "Customer data exported successfully!",
        variant: 'success',
        duration: 4000,
      });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage and track your customers</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Button onClick={handleExportCustomers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers?.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{customers?.filter(c => c.status === 'active').length}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                {/* <p className="text-2xl font-bold">₹{customers?.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p> */}
                <p className="text-2xl font-bold">₹ 0</p>

              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">₹ 0</p>
                {/* <p className="text-2xl font-bold">₹{Math.round(customers?.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0))}</p> */}
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers by name or email..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item?.name}</p>
                      <p className="text-sm text-muted-foreground">{item?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{item?.phone}</p>
                      <p className="text-sm text-muted-foreground">{`${item?.address?.street || ""} ${item?.address?.city || ""} ${item?.address?.country || ""}`}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{item?.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">N/A</p>
                    </div>
                  </TableCell>
                  <TableCell>₹ {item?.totalSpent?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={() => handleUpdateStatus(item)}
                      />
                      <div
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full
                            dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                            after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                            dark:border-gray-600"
                        style={{
                          backgroundColor: item?.status === "active" ? "#8bf0bd" : "",
                        }}
                      ></div>
                    </label>
                  </TableCell>
                  <TableCell>{"N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewCustomer(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCustomer(item._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete information about {selectedCustomer?.name}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedCustomer?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedCustomer?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{`${selectedCustomer?.address?.street || ""}, ${selectedCustomer?.address?.city || ""}, ${selectedCustomer?.address?.country || ""}`}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">{new Date(selectedCustomer?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">₹{selectedCustomer?.totalSpent?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-xl font-bold">{selectedCustomer.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-2 flex gap-2">
                    {getStatusBadge(selectedCustomer?.status)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;

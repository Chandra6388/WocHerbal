import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import Reviews from "@/pages/admin/Reviews";
import Orders from "@/pages/admin/Orders";
import OrderTracking from "@/pages/admin/OrderTracking";
import Customers from "@/pages/admin/Customers";
import Notifications from "@/pages/admin/Notifications";
import BlogManagement from "@/pages/admin/BlogManagement";
import AdminSidebar from '@/components/admin/AdminSidebarNew';
import Category from '@/pages/admin/Category';



const AdminRoutes = () => (
  <div className="min-h-screen bg-background flex">
    <AdminSidebar />
    <main className="flex-1 overflow-auto">
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="category" element={<Category />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="orders" element={<Orders />} />
        <Route path="tracking" element={<OrderTracking />} />
        <Route path="customers" element={<Customers />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </div>

);

export default AdminRoutes;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import AdminLayoutNew from "@/components/admin/AdminLayoutNew";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import TrackOrder from "@/pages/TrackOrder";
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
import { BlogPost, BlogList } from "@/pages/Blog";
import AdminSidebar from '@/components/admin/AdminSidebarNew';


const AdminRoutes = () => (
  <div className="min-h-screen bg-background flex">
    <AdminSidebar />
    <main className="flex-1 overflow-auto">
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
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

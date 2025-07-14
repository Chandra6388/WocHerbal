
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";
import AdminLayoutNew from "./components/admin/AdminLayoutNew";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import Reviews from "./pages/admin/Reviews";
import Orders from "./pages/admin/Orders";
import OrderTracking from "./pages/admin/OrderTracking";
import Customers from "./pages/admin/Customers";
import Notifications from "./pages/admin/Notifications";
import BlogManagement from "./pages/admin/BlogManagement";
import { BlogPost, BlogList } from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/order-success" element={<Layout><OrderSuccess /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/track-order" element={<Layout><TrackOrder /></Layout>} />
              <Route path="/auth" element={<Layout><Auth /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/blog" element={<Layout><BlogList /></Layout>} />
              <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />

            
              <Route path="/admin" element={<AdminLayoutNew />}>
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
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

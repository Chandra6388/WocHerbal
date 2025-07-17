
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


const queryClient = new QueryClient();

const UserRoutes = () => (
    <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/products" element={<Layout><Products/></Layout>} />
        <Route path="/cart" element={<Layout><Cart/></Layout>} />
        <Route path="/profile" element={<Layout><Profile/></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout/></Layout>} />
    </Routes>
);


export default UserRoutes;

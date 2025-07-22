import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Layout from "@/components/Layout";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgotPassword";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Blog from "./pages/BlogList";
import Testimonials from "./pages/Testimonials";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import TrackOrder from "./pages/TrackOrder";
import AdminRoute from "@/routes/adminRoutes";
import { getUserFromToken } from "./Utils/TokenData";
import ScrollToTop from '@/components/ScrollToTop'
const queryClient = new QueryClient();

const ProtectedRoute: React.FC = () =>
  getUserFromToken() ? <Outlet /> : <Navigate to="/login" replace />;

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated && window.location.pathname.includes("admin")) {
      navigate("/login");
    }
    if (isAuthenticated && window.location.pathname === "/") {
      // if (!isAuthenticated && window.location.pathname)
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Index />{" "}
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <Products />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/blog"
        element={
          <Layout>
            <Blog />
          </Layout>
        }
      />
      <Route
        path="/testimonials"
        element={
          <Layout>
            <Testimonials />
          </Layout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <Layout>
            <ProductDetail />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <Checkout />
          </Layout>
        }
      />
      <Route
        path="/orders"
        element={
          <Layout>
            <Orders />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/track-order"
        element={
          <Layout>
            <TrackOrder />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/not-found" element={<NotFound />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/purchase/:productId" element={<Products />} />
      </Route>
      <Route
        path="/admin/*"
        element={isAuthenticated ? <AdminRoute /> : <Login />}
      />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
            <ScrollToTop /> 
              <AppRoutes />
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

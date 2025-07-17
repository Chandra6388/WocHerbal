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

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Context Providers
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Layout and Pages
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
import Blog from "./pages/Blog";
import Testimonials from "./pages/Testimonials";

// Route Components
import AdminRoute from "@/routes/adminRoutes";

// Utils
import { getUserFromToken } from "./Utils/TokenData";

const queryClient = new QueryClient();

// 🔒 ProtectedRoute for users
const ProtectedRoute: React.FC = () =>
  getUserFromToken() ? <Outlet /> : <Navigate to="/login" replace />;

// 📦 AppRoutes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect when logged in user hits root "/"
    if (isAuthenticated && window.location.pathname === "/") {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Routes>
      {/* Public Routes */}

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/not-found" element={<NotFound />} />

      {/* Protected Route for Purchase */}
      <Route element={<ProtectedRoute />}>
        <Route path="/purchase/:productId" element={<Products />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoute />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};

// 🚀 Main App Component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
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

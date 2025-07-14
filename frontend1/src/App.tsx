import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgotPassword";
import NotFound from "./pages/NotFound";
import AdminRoute from "@/routes/adminRoutes";
import UserRoute from "@/routes/userRoutes";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Redirect only when user lands at root "/"
    if (isAuthenticated && window.location.pathname === "/") {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/user/*" element={<UserRoute />} />
            <Route path="/admin/*" element={<AdminRoute />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

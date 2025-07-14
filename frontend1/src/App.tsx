
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgotPassword";
import NotFound from "./pages/NotFound";
import AdminRoute from "@/routes/adminRoutes";
import UserRoute from "@/routes/userRoutes";
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from "react";
// import { useNavigation } from 'react-router-dom';



const queryClient = new QueryClient();

const App = () => {
  // const navigate = useNavigation();
  const { isAuthenticated, user } = useAuth();
  console.log("isAuthenticated:", isAuthenticated);


  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, navigate]);

  console.log("user:", user?.role);

  return (
    <QueryClientProvider client={queryClient}>

      <CartProvider>
        <TooltipProvider>
          <BrowserRouter>
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
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>

    </QueryClientProvider>
  );
};

export default App;

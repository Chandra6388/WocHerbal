
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loginUser, registerUser, logoutUser } from '@/services/authSerives';
import { getUserFromToken } from '@/Utils/TokenData';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const token = getUserFromToken()
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("SSSSS", email, password);
    try {
      const req = { email, password };
      const res = await loginUser(req);
      if (res?.status == "success") {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "success",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: res?.message || "Invalid email or password",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.message || "An error occurred during login",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Login error:", error);
      return false
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    const req = { name, email, password, phone };
    try {
      const res = await registerUser(req);
      if (res?.status === "success") {
        toast({
          title: "Registration Successful",
          description: "Welcome to WocHerbal!",
          variant: "success",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: res?.message || "User already exists or invalid data",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.message || "An error occurred during registration",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Registration error:", error);
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      updateProfile,
      logout,
      isAuthenticated: token ? true : false,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

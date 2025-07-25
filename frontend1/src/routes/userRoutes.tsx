import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";


const UserRoutes = () => (
    <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        
    </Routes>
);


export default UserRoutes;

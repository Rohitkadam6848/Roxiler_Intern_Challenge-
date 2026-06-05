import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Navbar from "../components/Navbar";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import StoreList from "../pages/user/StoreList";
import AdminDashboard from "../pages/admin/AdminDashboard"; // <-- Added the real Admin import!

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* This now points to your real Admin component! */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/owner/dashboard" element={<OwnerDashboard />} />

        <Route path="/stores" element={<StoreList />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

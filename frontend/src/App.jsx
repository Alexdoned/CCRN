import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Navbar } from "./components/Navbar.jsx";
import { Home } from "./pages/Home.jsx";
import { Leaders } from "./pages/Leaders.jsx";
import { Events } from "./pages/Events.jsx";
import { Register } from "./pages/Register.jsx";
import { AdminLogin } from "./pages/AdminLogin.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import AdminEvents from "./pages/admin/AdminEvents.jsx";
import AdminLeaders from "./pages/admin/AdminLeaders.jsx";
import { Toaster } from "./components/ui/toaster.jsx";

// Protected Route Component to secure the Admin Dashboard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Box bg="rgb(10, 15, 30)" minH="100vh">
        {/* Navigation Navbar */}
        <Navbar />

        {/* Toast Notification Mount */}
        <Toaster />

        {/* Page Routing */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaders" element={<Leaders />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaders"
            element={
              <ProtectedRoute>
                <AdminLeaders />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;

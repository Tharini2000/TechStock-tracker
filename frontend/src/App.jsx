import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import AddProduct from "./pages/admin/AddProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Reports from "./pages/admin/Reports";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageOrders from "./pages/admin/ManageOrders";
import ViewFeedbacks from "./pages/admin/ViewFeedbacks";
import { useAuth } from "./context/AuthContext";

// Protected Route - requires authentication
const ProtectedRoute = ({ roles, children }) => {
  const { auth } = useAuth();

  if (!auth.user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.user.role)) return <Navigate to="/" replace />;

  return children;
};

// Public Route - redirects authenticated users to dashboard
const PublicRoute = ({ children }) => {
  const { auth } = useAuth();

  if (auth.user) {
    return <Navigate to={auth.user.role === "admin" ? "/admin" : "/home"} replace />;
  }

  return children;
};

const App = () => {
  const { auth } = useAuth();
  
  // Root path behavior: Login first for unauthenticated users, then dashboard based on role
  const getRootRedirect = () => {
    if (auth?.user) {
      // User is authenticated - redirect to dashboard based on role
      return auth.user.role === "admin" ? "/admin" : "/home";
    }
    // User not authenticated - always start at login
    return "/login";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6 md:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <Routes>
            {/* Root path - LOGIN FIRST for new users, then dashboard based on role */}
            <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />
            {/* Public Routes - redirects to dashboard if already logged in */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            {/* User/Customer Routes - requires authentication */}
            <Route path="/products" element={<ProtectedRoute roles={["customer", "admin"]}><Products /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute roles={["customer", "admin"]}><ProductDetails /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute roles={["customer", "admin"]}><Cart /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={["customer", "admin"]}><Orders /></ProtectedRoute>} />

            {/* Admin Routes - requires admin role */}
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute roles={["admin"]}><ManageProducts /></ProtectedRoute>} />
            <Route path="/admin/products/add" element={<ProtectedRoute roles={["admin"]}><AddProduct /></ProtectedRoute>} />
            <Route path="/admin/products/:id/edit" element={<ProtectedRoute roles={["admin"]}><UpdateProduct /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute roles={["admin"]}><ManageCategories /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><ManageOrders /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>} />
            <Route path="/admin/feedbacks" element={<ProtectedRoute roles={["admin"]}><ViewFeedbacks /></ProtectedRoute>} />

            {/* Catch-all - redirect to login if not authenticated */}
            <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
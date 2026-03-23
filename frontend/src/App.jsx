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
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ roles, children }) => {
  const { auth } = useAuth();

  if (!auth.user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.user.role)) return <Navigate to="/" replace />;

  return children;
};

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6 md:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/products" element={<ProtectedRoute roles={["user", "admin"]}><Products /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute roles={["user", "admin"]}><ProductDetails /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute roles={["user", "admin"]}><Cart /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={["user", "admin"]}><Orders /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute roles={["admin"]}><ManageProducts /></ProtectedRoute>} />
            <Route path="/admin/products/add" element={<ProtectedRoute roles={["admin"]}><AddProduct /></ProtectedRoute>} />
            <Route path="/admin/products/:id/edit" element={<ProtectedRoute roles={["admin"]}><UpdateProduct /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute roles={["admin"]}><ManageCategories /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><ManageOrders /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
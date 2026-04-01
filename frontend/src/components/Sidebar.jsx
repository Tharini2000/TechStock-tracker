import { NavLink } from "react-router-dom";

const sidebarClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

const Sidebar = () => {
  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white p-4 lg:w-64">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Admin Menu</h2>
      <div className="space-y-2">
        <NavLink to="/admin" end className={sidebarClass}>Dashboard</NavLink>
        <NavLink to="/admin/products" className={sidebarClass}>Manage Products</NavLink>
        <NavLink to="/admin/products/add" className={sidebarClass}>Add Product</NavLink>
        <NavLink to="/admin/categories" className={sidebarClass}>Manage Categories</NavLink>
        <NavLink to="/admin/orders" className={sidebarClass}>Manage Orders</NavLink>
        <NavLink to="/admin/feedbacks" className={sidebarClass}>Feedbacks</NavLink>
        <NavLink to="/admin/reports" className={sidebarClass}>Reports</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Boxes,
  House,
  Info,
  Phone,
  MessageSquareText,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Package,
  ChevronDown,
  ShoppingCart,
  ClipboardList,
  UserCircle2,
} from "lucide-react";

///comment

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const user = auth?.user;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
    setUserDropdownOpen(false);
  };

  const closeAllMenus = () => {
    setMobileOpen(false);
    setUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-lg"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      isActive
        ? "bg-gradient-to-r from-brand-500 to-brand-700 text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const dropdownItemClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="group flex items-center gap-3"
          onClick={closeAllMenus}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg transition group-hover:scale-105">
            <Boxes size={22} />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight text-white">
              TechStock
            </h1>
            <p className="text-xs text-slate-400">Inventory System</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 lg:flex">
          {isAdmin ? (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                <LayoutDashboard size={16} />
                Admin Dashboard
              </NavLink>

              <div className="ml-3 flex items-center gap-3 pl-3">
                <div className="hidden rounded-xl bg-white/5 px-3 py-2 xl:block">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="max-w-[140px] truncate text-sm font-semibold text-white">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs uppercase text-brand-400">Admin</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/" className={navLinkClass}>
                <House size={16} />
                Home
              </NavLink>

              <NavLink to="/about" className={navLinkClass}>
                <Info size={16} />
                About Us
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                <Phone size={16} />
                Contact
              </NavLink>

              <NavLink to="/feedback" className={navLinkClass}>
                <MessageSquareText size={16} />
                Feedback
              </NavLink>

              {user && (
                <NavLink to="/products" className={navLinkClass}>
                  <Package size={16} />
                  Products
                </NavLink>
              )}

              {user ? (
                <div className="ml-3 flex items-center gap-3 pl-3">
                  {/* User dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 transition hover:bg-white/10"
                    >
                      <div className="hidden text-left xl:block">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="max-w-[140px] truncate text-sm font-semibold text-white">
                          {user?.name || user?.email}
                        </p>
                        <p className="text-xs uppercase text-cyan-400">
                          Customer
                        </p>
                      </div>

                      <UserCircle2 size={20} className="text-white xl:hidden" />
                      <ChevronDown
                        size={16}
                        className={`text-slate-300 transition-transform ${
                          userDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
                        <Link
                          to="/cart"
                          onClick={closeAllMenus}
                          className={dropdownItemClass}
                        >
                          <ShoppingCart size={16} />
                          Cart
                        </Link>

                        <Link
                          to="/orders"
                          onClick={closeAllMenus}
                          className={dropdownItemClass}
                        >
                          <ClipboardList size={16} />
                          Orders
                        </Link>

                        <div className="my-2 h-px bg-white/10" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="ml-3 flex items-center gap-2 pl-3">
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <LogIn size={16} />
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                  >
                    <UserPlus size={16} />
                    Register
                  </NavLink>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {isAdmin ? (
              <>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs uppercase text-brand-400">Admin</p>
                </div>

                <NavLink
                  to="/admin"
                  className={mobileNavLinkClass}
                  onClick={closeAllMenus}
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  className={mobileNavLinkClass}
                  onClick={closeAllMenus}
                >
                  <House size={18} />
                  Home
                </NavLink>

                <NavLink
                  to="/about"
                  className={mobileNavLinkClass}
                  onClick={closeAllMenus}
                >
                  <Info size={18} />
                  About Us
                </NavLink>

                <NavLink
                  to="/contact"
                  className={mobileNavLinkClass}
                  onClick={closeAllMenus}
                >
                  <Phone size={18} />
                  Contact
                </NavLink>

                <NavLink
                  to="/feedback"
                  className={mobileNavLinkClass}
                  onClick={closeAllMenus}
                >
                  <MessageSquareText size={18} />
                  Feedback
                </NavLink>

                {user && (
                  <NavLink
                    to="/products"
                    className={mobileNavLinkClass}
                    onClick={closeAllMenus}
                  >
                    <Package size={18} />
                    Products
                  </NavLink>
                )}

                {user ? (
                  <>
                    <div className="my-2 h-px bg-white/10" />

                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white">
                        {user?.name || user?.email}
                      </p>
                      <p className="text-xs uppercase text-cyan-400">
                        Customer
                      </p>
                    </div>

                    <Link
                      to="/cart"
                      onClick={closeAllMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <ShoppingCart size={18} />
                      Cart
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeAllMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <ClipboardList size={18} />
                      Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="my-2 h-px bg-white/10" />

                    <NavLink
                      to="/login"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                      onClick={closeAllMenus}
                    >
                      <LogIn size={18} />
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 text-sm font-semibold text-white"
                      onClick={closeAllMenus}
                    >
                      <UserPlus size={18} />
                      Register
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
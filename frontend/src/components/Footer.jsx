import { Link } from "react-router-dom";
import { Boxes, Mail, Phone, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        
        {/* Top Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Boxes size={18} />
              </div>
              <h2 className="text-sm font-bold text-white">
                TechStock Tracker
              </h2>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Smart inventory & order management for electronic product teams.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-white">
              Links
            </h3>
            <ul className="mt-2 space-y-1 text-xs">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/feedback" className="hover:text-white">Feedback</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-white">
              Features
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>Inventory Tracking</li>
              <li>Order Management</li>
              <li>Admin Dashboard</li>
              <li>Reports</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-white">
              Contact
            </h3>

            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail size={14} /> support@techstock.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} /> +94 77 123 4567
              </li>
            </ul>

            <div className="mt-3 flex gap-2">
              <a className="p-2 rounded-md bg-white/5 hover:bg-white/10">
                <Github size={14} />
              </a>
              <a className="p-2 rounded-md bg-white/5 hover:bg-white/10">
                <Linkedin size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-4 border-t border-white/10 pt-3 text-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} TechStock Tracker</p>
          <p className="mt-1">
             Inventory & Order Management System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
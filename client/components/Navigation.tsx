import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Data Management", path: "/data" },
  ];

  return (
    <nav className="border-b border-stc-purple/20 bg-stc-purple-dark backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center gap-2">
              <div className="bg-stc-purple rounded-lg p-2 group-hover:bg-stc-purple/90 transition-colors">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">COW Deploy AI</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-white/20"></div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fc565c09ac98d4bb1923fb8ee199fe98c?format=webp&width=200"
              alt="STC"
              className="h-6 brightness-0 invert"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-stc-lavender"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={location.pathname}
              onChange={(e) => {
                const path = e.target.value;
                window.location.href = path;
              }}
              className="bg-stc-purple border border-white/20 text-white rounded px-3 py-2 text-sm"
            >
              {navLinks.map((link) => (
                <option key={link.path} value={link.path}>
                  {link.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

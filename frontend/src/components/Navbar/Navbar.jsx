import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Dice6, User, LogOut, Settings, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const authNavLinks = [
    { label: "Catalog", href: "/catalog" },
    { label: "Reserve Table", href: "/reserve" },
];

export function Navbar({ menuOpen, setMenuOpen }) {
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const isHome = location.pathname === "/";

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setUserMenuOpen(false);
        if (userMenuOpen) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [userMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate("/");
        setUserMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || !isHome
                    ? "bg-[#0f1a0f]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[#2a4a2a]"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-[#c8a84b] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Dice6 className="w-5 h-5 text-[#0f1a0f]" strokeWidth={2.5} />
                    </div>
                    <span
                        className="text-white tracking-tight"
                        style={{ fontSize: "1.25rem", fontWeight: 700 }}
                    >
            Board<span className="text-[#c8a84b]">Root</span>
          </span>
                </Link>

                {/* Desktop Nav - Only show when authenticated */}
                {isAuthenticated && (
                    <nav className="hidden md:flex items-center gap-8">
                        {authNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`hover:text-white transition-colors duration-200 ${
                                    location.pathname === link.href ? "text-[#c8a84b]" : "text-[#a8c4a8]"
                                }`}
                                style={{ fontSize: "0.9rem" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`flex items-center gap-1.5 hover:text-white transition-colors duration-200 ${
                                    location.pathname.startsWith("/admin") ? "text-[#c8a84b]" : "text-[#a8c4a8]"
                                }`}
                                style={{ fontSize: "0.9rem" }}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                    </nav>
                )}

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        /* User Menu */
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserMenuOpen(!userMenuOpen);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2a4a2a] hover:border-[#4a7a4a] hover:bg-[#1a2e1a] transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#c8a84b] flex items-center justify-center">
                                    <User className="w-4 h-4 text-[#0f1a0f]" />
                                </div>
                                <span className="text-white text-sm" style={{ fontWeight: 500 }}>
                                    {user?.firstName || "User"}
                                </span>
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#12201a] border border-[#2a4a2a] rounded-xl shadow-xl overflow-hidden">
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="flex items-center gap-3 px-4 py-3 text-[#c8a84b] hover:bg-[#1a2e1a] transition-colors border-b border-[#2a4a2a]"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span className="text-sm">Admin Panel</span>
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-[#a8c4a8] hover:bg-[#1a2e1a] hover:text-white transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="text-sm">Account Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[#a8c4a8] hover:bg-[#1a2e1a] hover:text-white transition-colors border-t border-[#2a4a2a]"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Login/Register buttons */
                        <>
                            <Link
                                to="/login"
                                className="px-5 py-2 rounded-lg text-[#c8a84b] border border-[#c8a84b]/40 hover:border-[#c8a84b] hover:bg-[#c8a84b]/10 transition-all duration-200 text-sm"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 rounded-lg bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all duration-200 text-sm shadow-lg shadow-[#c8a84b]/20"
                            >
                                Join the Club
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white p-1"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 overflow-hidden ${
                    menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-[#0f1a0f]/98 backdrop-blur-md border-t border-[#2a4a2a] px-6 py-4 flex flex-col gap-4">
                    {isAuthenticated ? (
                        <>
                            {authNavLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="text-[#a8c4a8] hover:text-white py-2 border-b border-[#1a2e1a] transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-2 text-[#c8a84b] hover:text-white py-2 border-b border-[#1a2e1a] transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin Panel
                                </Link>
                            )}
                            <div className="flex flex-col gap-3 pt-2">
                                <Link
                                    to="/profile"
                                    className="w-full py-2.5 rounded-lg text-[#c8a84b] border border-[#c8a84b]/40 text-sm text-center"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Account Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="w-full py-2.5 rounded-lg bg-[#2a4a2a] text-white text-sm text-center"
                                >
                                    Log Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link
                                to="/login"
                                className="w-full py-2.5 rounded-lg text-[#c8a84b] border border-[#c8a84b]/40 text-sm text-center"
                                onClick={() => setMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="w-full py-2.5 rounded-lg bg-[#c8a84b] text-[#0f1a0f] text-sm text-center"
                                onClick={() => setMenuOpen(false)}
                            >
                                Join the Club
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

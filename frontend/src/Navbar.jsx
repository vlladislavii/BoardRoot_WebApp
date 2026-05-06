import { useState, useEffect } from "react";
import { Menu, X, Dice6 } from "lucide-react";

// interface NavbarProps {
//     menuOpen: boolean;
//     setMenuOpen: (open: boolean) => void;
// }

const navLinks = [
    { label: "Catalog", href: "#catalog" },
    { label: "Rent & Go", href: "#rent" },
    { label: "Stay & Play", href: "#stay" },
    { label: "How It Works", href: "#how" },
];

export function Navbar({ menuOpen, setMenuOpen }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#0f1a0f]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[#2a4a2a]"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-[#c8a84b] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Dice6 className="w-5 h-5 text-[#0f1a0f]" strokeWidth={2.5} />
                    </div>
                    <span
                        className="text-white tracking-tight"
                        style={{ fontSize: "1.25rem", fontWeight: 700 }}
                    >
            Board<span className="text-[#c8a84b]">Root</span>
          </span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[#a8c4a8] hover:text-white transition-colors duration-200"
                            style={{ fontSize: "0.9rem" }}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <button className="px-5 py-2 rounded-lg text-[#c8a84b] border border-[#c8a84b]/40 hover:border-[#c8a84b] hover:bg-[#c8a84b]/10 transition-all duration-200 text-sm">
                        Log In
                    </button>
                    <button className="px-5 py-2 rounded-lg bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all duration-200 text-sm shadow-lg shadow-[#c8a84b]/20">
                        Join the Club
                    </button>
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
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[#a8c4a8] hover:text-white py-2 border-b border-[#1a2e1a] transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="flex flex-col gap-3 pt-2">
                        <button className="w-full py-2.5 rounded-lg text-[#c8a84b] border border-[#c8a84b]/40 text-sm">
                            Log In
                        </button>
                        <button className="w-full py-2.5 rounded-lg bg-[#c8a84b] text-[#0f1a0f] text-sm">
                            Join the Club
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

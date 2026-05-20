import { Dice6, MapPin, Mail, Phone } from "lucide-react";

const links = {
    Platform: ["Browse Catalog", "Rent & Go", "Stay & Play", "How It Works"],
    Account: ["Create Account", "Login", "My Rentals", "My Bookings"],
    Club: ["About BoardRoot", "Visit Us", "Community Rules", "FAQ"],
};

export function Footer() {
    return (
        <footer className="bg-[#0a120a] border-t border-[#1e3a1e]">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-[#c8a84b] flex items-center justify-center">
                                <Dice6 className="w-5 h-5 text-[#0f1a0f]" strokeWidth={2.5} />
                            </div>
                            <span className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                Board<span className="text-[#c8a84b]">Root</span>
              </span>
                        </div>
                        <p className="text-[#4a6a4a] text-sm mb-6" style={{ lineHeight: 1.7, maxWidth: "280px" }}>
                            The board game club experience reimagined. Rent, reserve, and play —
                            all in one place, built for enthusiasts.
                        </p>
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5 text-[#4a6a4a] text-sm">
                                <MapPin className="w-4 h-4 text-[#c8a84b] flex-shrink-0" />
                                Rua das Tábuas, 42 · Lisbon, Portugal
                            </div>
                            <div className="flex items-center gap-2.5 text-[#4a6a4a] text-sm">
                                <Mail className="w-4 h-4 text-[#c8a84b] flex-shrink-0" />
                                hello@boardroot.club
                            </div>
                            <div className="flex items-center gap-2.5 text-[#4a6a4a] text-sm">
                                <Phone className="w-4 h-4 text-[#c8a84b] flex-shrink-0" />
                                +351 910 000 000
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            {[
                                // { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
                                // { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
                                // { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
                            ].map((s) => (
                                <button
                                    key={s.label}
                                    aria-label={s.label}
                                    className="w-8 h-8 rounded-lg bg-[#12201a] border border-[#1e3a1e] flex items-center justify-center text-[#4a6a4a] hover:text-[#c8a84b] hover:border-[#c8a84b]/40 transition-colors"
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <p className="text-white text-xs uppercase tracking-wider mb-4" style={{ fontWeight: 700 }}>
                                {category}
                            </p>
                            <ul className="space-y-2.5">
                                {items.map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-[#4a6a4a] text-sm hover:text-[#8aab8a] transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-[#1e3a1e] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[#2a4a2a] text-xs">
                        © 2026 BoardRoot. All rights reserved.
                    </p>
                    <div className="flex gap-5">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                            <a key={item} href="#" className="text-[#2a4a2a] text-xs hover:text-[#4a6a4a] transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

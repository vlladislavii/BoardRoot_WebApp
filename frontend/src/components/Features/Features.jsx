import { useNavigate } from "react-router-dom";
import { Home, Users, ShieldCheck, BookOpen } from "lucide-react";

const RENT_IMG =
    "https://images.unsplash.com/photo-1739133710791-371277c26001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBkaWNlJTIwY2FyZHMlMjB0YWJsZXRvcCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczMjYyOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080";

const PLAY_IMG =
    "https://images.unsplash.com/photo-1771584189767-1c9984005bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBwbGF5aW5nJTIwYm9hcmQlMjBnYW1lcyUyMGNhZmV8ZW58MXx8fHwxNzczMjYyOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080";

export function Features() {
    const navigate = useNavigate();

    const handleAction = () => {
        navigate("/login");
    };

    return (
        <section id="rent" className="py-28 bg-[#0f1a0f]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-20">
                    <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-3">
                        Two Ways to Play
                    </p>
                    <h2
                        className="text-white mb-4"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15 }}
                    >
                        Choose Your Game Night
                    </h2>
                    <p className="text-[#6a8a6a] max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
                        Whether you prefer the comfort of home or the buzz of the club, we've
                        built the experience around you.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Card 1 - Rent & Go */}
                    <div className="group relative rounded-2xl overflow-hidden border border-[#2a4a2a] hover:border-[#c8a84b]/50 transition-all duration-300 bg-[#12201a]">
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={RENT_IMG}
                                alt="Rent a game"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#12201a] via-[#12201a]/30 to-transparent" />
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#c8a84b] text-[#0f1a0f] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 700 }}>
                                <Home className="w-3.5 h-3.5" />
                                Rent & Go
                            </div>
                        </div>
                        <div className="p-7">
                            <h3
                                className="text-white mb-3"
                                style={{ fontSize: "1.4rem", fontWeight: 700 }}
                            >
                                Take the Game Home
                            </h3>
                            <p className="text-[#6a8a6a] mb-6" style={{ lineHeight: 1.7 }}>
                                Browse our full catalog, pick the games you want, and rent them to
                                enjoy at your own pace. Flexible rental periods starting from 3 days.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Live availability — see copies in real time",
                                    "Simple pickup & drop-off at the club",
                                    "Rated & reviewed by the community",
                                ].map((point) => (
                                    <li key={point} className="flex items-start gap-2.5 text-[#8aab8a] text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-[#c8a84b]/20 flex items-center justify-center flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />
                    </span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleAction}
                                className="mt-7 w-full py-3 rounded-xl border border-[#c8a84b]/40 text-[#c8a84b] hover:bg-[#c8a84b] hover:text-[#0f1a0f] transition-all duration-200 text-sm"
                            >
                                Browse Rentals
                            </button>
                        </div>
                    </div>

                    {/* Card 2 - Stay & Play */}
                    <div id="stay" className="group relative rounded-2xl overflow-hidden border border-[#2a4a2a] hover:border-[#c8a84b]/50 transition-all duration-300 bg-[#12201a]">
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={PLAY_IMG}
                                alt="Play at the club"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#12201a] via-[#12201a]/30 to-transparent" />
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#2a5a2a] text-white text-xs px-3 py-1.5 rounded-full border border-[#4a8a4a]" style={{ fontWeight: 700 }}>
                                <Users className="w-3.5 h-3.5" />
                                Stay & Play
                            </div>
                        </div>
                        <div className="p-7">
                            <h3
                                className="text-white mb-3"
                                style={{ fontSize: "1.4rem", fontWeight: 700 }}
                            >
                                Reserve a Club Table
                            </h3>
                            <p className="text-[#6a8a6a] mb-6" style={{ lineHeight: 1.7 }}>
                                Book one of our 12 dedicated game tables, order drinks, and dive into
                                any game from our in-club collection without leaving the venue.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Reserve slots from 1 to 4 hours",
                                    "Access to all in-club games included",
                                    "Snacks, drinks & game guides available",
                                ].map((point) => (
                                    <li key={point} className="flex items-start gap-2.5 text-[#8aab8a] text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-[#c8a84b]/20 flex items-center justify-center flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />
                    </span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleAction}
                                className="mt-7 w-full py-3 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all duration-200 text-sm shadow-lg shadow-[#c8a84b]/20"
                            >
                                Book a Table
                            </button>
                        </div>
                    </div>
                </div>

                {/* Extra feature pills */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <ShieldCheck className="w-4 h-4 text-[#c8a84b]" />, label: "Secure Login & Accounts" },
                        { icon: <BookOpen className="w-4 h-4 text-[#c8a84b]" />, label: "Full Game Catalog" },
                        { icon: <Home className="w-4 h-4 text-[#c8a84b]" />, label: "Rent From Home" },
                        { icon: <Users className="w-4 h-4 text-[#c8a84b]" />, label: "Club Community" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 bg-[#12201a] border border-[#1e3a1e] rounded-xl px-4 py-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#c8a84b]/10 flex items-center justify-center flex-shrink-0">
                                {item.icon}
                            </div>
                            <span className="text-[#8aab8a] text-sm">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

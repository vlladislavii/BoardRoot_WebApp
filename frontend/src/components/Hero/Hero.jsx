import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const HERO_IMG =
    "https://images.unsplash.com/photo-1763875018677-544233f257e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwY29sbGVjdGlvbiUyMHdvb2RlbiUyMHRhYmxlfGVufDF8fHx8MTc3MzI2Mjk2Mnww&ixlib=rb-4.1.0&q=80&w=1080";

const CLUB_IMG =
    "https://images.unsplash.com/photo-1766678003078-c8f7110c82d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwZ2FtZSUyMGNsdWIlMjBsb3VuZ2UlMjBpbnRlcmlvciUyMHdhcm0lMjBsaWdodGluZ3xlbnwxfHx8fDE3NzMyNjI5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleBrowseCatalog = () => {
        if (isAuthenticated) {
            navigate("/catalog");
        } else {
            navigate("/login");
        }
    };

    const handleHowItWorks = () => {
        navigate("/how-it-works");
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={HERO_IMG}
                    alt="Board games"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a0f] via-[#0f1a0f]/85 to-[#0f1a0f]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-transparent to-transparent" />
            </div>

            {/* Decorative circles */}
            <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-[#c8a84b]/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-1/2 w-96 h-96 rounded-full bg-[#2a5a2a]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
                {/* Left: Copy */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c8a84b]/15 border border-[#c8a84b]/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#c8a84b] animate-pulse" />
                        <span className="text-[#c8a84b] text-xs tracking-wider uppercase">
              Now Open — Join the Club
            </span>
                    </div>

                    <h1
                        className="text-white mb-6 leading-tight"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1 }}
                    >
                        Your Board Game
                        <br />
                        <span className="text-[#c8a84b]">Club Awaits.</span>
                    </h1>

                    <p className="text-[#8aab8a] mb-10 max-w-lg" style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                        Rent games to play at home or reserve a table and play right here at
                        the club. BoardRoot is where enthusiasts gather, explore, and play.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-12">
                        <button
                            onClick={handleBrowseCatalog}
                            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all shadow-xl shadow-[#c8a84b]/25 group"
                        >
                            Browse Catalog
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleHowItWorks}
                            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#2a4a2a] text-white hover:border-[#4a7a4a] hover:bg-[#1a2e1a] transition-all group"
                        >
                            <Play className="w-4 h-4 text-[#c8a84b]" />
                            How It Works
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-6">
                        {[
                            { label: "400+", sub: "Games in Catalog" },
                            { label: "12", sub: "Club Tables" },
                            { label: "2,000+", sub: "Active Members" },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col">
                <span className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {item.label}
                </span>
                                <span className="text-[#6a8a6a] text-xs">{item.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Floating card */}
                <div className="hidden lg:block relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-[#2a4a2a]">
                        <img
                            src={CLUB_IMG}
                            alt="Club interior"
                            className="w-full h-[480px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f]/80 via-transparent to-transparent" />
                        {/* Floating availability pill */}
                        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                            <div className="bg-[#0f1a0f]/90 backdrop-blur-md border border-[#2a4a2a] rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#c8a84b]/20 flex items-center justify-center">
                                    <span className="text-[#c8a84b] text-xs">🎲</span>
                                </div>
                                <div>
                                    <p className="text-white text-xs" style={{ fontWeight: 600 }}>Catan — 3 copies available</p>
                                    <p className="text-[#6a8a6a] text-xs">Ready to rent tonight</p>
                                </div>
                            </div>
                            <button
                                onClick={handleBrowseCatalog}
                                className="bg-[#c8a84b] rounded-xl px-4 py-3 text-[#0f1a0f] text-xs whitespace-nowrap hover:bg-[#dbbe60] transition-colors"
                                style={{ fontWeight: 700 }}
                            >
                                Reserve
                            </button>
                        </div>
                    </div>

                    {/* Floating card top-right */}
                    <div className="absolute -top-4 -right-4 bg-[#1a2e1a] border border-[#2a4a2a] rounded-xl px-4 py-3 shadow-xl">
                        <p className="text-[#c8a84b] text-xs mb-0.5" style={{ fontWeight: 600 }}>Table #7</p>
                        <p className="text-white text-xs">Available · 2h slot free</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { UserPlus, Search, ShoppingBag, Star } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: <UserPlus className="w-6 h-6" />,
        title: "Create Your Account",
        desc: "Register in minutes and join the BoardRoot community. Secure login with your personal dashboard to track rentals and bookings.",
        color: "#c8a84b",
    },
    {
        number: "02",
        icon: <Search className="w-6 h-6" />,
        title: "Explore the Catalog",
        desc: "Browse 400+ games with live availability. Filter by genre, player count, or duration to find your perfect match.",
        color: "#6abf6a",
    },
    {
        number: "03",
        icon: <ShoppingBag className="w-6 h-6" />,
        title: "Rent or Reserve",
        desc: "Choose Rent & Go for a home session, or Stay & Play to book a club table. Manage everything from your account.",
        color: "#c8a84b",
    },
    {
        number: "04",
        icon: <Star className="w-6 h-6" />,
        title: "Play & Review",
        desc: "Enjoy your game night! Afterwards, leave a review to help fellow members discover their next favourite game.",
        color: "#6abf6a",
    },
];

export function HowItWorks() {
    return (
        <section id="how" className="py-28 bg-[#0d160d]" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, #1a3a1a33 0%, transparent 70%)" }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-3">
                        Simple Process
                    </p>
                    <h2
                        className="text-white mb-4"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15 }}
                    >
                        How BoardRoot Works
                    </h2>
                    <p className="text-[#6a8a6a] max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
                        From signing up to rolling the first die — everything is designed to be
                        frictionless so you can focus on the fun.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#2a4a2a] to-transparent" />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={step.number} className="relative flex flex-col items-center text-center group">
                                {/* Number bubble */}
                                <div
                                    className="relative z-10 w-28 h-28 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300 group-hover:scale-105"
                                    style={{
                                        background: `linear-gradient(135deg, ${step.color}18 0%, ${step.color}08 100%)`,
                                        borderColor: `${step.color}30`,
                                        boxShadow: `0 0 30px ${step.color}15`,
                                    }}
                                >
                                    <div style={{ color: step.color }}>{step.icon}</div>
                                    <div
                                        className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-[10px]"
                                        style={{ background: step.color, color: "#0f1a0f", fontWeight: 800 }}
                                    >
                                        {i + 1}
                                    </div>
                                </div>

                                <h3 className="text-white mb-2" style={{ fontSize: "1rem", fontWeight: 700 }}>
                                    {step.title}
                                </h3>
                                <p className="text-[#6a8a6a] text-sm" style={{ lineHeight: 1.7 }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="mt-20 rounded-2xl border border-[#2a4a2a] overflow-hidden">
                    <div
                        className="p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                        style={{ background: "linear-gradient(135deg, #1a2e1a 0%, #12201a 100%)" }}
                    >
                        <div>
                            <h3 className="text-white mb-2" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                                Ready to play your first game?
                            </h3>
                            <p className="text-[#6a8a6a]">
                                Registration is free. No subscription required to browse.
                            </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <button className="px-6 py-3 rounded-xl border border-[#c8a84b]/40 text-[#c8a84b] hover:bg-[#c8a84b]/10 transition-all text-sm">
                                View Catalog
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm shadow-lg shadow-[#c8a84b]/20">
                                Join Free
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

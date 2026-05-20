import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Search, ShoppingBag, Star, ArrowRight, ArrowLeft } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useState } from "react";

const steps = [
    {
        number: "01",
        icon: <UserPlus className="w-8 h-8" />,
        title: "Create Your Account",
        desc: "Register in minutes and join the BoardRoot community. Secure login with your personal dashboard to track rentals and bookings.",
        details: [
            "Quick registration with email verification",
            "Secure password protection",
            "Personal dashboard to manage everything",
            "Track your rental history and favorites"
        ],
        color: "#c8a84b",
    },
    {
        number: "02",
        icon: <Search className="w-8 h-8" />,
        title: "Explore the Catalog",
        desc: "Browse 400+ games with live availability. Filter by genre, player count, or duration to find your perfect match.",
        details: [
            "400+ board games available",
            "Filter by genre, players, duration",
            "Real-time availability tracking",
            "Community ratings and reviews"
        ],
        color: "#6abf6a",
    },
    {
        number: "03",
        icon: <ShoppingBag className="w-8 h-8" />,
        title: "Rent or Reserve",
        desc: "Choose Rent & Go for a home session, or Stay & Play to book a club table. Manage everything from your account.",
        details: [
            "Rent games to take home",
            "Reserve club tables for groups",
            "Flexible time slots (10am - 8pm)",
            "Combine game rental with table booking"
        ],
        color: "#c8a84b",
    },
    {
        number: "04",
        icon: <Star className="w-8 h-8" />,
        title: "Play & Review",
        desc: "Enjoy your game night! Afterwards, leave a review to help fellow members discover their next favourite game.",
        details: [
            "Enjoy your board game experience",
            "Rate and review games you've played",
            "Help other members discover great games",
            "Build your gaming profile"
        ],
        color: "#6abf6a",
    },
];

export function HowItWorks() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white overflow-x-hidden">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a1a]/30 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[#6a8a6a] hover:text-[#c8a84b] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="text-center max-w-3xl mx-auto">
                        <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-4">
                            Simple Process
                        </p>
                        <h1
                            className="text-white mb-6"
                            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15 }}
                        >
                            How BoardRoot Works
                        </h1>
                        <p className="text-[#6a8a6a] text-lg" style={{ lineHeight: 1.7 }}>
                            From signing up to rolling the first die — everything is designed to be
                            frictionless so you can focus on the fun. Follow these simple steps to get started.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="space-y-16">
                        {steps.map((step, i) => (
                            <div
                                key={step.number}
                                className={`flex flex-col lg:flex-row gap-10 items-center ${
                                    i % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Step Visual */}
                                <div className="flex-1 flex justify-center">
                                    <div
                                        className="relative w-64 h-64 rounded-3xl flex items-center justify-center border transition-all duration-300 hover:scale-105"
                                        style={{
                                            background: `linear-gradient(135deg, ${step.color}18 0%, ${step.color}08 100%)`,
                                            borderColor: `${step.color}30`,
                                            boxShadow: `0 0 60px ${step.color}15`,
                                        }}
                                    >
                                        <div style={{ color: step.color }}>{step.icon}</div>
                                        <div
                                            className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-lg"
                                            style={{ background: step.color, color: "#0f1a0f", fontWeight: 800 }}
                                        >
                                            {i + 1}
                                        </div>
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div className="flex-1">
                                    <p
                                        className="text-xs uppercase tracking-widest mb-3"
                                        style={{ color: step.color }}
                                    >
                                        Step {step.number}
                                    </p>
                                    <h2 className="text-white text-2xl mb-4" style={{ fontWeight: 700 }}>
                                        {step.title}
                                    </h2>
                                    <p className="text-[#6a8a6a] mb-6" style={{ lineHeight: 1.7 }}>
                                        {step.desc}
                                    </p>
                                    <ul className="space-y-3">
                                        {step.details.map((detail, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center gap-3 text-[#8aab8a]"
                                            >
                                                <span
                                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ background: `${step.color}20` }}
                                                >
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ background: step.color }}
                                                    />
                                                </span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="rounded-2xl border border-[#2a4a2a] overflow-hidden">
                        <div
                            className="p-12 text-center"
                            style={{ background: "linear-gradient(135deg, #1a2e1a 0%, #12201a 100%)" }}
                        >
                            <h2 className="text-white text-3xl mb-4" style={{ fontWeight: 700 }}>
                                Ready to Start Playing?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleGetStarted}
                                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all shadow-xl shadow-[#c8a84b]/25 group"
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-8 py-4 rounded-xl border border-[#c8a84b]/40 text-[#c8a84b] hover:bg-[#c8a84b]/10 transition-all"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

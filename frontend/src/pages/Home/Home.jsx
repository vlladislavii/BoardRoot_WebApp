import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Hero } from "../../components/Hero";
import { Stats } from "../../components/Stats";
import { Features } from "../../components/Features";
import { HowItWorks } from "../../components/HowItWorks";
import { FeaturedGames } from "../../components/FeaturedGames";
import { Testimonials } from "../../components/Testimonials";
import { Footer } from "../../components/Footer";

export function Home() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white overflow-x-hidden">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <FeaturedGames />
            <Testimonials />
            <Footer />
        </div>
    );
}

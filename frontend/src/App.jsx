import { useState } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { FeaturedGames } from "./FeaturedGames";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import { Footer } from "./Footer";

export default function App() {
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

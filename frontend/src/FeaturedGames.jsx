import { useState } from "react";
import { Star, Clock, Users, Tag } from "lucide-react";

const GAME_IMG_1 =
    "https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBjaGVzcyUyMHBpZWNlcyUyMHN0cmF0ZWd5fGVufDF8fHx8MTc3MzI2Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=400";

const games = [
    {
        id: 1,
        title: "Catan",
        genre: "Strategy",
        players: "3–4",
        duration: "60–120 min",
        rating: 4.8,
        copies: 3,
        price: "€4/day",
        image: GAME_IMG_1,
        tag: "Popular",
        tagColor: "#c8a84b",
    },
    {
        id: 2,
        title: "Ticket to Ride",
        genre: "Family",
        players: "2–5",
        duration: "45–90 min",
        rating: 4.7,
        copies: 2,
        price: "€3/day",
        image: GAME_IMG_1,
        tag: "Family Pick",
        tagColor: "#6abf6a",
    },
    {
        id: 3,
        title: "Pandemic",
        genre: "Co-op",
        players: "2–4",
        duration: "45 min",
        rating: 4.9,
        copies: 4,
        price: "€3/day",
        image: GAME_IMG_1,
        tag: "Editor's Choice",
        tagColor: "#9b6abf",
    },
    {
        id: 4,
        title: "Azul",
        genre: "Abstract",
        players: "2–4",
        duration: "30–45 min",
        rating: 4.6,
        copies: 1,
        price: "€3/day",
        image: GAME_IMG_1,
        tag: "Last Copy",
        tagColor: "#bf6a6a",
    },
    {
        id: 5,
        title: "Wingspan",
        genre: "Engine Building",
        players: "1–5",
        duration: "40–70 min",
        rating: 4.9,
        copies: 2,
        price: "€5/day",
        image: GAME_IMG_1,
        tag: "Award Winner",
        tagColor: "#c8a84b",
    },
    {
        id: 6,
        title: "7 Wonders",
        genre: "Card Draft",
        players: "2–7",
        duration: "30 min",
        rating: 4.7,
        copies: 3,
        price: "€3/day",
        image: GAME_IMG_1,
        tag: "Quick Play",
        tagColor: "#6abf6a",
    },
];

const filters = ["All", "Strategy", "Family", "Co-op", "Abstract", "Card Draft", "Engine Building"];

export function FeaturedGames() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All"
            ? games
            : games.filter((g) => g.genre === activeFilter);

    return (
        <section id="catalog" className="py-28 bg-[#0f1a0f]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-3">
                            Game Library
                        </p>
                        <h2
                            className="text-white"
                            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15 }}
                        >
                            Featured Games
                        </h2>
                    </div>
                    <button className="text-[#c8a84b] text-sm hover:underline flex-shrink-0">
                        View all 400+ games →
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                                activeFilter === f
                                    ? "bg-[#c8a84b] text-[#0f1a0f]"
                                    : "bg-[#12201a] border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a]"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GameCard({ game }) {
    return (
        <div className="group bg-[#12201a] border border-[#1e3a1e] hover:border-[#c8a84b]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col">
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12201a] via-transparent to-transparent" />

                {/* Tag */}
                <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider"
                    style={{ background: `${game.tagColor}25`, color: game.tagColor, border: `1px solid ${game.tagColor}40`, fontWeight: 700 }}
                >
                    {game.tag}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0f1a0f]/80 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-[#c8a84b] fill-[#c8a84b]" />
                    <span className="text-white text-xs">{game.rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                        <h3 className="text-white" style={{ fontSize: "1rem", fontWeight: 700 }}>
                            {game.title}
                        </h3>
                        <span className="text-[#6a8a6a] text-xs">{game.genre}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <span className="text-[#c8a84b] text-sm" style={{ fontWeight: 700 }}>{game.price}</span>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[#6a8a6a] text-xs">
                        <Users className="w-3.5 h-3.5" />
                        {game.players}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#6a8a6a] text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {game.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <Tag className="w-3.5 h-3.5 text-[#c8a84b]" />
                        <span className={game.copies <= 1 ? "text-red-400" : "text-[#6abf6a]"}>
              {game.copies} {game.copies === 1 ? "copy left" : "copies"}
            </span>
                    </div>
                </div>

                <div className="mt-auto flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-[#c8a84b] text-[#0f1a0f] text-sm hover:bg-[#dbbe60] transition-colors">
                        Rent Now
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-[#2a4a2a] text-[#8aab8a] text-sm hover:border-[#4a7a4a] transition-colors">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}

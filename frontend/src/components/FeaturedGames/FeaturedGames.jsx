import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Users, Tag, Loader2 } from "lucide-react";
import { gamesApi } from "../../services/api";

const filters = ["All", "Strategy", "Family", "Co-op", "Abstract", "Card Draft", "Engine Building"];

// Tag colors based on game properties
const getTagInfo = (game) => {
    if (game.availableCopies === 0) return { tag: "Out of Stock", color: "#bf6a6a" };
    if (game.availableCopies === 1) return { tag: "Last Copy", color: "#bf6a6a" };
    if (game.rating >= 4.9) return { tag: "Top Rated", color: "#c8a84b" };
    if (game.complexity === "Easy") return { tag: "Beginner Friendly", color: "#6abf6a" };
    if (game.complexity === "Heavy") return { tag: "Complex", color: "#6a9bbf" };
    if (game.genre === "Party") return { tag: "Party Hit", color: "#bf9b6a" };
    if (game.genre === "Family") return { tag: "Family Pick", color: "#6abf6a" };
    return { tag: "Popular", color: "#c8a84b" };
};

export function FeaturedGames() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const data = await gamesApi.getAll();
                // Show only first 6 games for featured section
                setGames(data.slice(0, 6));
            } catch (err) {
                console.error("Failed to fetch games:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const filtered =
        activeFilter === "All"
            ? games
            : games.filter((g) => g.genre === activeFilter);

    const handleViewAll = () => {
        navigate("/login");
    };

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
                    <button
                        onClick={handleViewAll}
                        className="text-[#c8a84b] text-sm hover:underline flex-shrink-0"
                    >
                        View all games →
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
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((game) => (
                            <GameCard key={game.id} game={game} onAction={() => navigate("/login")} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function GameCard({ game, onAction }) {
    const { tag, color: tagColor } = getTagInfo(game);
    const players = `${game.minPlayers}–${game.maxPlayers}`;
    const price = `€${game.pricePerHour}/hr`;

    return (
        <div className="group bg-[#12201a] border border-[#1e3a1e] hover:border-[#c8a84b]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col">
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={game.imageUrl || "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=1200"}
                    alt={game.title}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=1200"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12201a] via-transparent to-transparent" />

                {/* Tag */}
                <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider"
                    style={{ background: `${tagColor}25`, color: tagColor, border: `1px solid ${tagColor}40`, fontWeight: 700 }}
                >
                    {tag}
                </div>

                {/* Rating */}
                {game.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0f1a0f]/80 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-[#c8a84b] fill-[#c8a84b]" />
                        <span className="text-white text-xs">{game.rating}</span>
                    </div>
                )}
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
                        <span className="text-[#c8a84b] text-sm" style={{ fontWeight: 700 }}>{price}</span>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[#6a8a6a] text-xs">
                        <Users className="w-3.5 h-3.5" />
                        {players}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#6a8a6a] text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {game.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <Tag className="w-3.5 h-3.5 text-[#c8a84b]" />
                        <span className={game.availableCopies <= 1 ? "text-red-400" : "text-[#6abf6a]"}>
                            {game.availableCopies} {game.availableCopies === 1 ? "copy left" : "copies"}
                        </span>
                    </div>
                </div>

                <div className="mt-auto flex gap-2">
                    <button
                        onClick={onAction}
                        className="flex-1 py-2 rounded-lg bg-[#c8a84b] text-[#0f1a0f] text-sm hover:bg-[#dbbe60] transition-colors"
                    >
                        Rent Now
                    </button>
                    <button
                        onClick={onAction}
                        className="px-3 py-2 rounded-lg border border-[#2a4a2a] text-[#8aab8a] text-sm hover:border-[#4a7a4a] transition-colors"
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}

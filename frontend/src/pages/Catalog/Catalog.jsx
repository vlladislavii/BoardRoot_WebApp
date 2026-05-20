import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Clock, Users, Tag, ChevronDown, X, Loader2 } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { gamesApi } from "../../services/api";

const genres = ["All", "Strategy", "Family", "Co-op", "Abstract", "Engine Building", "Card Draft", "Party"];

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

export function Catalog() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const data = await gamesApi.getAll();
                setGames(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch games:", err);
                setError("Failed to load games. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const filteredGames = games.filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedGenre("All");
    };

    const hasActiveFilters = searchQuery || selectedGenre !== "All";

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Hero Section */}
            <section className="pt-28 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-3">
                            Full Collection
                        </p>
                        <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>
                            Game Catalog
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games..."
                                className="w-full bg-[#12201a] border border-[#2a4a2a] rounded-xl py-4 pl-12 pr-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filter Toggle (Mobile) */}
                    <div className="flex justify-center mb-6 md:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12201a] border border-[#2a4a2a] text-[#8aab8a]"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className={`${showFilters ? "block" : "hidden"} md:block mb-8`}>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {/* Genre Filter */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {genres.map((genre) => (
                                    <button
                                        key={genre}
                                        onClick={() => setSelectedGenre(genre)}
                                        className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                                            selectedGenre === genre
                                                ? "bg-[#c8a84b] text-[#0f1a0f]"
                                                : "bg-[#12201a] border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a]"
                                        }`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-center mb-8">
                        <p className="text-[#6a8a6a] text-sm">
                            {loading ? "Loading..." : `Showing ${filteredGames.length} ${filteredGames.length === 1 ? "game" : "games"}`}
                        </p>
                    </div>
                </div>
            </section>

            {/* Games Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-400 text-lg mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredGames.map((game) => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </div>

                            {filteredGames.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-[#6a8a6a] text-lg mb-4">No games found</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

function GameCard({ game }) {
    const { tag, color: tagColor } = getTagInfo(game);
    const players = `${game.minPlayers}–${game.maxPlayers}`;

    return (
        <Link
            to={`/games/${game.id}`}
            className="group bg-[#12201a] border border-[#1e3a1e] hover:border-[#c8a84b]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col"
        >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={game.imageUrl || "https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?w=400"}
                    alt={game.title}
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
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <h3 className="text-white text-sm" style={{ fontWeight: 700 }}>
                            {game.title}
                        </h3>
                        <span className="text-[#6a8a6a] text-xs">{game.genre}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <span className="text-[#c8a84b] text-sm" style={{ fontWeight: 700 }}>€{game.pricePerHour}/hr</span>
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="flex items-center gap-1 text-[#6a8a6a] text-xs">
                        <Users className="w-3 h-3" />
                        {players}
                    </div>
                    <div className="flex items-center gap-1 text-[#6a8a6a] text-xs">
                        <Clock className="w-3 h-3" />
                        {game.duration}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs mt-auto">
                    <Tag className="w-3 h-3 text-[#c8a84b]" />
                    <span className={game.availableCopies <= 1 ? "text-red-400" : "text-[#6abf6a]"}>
                        {game.availableCopies} {game.availableCopies === 1 ? "copy" : "copies"} available
                    </span>
                </div>
            </div>
        </Link>
    );
}

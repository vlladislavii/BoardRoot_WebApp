import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dice6, Package, Calendar, Users, Plus, LogOut, LayoutDashboard, ClipboardList, Search, Edit, Trash2, X, Minus, Loader2 } from "lucide-react";
import { gamesApi } from "../../../services/api";

const genres = ["Strategy", "Family", "Co-op", "Abstract", "Engine Building", "Card Draft", "Party"];
const complexities = ["Easy", "Medium", "Heavy"];

export function AdminGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [newGame, setNewGame] = useState({
        title: "",
        genre: "Strategy",
        totalCopies: 1,
        pricePerHour: 2,
        description: "",
        imageUrl: "",
        minPlayers: 2,
        maxPlayers: 4,
        duration: "60 min",
        complexity: "Medium",
        designer: "",
        yearPublished: 2020,
        rulebookUrl: "",
    });

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const data = await gamesApi.getAll();
            setGames(data);
        } catch (err) {
            console.error("Failed to fetch games:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSaveGame = async () => {
        try {
            setSubmitting(true);
            if (editingGame) {
                await gamesApi.update(editingGame.id, newGame);
            } else {
                await gamesApi.create(newGame);
            }
            await fetchGames();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save game:", err);
            alert("Failed to save game. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (game) => {
        setEditingGame(game);
        setNewGame({
            title: game.title,
            genre: game.genre,
            totalCopies: game.totalCopies,
            pricePerHour: game.pricePerHour,
            description: game.description || "",
            imageUrl: game.imageUrl || "",
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            duration: game.duration,
            complexity: game.complexity,
            designer: game.designer || "",
            yearPublished: game.yearPublished,
            rulebookUrl: game.rulebookUrl || "",
        });
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingGame(null);
        setNewGame({
            title: "",
            genre: "Strategy",
            totalCopies: 1,
            pricePerHour: 2,
            description: "",
            imageUrl: "",
            minPlayers: 2,
            maxPlayers: 4,
            duration: "60 min",
            complexity: "Medium",
            designer: "",
            yearPublished: 2020,
            rulebookUrl: "",
        });
    };

    const handleUpdateCopies = async (gameId, totalCopies) => {
        try {
            await gamesApi.updateCopies(gameId, totalCopies);
            await fetchGames();
        } catch (err) {
            console.error("Failed to update copies:", err);
        }
    };

    const handleDeleteGame = async (gameId) => {
        if (window.confirm("Are you sure you want to delete this game?")) {
            try {
                await gamesApi.delete(gameId);
                await fetchGames();
            } catch (err) {
                console.error("Failed to delete game:", err);
                alert("Failed to delete game. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white flex">
            <aside className="w-64 bg-[#0a120a] border-r border-[#1e3a1e] flex flex-col">
                <div className="p-6 border-b border-[#1e3a1e]">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#c8a84b] flex items-center justify-center">
                            <Dice6 className="w-5 h-5 text-[#0f1a0f]" strokeWidth={2.5} />
                        </div>
                        <span className="text-white" style={{ fontWeight: 700 }}>
                            Board<span className="text-[#c8a84b]">Root</span>
                        </span>
                    </Link>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8aab8a] hover:bg-[#12201a] hover:text-white transition-colors">
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/games" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#c8a84b]/10 text-[#c8a84b] border border-[#c8a84b]/30">
                                <Package className="w-5 h-5" />
                                <span>Games</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8aab8a] hover:bg-[#12201a] hover:text-white transition-colors">
                                <ClipboardList className="w-5 h-5" />
                                <span>Bookings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-[#1e3a1e]">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6a8a6a] hover:bg-[#12201a] hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Exit Admin</span>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <header className="bg-[#12201a] border-b border-[#1e3a1e] px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Games Management</h1>
                            <p className="text-[#6a8a6a] text-sm">Add, edit, and manage game inventory</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                            style={{ fontWeight: 600 }}
                        >
                            <Plus className="w-4 h-4" />
                            Add New Game
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games..."
                                className="w-full bg-[#12201a] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                <tr className="text-left text-[#6a8a6a] text-sm border-b border-[#1e3a1e]">
                                    <th className="p-4">Game</th>
                                    <th className="p-4">Genre</th>
                                    <th className="p-4">Copies</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredGames.map((game) => (
                                    <tr key={game.id} className="border-b border-[#1e3a1e] last:border-0 hover:bg-[#0f1a0f]/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={game.imageUrl || "https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?w=100"}
                                                    alt={game.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <span className="text-white" style={{ fontWeight: 600 }}>{game.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                                <span className="px-3 py-1 rounded-full bg-[#2a4a2a] text-[#8aab8a] text-xs">
                                                    {game.genre}
                                                </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateCopies(game.id, Math.max(0, game.totalCopies - 1))}
                                                    className="w-8 h-8 rounded-lg bg-[#0f1a0f] border border-[#2a4a2a] flex items-center justify-center text-[#8aab8a] hover:border-[#c8a84b] hover:text-[#c8a84b] transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="min-w-[40px] text-center text-white" style={{ fontWeight: 600 }}>
                                                        {game.totalCopies}
                                                    </span>
                                                <button
                                                    onClick={() => handleUpdateCopies(game.id, game.totalCopies + 1)}
                                                    className="w-8 h-8 rounded-lg bg-[#0f1a0f] border border-[#2a4a2a] flex items-center justify-center text-[#8aab8a] hover:border-[#c8a84b] hover:text-[#c8a84b] transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[#c8a84b]" style={{ fontWeight: 600 }}>€{game.pricePerHour}/hr</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(game)}
                                                    className="w-8 h-8 rounded-lg bg-[#0f1a0f] border border-[#2a4a2a] flex items-center justify-center text-[#8aab8a] hover:border-[#c8a84b] hover:text-[#c8a84b] transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGame(game.id)}
                                                    className="w-8 h-8 rounded-lg bg-[#0f1a0f] border border-[#2a4a2a] flex items-center justify-center text-[#8aab8a] hover:border-red-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {filteredGames.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-[#6a8a6a]">No games found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>
                                {editingGame ? "Edit Game" : "Add New Game"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-[#6a8a6a] hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Game Title</label>
                                <input
                                    type="text"
                                    value={newGame.title}
                                    onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                                    placeholder="Enter game title"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Genre</label>
                                <select
                                    value={newGame.genre}
                                    onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                >
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Number of Copies</label>
                                    <input
                                        type="number"
                                        value={newGame.totalCopies}
                                        onChange={(e) => setNewGame({ ...newGame, totalCopies: parseInt(e.target.value) || 1 })}
                                        min="1"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Price per Hour (€)</label>
                                    <input
                                        type="number"
                                        value={newGame.pricePerHour}
                                        onChange={(e) => setNewGame({ ...newGame, pricePerHour: parseFloat(e.target.value) || 1 })}
                                        min="0.5"
                                        step="0.5"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Min Players</label>
                                    <input
                                        type="number"
                                        value={newGame.minPlayers}
                                        onChange={(e) => setNewGame({ ...newGame, minPlayers: parseInt(e.target.value) || 1 })}
                                        min="1"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Max Players</label>
                                    <input
                                        type="number"
                                        value={newGame.maxPlayers}
                                        onChange={(e) => setNewGame({ ...newGame, maxPlayers: parseInt(e.target.value) || 4 })}
                                        min="1"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={newGame.duration}
                                        onChange={(e) => setNewGame({ ...newGame, duration: e.target.value })}
                                        placeholder="e.g. 60-90 min"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Complexity</label>
                                    <select
                                        value={newGame.complexity}
                                        onChange={(e) => setNewGame({ ...newGame, complexity: e.target.value })}
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    >
                                        {complexities.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Designer</label>
                                    <input
                                        type="text"
                                        value={newGame.designer}
                                        onChange={(e) => setNewGame({ ...newGame, designer: e.target.value })}
                                        placeholder="e.g. Klaus Teuber"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Year Published</label>
                                    <input
                                        type="number"
                                        value={newGame.yearPublished}
                                        onChange={(e) => setNewGame({ ...newGame, yearPublished: parseInt(e.target.value) || 2020 })}
                                        min="1900"
                                        max="2100"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Description</label>
                                <textarea
                                    value={newGame.description}
                                    onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                                    placeholder="Enter game description"
                                    rows={3}
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Image URL (optional)</label>
                                <input
                                    type="url"
                                    value={newGame.imageUrl}
                                    onChange={(e) => setNewGame({ ...newGame, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Rulebook URL (optional)</label>
                                <input
                                    type="text"
                                    value={newGame.rulebookUrl}
                                    onChange={(e) => setNewGame({ ...newGame, rulebookUrl: e.target.value })}
                                    placeholder="/rulebooks/catan.pdf"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 py-3 rounded-xl border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a] transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGame}
                                disabled={!newGame.title || submitting}
                                className="flex-1 py-3 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontWeight: 600 }}
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingGame ? "Update Game" : "Add Game")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Users, Tag, ArrowLeft, Download, Calendar, MapPin, Loader2 } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { gamesApi, rentalsApi, tablesApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// Available time slots (10am - 8pm)
const TIME_SLOTS = [
    "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Shown when a game image URL is missing or fails to load
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=1200";

export function GameDetails() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rentalDate, setRentalDate] = useState("");
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("12:00");
    const [addTableReservation, setAddTableReservation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                setLoading(true);
                const data = await gamesApi.getById(id);
                setGame(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch game:", err);
                setError("Failed to load game details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    // Fetch ONLY the tables available for the selected date, time slot and group size.
    // Re-runs whenever the date or time window changes.
    useEffect(() => {
        const fetchTables = async () => {
            if (!addTableReservation || !rentalDate || !game || calculateHours() <= 0) {
                setTables([]);
                setSelectedTable(null);
                return;
            }
            try {
                const data = await tablesApi.getAvailable(
                    rentalDate,
                    startTime,
                    endTime,
                    game.maxPlayers
                );
                setTables(data);
                setSelectedTable(data.length > 0 ? data[0].id : null);
            } catch (err) {
                console.error("Failed to fetch available tables:", err);
                setTables([]);
                setSelectedTable(null);
            }
        };
        fetchTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addTableReservation, rentalDate, startTime, endTime, game]);

    // Calculate rental hours
    const calculateHours = () => {
        const startIndex = TIME_SLOTS.indexOf(startTime);
        const endIndex = TIME_SLOTS.indexOf(endTime);
        return endIndex > startIndex ? endIndex - startIndex : 0;
    };

    const rentalHours = calculateHours();
    const totalRentalPrice = game ? game.pricePerHour * rentalHours : 0;
    const selectedTableData = tables.find(t => t.id === selectedTable);
    const tablePrice = selectedTableData ? selectedTableData.hourlyRate : 5;
    const totalTablePrice = addTableReservation ? tablePrice * rentalHours : 0;
    const totalPrice = totalRentalPrice + totalTablePrice;

    // Get valid end times (must be after start time)
    const getValidEndTimes = () => {
        const startIndex = TIME_SLOTS.indexOf(startTime);
        return TIME_SLOTS.filter((_, index) => index > startIndex);
    };

    const handleRent = async () => {
        if (!isAuthenticated) {
            alert("Please login to rent a game");
            return;
        }
        if (!rentalDate) {
            alert("Please select a rental date");
            return;
        }
        if (rentalHours <= 0) {
            alert("Please select valid time slots");
            return;
        }
        if (addTableReservation && !selectedTable) {
            alert("No table is available for the selected date and time. Choose a different slot or uncheck the table reservation.");
            return;
        }

        try {
            setSubmitting(true);
            const wantsTable = addTableReservation && !!selectedTable;
            const rentalRequest = {
                gameId: game.id,
                rentalDate,
                startTime: startTime + ":00",
                endTime: endTime + ":00",
                addTableReservation: wantsTable,
            };

            if (wantsTable) {
                rentalRequest.tableId = selectedTable;
                rentalRequest.numberOfPlayers = game.maxPlayers;
            }

            await rentalsApi.create(rentalRequest);
            alert(`Rental confirmed! Game: ${game.title}, Date: ${rentalDate}, Time: ${startTime} - ${endTime}`);
            // Refresh the game so the remaining copy count updates and the form
            // locks ("Out of stock") once availableCopies reaches zero.
            try {
                const updated = await gamesApi.getById(game.id);
                setGame(updated);
            } catch (refreshErr) {
                console.error("Failed to refresh game after rental:", refreshErr);
            }
        } catch (err) {
            console.error("Failed to create rental:", err);
            alert(err.message || "Failed to create rental. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownloadRulebook = () => {
        if (!game?.rulebookUrl) {
            alert(`Rulebook for ${game.title} is not available yet.`);
            return;
        }
        // Same-origin PDFs (/rulebooks/*.pdf) trigger a real download via the
        // download attribute; the filename is set to the game title.
        const link = document.createElement("a");
        link.href = game.rulebookUrl;
        link.download = `${game.title} Rulebook.pdf`;
        link.target = "_blank";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1a0f] text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen bg-[#0f1a0f] text-white">
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <div className="flex flex-col items-center justify-center py-40">
                    <p className="text-red-400 text-lg mb-4">{error || "Game not found"}</p>
                    <Link
                        to="/catalog"
                        className="px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                    >
                        Back to Catalog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const players = `${game.minPlayers}–${game.maxPlayers}`;

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Back Button */}
            <section className="pt-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 text-[#8aab8a] hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Catalog
                    </Link>
                </div>
            </section>

            {/* Game Details */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left: Image & Info */}
                        <div>
                            <div className="relative rounded-2xl overflow-hidden mb-6">
                                <img
                                    src={game.imageUrl || FALLBACK_IMAGE}
                                    alt={game.title}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f]/60 via-transparent to-transparent" />

                                {/* Rating Badge */}
                                {game.rating && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#0f1a0f]/80 backdrop-blur-sm px-3 py-2 rounded-full">
                                        <Star className="w-4 h-4 text-[#c8a84b] fill-[#c8a84b]" />
                                        <span className="text-white">{game.rating}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-xl p-4 text-center">
                                    <Users className="w-5 h-5 text-[#c8a84b] mx-auto mb-2" />
                                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{players}</p>
                                    <p className="text-[#6a8a6a] text-xs">Players</p>
                                </div>
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-xl p-4 text-center">
                                    <Clock className="w-5 h-5 text-[#c8a84b] mx-auto mb-2" />
                                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{game.duration}</p>
                                    <p className="text-[#6a8a6a] text-xs">Duration</p>
                                </div>
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-xl p-4 text-center">
                                    <Tag className="w-5 h-5 text-[#c8a84b] mx-auto mb-2" />
                                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{game.availableCopies}</p>
                                    <p className="text-[#6a8a6a] text-xs">Available</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-white text-lg mb-3" style={{ fontWeight: 700 }}>About the Game</h2>
                                <p className="text-[#8aab8a] leading-relaxed">{game.description}</p>
                            </div>

                            {/* Game Details */}
                            <div className="bg-[#12201a] border border-[#2a4a2a] rounded-xl p-5 mb-6">
                                <h3 className="text-white text-sm mb-4" style={{ fontWeight: 700 }}>Game Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[#6a8a6a]">Genre</p>
                                        <p className="text-white">{game.genre}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#6a8a6a]">Complexity</p>
                                        <p className="text-white">{game.complexity}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#6a8a6a]">Designer</p>
                                        <p className="text-white">{game.designer}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#6a8a6a]">Year Published</p>
                                        <p className="text-white">{game.yearPublished}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Download Rulebook */}
                            {game.rulebookUrl && (
                                <button
                                    onClick={handleDownloadRulebook}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2a4a2a] text-[#8aab8a] hover:border-[#c8a84b] hover:text-[#c8a84b] transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Rulebook (PDF)
                                </button>
                            )}
                        </div>

                        {/* Right: Rental Form */}
                        <div>
                            <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6 sticky top-24">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-white text-2xl mb-1" style={{ fontWeight: 800 }}>{game.title}</h1>
                                        <p className="text-[#6a8a6a]">{game.genre}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#c8a84b] text-2xl" style={{ fontWeight: 800 }}>€{game.pricePerHour}</p>
                                        <p className="text-[#6a8a6a] text-sm">per hour</p>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${game.availableCopies > 0 ? "bg-[#2a5a2a]/30 border border-[#4a8a4a]" : "bg-red-900/30 border border-red-700"}`}>
                                    <div className={`w-2 h-2 rounded-full ${game.availableCopies > 0 ? "bg-[#6abf6a]" : "bg-red-500"}`} />
                                    <span className={game.availableCopies > 0 ? "text-[#6abf6a]" : "text-red-400"}>
                                        {game.availableCopies > 0 ? `${game.availableCopies} copies available` : "Out of stock"}
                                    </span>
                                </div>

                                {game.availableCopies > 0 && (
                                    <>
                                        {/* Rental Date */}
                                        <div className="mb-5">
                                            <label className="block text-[#8aab8a] text-sm mb-2">Rental Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                                                <input
                                                    type="date"
                                                    value={rentalDate}
                                                    onChange={(e) => setRentalDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="mb-5">
                                            <label className="block text-[#8aab8a] text-sm mb-2">Time Slot (10am - 8pm)</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-[#6a8a6a] text-xs mb-1">Start Time</p>
                                                    <select
                                                        value={startTime}
                                                        onChange={(e) => {
                                                            setStartTime(e.target.value);
                                                            const startIdx = TIME_SLOTS.indexOf(e.target.value);
                                                            const endIdx = TIME_SLOTS.indexOf(endTime);
                                                            if (endIdx <= startIdx) {
                                                                setEndTime(TIME_SLOTS[startIdx + 1] || TIME_SLOTS[TIME_SLOTS.length - 1]);
                                                            }
                                                        }}
                                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                                    >
                                                        {TIME_SLOTS.slice(0, -1).map((time) => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <p className="text-[#6a8a6a] text-xs mb-1">End Time</p>
                                                    <select
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                                    >
                                                        {getValidEndTimes().map((time) => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <p className="text-[#6a8a6a] text-xs mt-2 text-center">
                                                Duration: {rentalHours} hour{rentalHours !== 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        {/* Add Table Reservation */}
                                        <div className="mb-5 p-4 rounded-xl border border-[#2a4a2a] bg-[#0f1a0f]">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="tableReservation"
                                                    checked={addTableReservation}
                                                    onChange={(e) => setAddTableReservation(e.target.checked)}
                                                    className="mt-1 w-5 h-5 rounded border-[#2a4a2a] bg-[#0f1a0f] text-[#c8a84b] focus:ring-[#c8a84b]"
                                                />
                                                <label htmlFor="tableReservation" className="flex-1">
                                                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>
                                                        Add Table Reservation
                                                    </p>
                                                    <p className="text-[#6a8a6a] text-xs mt-1">
                                                        Play at the club instead of taking the game home (€{tablePrice}/hour for {rentalHours}h = €{totalTablePrice})
                                                    </p>
                                                </label>
                                            </div>
                                            {addTableReservation && tables.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-[#6a8a6a] text-xs mb-2">Select an available table</p>
                                                    <select
                                                        value={selectedTable || ""}
                                                        onChange={(e) => setSelectedTable(Number(e.target.value))}
                                                        className="w-full bg-[#12201a] border border-[#2a4a2a] rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#c8a84b] transition-colors"
                                                    >
                                                        {tables.map((table) => (
                                                            <option key={table.id} value={table.id}>
                                                                {table.name} - {table.capacity} seats - €{table.hourlyRate}/hr
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {addTableReservation && tables.length === 0 && (
                                                <p className="mt-3 text-red-400 text-xs">
                                                    No tables available for this date and time slot. Try a different slot.
                                                </p>
                                            )}
                                        </div>

                                        {/* Price Summary */}
                                        <div className="bg-[#0f1a0f] rounded-xl p-4 mb-5">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-[#6a8a6a]">Game rental ({rentalHours} hour{rentalHours !== 1 ? 's' : ''})</span>
                                                <span className="text-white">€{totalRentalPrice.toFixed(2)}</span>
                                            </div>
                                            {addTableReservation && (
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-[#6a8a6a]">Table reservation ({rentalHours}h)</span>
                                                    <span className="text-white">€{totalTablePrice.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-3 border-t border-[#2a4a2a]">
                                                <span className="text-white" style={{ fontWeight: 600 }}>Total</span>
                                                <span className="text-[#c8a84b] text-xl" style={{ fontWeight: 700 }}>€{totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Rent Button */}
                                        <button
                                            onClick={handleRent}
                                            disabled={submitting}
                                            className="w-full py-4 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm shadow-lg shadow-[#c8a84b]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ fontWeight: 700 }}
                                        >
                                            {submitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                            ) : (
                                                addTableReservation ? "Rent & Reserve Table" : "Rent Now"
                                            )}
                                        </button>

                                        <p className="text-center text-[#4a6a4a] text-xs mt-4">
                                            <MapPin className="w-3 h-3 inline mr-1" />
                                            Pickup at BoardRoot Club, Lisbon
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

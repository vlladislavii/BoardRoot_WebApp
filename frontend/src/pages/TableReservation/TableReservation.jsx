import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Users, MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { tablesApi, reservationsApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// Available time slots (10am - 8pm)
const TIME_SLOTS = [
    "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export function TableReservation() {
    const { isAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("12:00");
    const [selectedTable, setSelectedTable] = useState(null);
    const [playerCount, setPlayerCount] = useState(4);
    const [allTables, setAllTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tables from API
    useEffect(() => {
        const fetchTables = async () => {
            try {
                setLoading(true);
                const data = await tablesApi.getAll();
                setAllTables(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch tables:", err);
                setError("Failed to load tables. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    // Calculate duration
    const calculateDuration = () => {
        const startIdx = TIME_SLOTS.indexOf(startTime);
        const endIdx = TIME_SLOTS.indexOf(endTime);
        return endIdx > startIdx ? endIdx - startIdx : 0;
    };

    const duration = calculateDuration();

    // Get valid end times
    const validEndTimes = useMemo(() => {
        const startIdx = TIME_SLOTS.indexOf(startTime);
        return TIME_SLOTS.filter((_, idx) => idx > startIdx);
    }, [startTime]);

    // Filter tables by capacity
    const suitableTables = useMemo(() => {
        return allTables.filter(t => t.capacity >= playerCount);
    }, [playerCount, allTables]);

    // Get selected table details
    const selectedTableData = selectedTable ? allTables.find(t => t.id === selectedTable) : null;
    const totalPrice = selectedTableData ? selectedTableData.hourlyRate * duration : 0;

    // Reset end time if it becomes invalid
    useEffect(() => {
        const startIdx = TIME_SLOTS.indexOf(startTime);
        const endIdx = TIME_SLOTS.indexOf(endTime);
        if (endIdx <= startIdx) {
            setEndTime(TIME_SLOTS[startIdx + 1] || TIME_SLOTS[TIME_SLOTS.length - 1]);
        }
    }, [startTime]);

    const handleReserve = async () => {
        if (!isAuthenticated) {
            alert("Please login to reserve a table");
            return;
        }
        if (!selectedDate) {
            alert("Please select a date");
            return;
        }
        if (duration <= 0) {
            alert("Please select valid time slots");
            return;
        }
        if (!selectedTable) {
            alert("Please select a table");
            return;
        }

        try {
            setSubmitting(true);
            const reservationRequest = {
                tableId: selectedTable,
                date: selectedDate,
                startTime: startTime + ":00",
                durationHours: duration,
                numberOfPlayers: playerCount,
            };

            await reservationsApi.create(reservationRequest);
            alert(`Reservation confirmed! ${selectedTableData?.name}, ${selectedDate}, ${startTime} - ${endTime}`);
        } catch (err) {
            console.error("Failed to create reservation:", err);
            alert("Failed to create reservation. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = selectedDate && duration > 0 && selectedTable;

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Hero Section */}
            <section className="pt-28 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-3">
                        Stay & Play
                    </p>
                    <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>
                        Reserve a Table
                    </h1>
                </div>
            </section>

            {/* Reservation Form */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
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
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left: Form */}
                            <div className="space-y-6">
                                {/* Date Selection */}
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                    <h2 className="text-white text-lg mb-4" style={{ fontWeight: 700 }}>
                                        <Calendar className="w-5 h-5 inline mr-2 text-[#c8a84b]" />
                                        Select Date
                                    </h2>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>

                                {/* Time Selection */}
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                    <h2 className="text-white text-lg mb-4" style={{ fontWeight: 700 }}>
                                        <Clock className="w-5 h-5 inline mr-2 text-[#c8a84b]" />
                                        Select Time (10am - 8pm)
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[#6a8a6a] text-xs mb-2">Start Time</p>
                                            <select
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                            >
                                                {TIME_SLOTS.slice(0, -1).map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-[#6a8a6a] text-xs mb-2">End Time</p>
                                            <select
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                            >
                                                {validEndTimes.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-[#6a8a6a] text-xs mt-3 text-center">
                                        Duration: {duration} hour{duration !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                {/* Player Count */}
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                    <h2 className="text-white text-lg mb-4" style={{ fontWeight: 700 }}>
                                        <Users className="w-5 h-5 inline mr-2 text-[#c8a84b]" />
                                        Number of Players
                                    </h2>
                                    <div className="flex gap-2">
                                        {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                                            <button
                                                key={count}
                                                onClick={() => {
                                                    setPlayerCount(count);
                                                    setSelectedTable(null);
                                                }}
                                                className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                                                    playerCount === count
                                                        ? "bg-[#c8a84b] text-[#0f1a0f]"
                                                        : "bg-[#0f1a0f] border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a]"
                                                }`}
                                            >
                                                {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Info Box */}
                                <div className="bg-[#c8a84b]/10 border border-[#c8a84b]/30 rounded-xl p-4">
                                    <p className="text-[#c8a84b] text-sm" style={{ fontWeight: 600 }}>What's included:</p>
                                    <ul className="text-[#8aab8a] text-sm mt-2 space-y-1">
                                        <li>• Access to all in-club games</li>
                                        <li>• Game guides and explanations</li>
                                        <li>• Snacks and drinks available for purchase</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right: Table Selection & Summary */}
                            <div className="space-y-6">
                                {/* Table Selection */}
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                    <h2 className="text-white text-lg mb-4" style={{ fontWeight: 700 }}>
                                        Select Table
                                    </h2>
                                    <p className="text-[#6a8a6a] text-sm mb-4">
                                        Showing {suitableTables.length} table{suitableTables.length !== 1 ? 's' : ''} for {playerCount}+ players
                                    </p>
                                    {suitableTables.length === 0 ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="w-8 h-8 text-[#c8a84b] mx-auto mb-3" />
                                            <p className="text-[#6a8a6a] text-sm">
                                                No tables available for {playerCount} players.
                                            </p>
                                            <p className="text-[#4a6a4a] text-xs mt-1">
                                                Try reducing the player count.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-3">
                                            {suitableTables.map((table) => {
                                                const isSelected = selectedTable === table.id;

                                                return (
                                                    <button
                                                        key={table.id}
                                                        onClick={() => setSelectedTable(table.id)}
                                                        className={`relative p-4 rounded-xl text-center transition-all ${
                                                            isSelected
                                                                ? "bg-[#c8a84b] text-[#0f1a0f]"
                                                                : "bg-[#0f1a0f] border border-[#2a4a2a] text-[#8aab8a] hover:border-[#c8a84b]"
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <Check className="absolute top-2 right-2 w-4 h-4" />
                                                        )}
                                                        <p className="text-sm" style={{ fontWeight: 600 }}>{table.name}</p>
                                                        <p className={`text-xs ${isSelected ? "text-[#0f1a0f]/70" : "text-[#4a6a4a]"}`}>
                                                            {table.capacity} seats · €{table.hourlyRate}/hr
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Price Summary */}
                                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                    <h2 className="text-white text-lg mb-4" style={{ fontWeight: 700 }}>
                                        Reservation Summary
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6a8a6a]">Date</span>
                                            <span className="text-white">{selectedDate || "Not selected"}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6a8a6a]">Time</span>
                                            <span className="text-white">{startTime} - {endTime}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6a8a6a]">Duration</span>
                                            <span className="text-white">{duration} {duration === 1 ? "hour" : "hours"}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6a8a6a]">Table</span>
                                            <span className="text-white">
                                                {selectedTableData ? selectedTableData.name : "Not selected"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6a8a6a]">Players</span>
                                            <span className="text-white">{playerCount}</span>
                                        </div>
                                        {selectedTableData && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6a8a6a]">Rate</span>
                                                <span className="text-white">€{selectedTableData.hourlyRate}/hr × {duration}h</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-[#2a4a2a]">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-white" style={{ fontWeight: 600 }}>Total</span>
                                            <span className="text-[#c8a84b] text-2xl" style={{ fontWeight: 700 }}>€{totalPrice.toFixed(2)}</span>
                                        </div>

                                        <button
                                            onClick={handleReserve}
                                            disabled={!isFormValid || submitting}
                                            className={`w-full py-4 rounded-xl text-sm transition-all ${
                                                isFormValid && !submitting
                                                    ? "bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] shadow-lg shadow-[#c8a84b]/20"
                                                    : "bg-[#2a4a2a] text-[#4a6a4a] cursor-not-allowed"
                                            }`}
                                            style={{ fontWeight: 700 }}
                                        >
                                            {submitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                            ) : (
                                                "Confirm Reservation"
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-center text-[#4a6a4a] text-xs mt-4">
                                        <MapPin className="w-3 h-3 inline mr-1" />
                                        BoardRoot Club, Rua das Tábuas 42, Lisbon
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

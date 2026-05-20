import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dice6, Package, Calendar, Users, LogOut, LayoutDashboard, ClipboardList, Search, ChevronDown, Check, Loader2 } from "lucide-react";
import { adminApi, rentalsApi, reservationsApi } from "../../../services/api";

const statuses = ["All", "UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED", "OVERDUE"];
const types = ["All", "Rental", "Table"];

export function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [editingBookingId, setEditingBookingId] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllBookings();

            // Combine rentals and reservations
            const allBookings = [
                ...(data.rentals || []).map(r => ({
                    id: `rental-${r.id}`,
                    realId: r.id,
                    user: r.userName || "Unknown",
                    email: r.userEmail || "",
                    type: "Rental",
                    item: r.gameTitle,
                    date: r.rentalDate,
                    startTime: r.startTime,
                    endTime: r.endTime,
                    status: r.status,
                    price: r.totalPrice,
                })),
                ...(data.reservations || []).map(r => ({
                    id: `reservation-${r.id}`,
                    realId: r.id,
                    user: r.userName || "Unknown",
                    email: r.userEmail || "",
                    type: "Table",
                    item: r.tableName,
                    date: r.date,
                    startTime: r.startTime,
                    durationHours: r.durationHours,
                    status: r.status,
                    price: r.totalPrice,
                })),
            ];

            setBookings(allBookings);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              booking.item.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || booking.status === filterStatus;
        const matchesType = filterType === "All" || booking.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const handleStatusChange = async (booking, newStatus) => {
        try {
            if (booking.type === "Rental") {
                await rentalsApi.updateStatus(booking.realId, newStatus);
            } else {
                await reservationsApi.updateStatus(booking.realId, newStatus);
            }
            await fetchBookings();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status. Please try again.");
        }
        setEditingBookingId(null);
    };

    const statusColors = {
        "UPCOMING": "bg-[#6abf6a]/10 text-[#6abf6a] border-[#6abf6a]/30",
        "ACTIVE": "bg-[#c8a84b]/10 text-[#c8a84b] border-[#c8a84b]/30",
        "COMPLETED": "bg-[#6a8a6a]/10 text-[#6a8a6a] border-[#6a8a6a]/30",
        "CANCELLED": "bg-[#6a6a6a]/10 text-[#6a6a6a] border-[#6a6a6a]/30",
        "OVERDUE": "bg-red-500/10 text-red-400 border-red-500/30",
    };

    const statusCounts = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white flex">
            {/* Sidebar */}
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
                            <Link to="/admin/games" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8aab8a] hover:bg-[#12201a] hover:text-white transition-colors">
                                <Package className="w-5 h-5" />
                                <span>Games</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#c8a84b]/10 text-[#c8a84b] border border-[#c8a84b]/30">
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

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-[#12201a] border-b border-[#1e3a1e] px-8 py-6">
                    <div>
                        <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Bookings Management</h1>
                        <p className="text-[#6a8a6a] text-sm">View and manage all rentals and table reservations</p>
                    </div>
                </header>

                <div className="p-8">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by user or item..."
                                className="w-full bg-[#12201a] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                            />
                        </div>

                        <div className="flex gap-2">
                            {types.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                                        filterType === type
                                            ? "bg-[#c8a84b] text-[#0f1a0f]"
                                            : "bg-[#12201a] border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a]"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-[#12201a] border border-[#2a4a2a] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status === "All" ? "All Statuses" : status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        {["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED", "OVERDUE"].map((status) => {
                            const count = statusCounts[status] || 0;
                            return (
                                <div key={status} className="bg-[#12201a] border border-[#2a4a2a] rounded-xl p-4 text-center">
                                    <p className="text-white text-xl" style={{ fontWeight: 700 }}>{count}</p>
                                    <p className={`text-xs ${status === "OVERDUE" ? "text-red-400" : "text-[#6a8a6a]"}`}>{status}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bookings Table */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[#6a8a6a] text-sm border-b border-[#1e3a1e]">
                                            <th className="p-4">User</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Item</th>
                                            <th className="p-4">Date/Time</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="border-b border-[#1e3a1e] last:border-0 hover:bg-[#0f1a0f]/50">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="text-white text-sm" style={{ fontWeight: 600 }}>{booking.user}</p>
                                                        <p className="text-[#4a6a4a] text-xs">{booking.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${
                                                        booking.type === "Rental"
                                                            ? "bg-[#c8a84b]/10 text-[#c8a84b]"
                                                            : "bg-[#9b6abf]/10 text-[#9b6abf]"
                                                    }`}>
                                                        {booking.type}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-[#8aab8a] text-sm">{booking.item}</td>
                                                <td className="p-4 text-[#6a8a6a] text-sm">
                                                    {booking.date}
                                                    {booking.startTime && (
                                                        <span> · {booking.startTime.slice(0, 5)}</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[#c8a84b]" style={{ fontWeight: 600 }}>€{booking.price}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setEditingBookingId(editingBookingId === booking.id ? null : booking.id)}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all hover:opacity-80 ${statusColors[booking.status] || statusColors.ACTIVE}`}
                                                        >
                                                            {booking.status}
                                                            <ChevronDown className="w-3 h-3" />
                                                        </button>

                                                        {/* Status Dropdown */}
                                                        {editingBookingId === booking.id && (
                                                            <div className="absolute top-full left-0 mt-2 bg-[#12201a] border border-[#2a4a2a] rounded-xl shadow-xl z-10 overflow-hidden">
                                                                {["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED", "OVERDUE"].map((status) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => handleStatusChange(booking, status)}
                                                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#0f1a0f] flex items-center gap-2 ${
                                                                            booking.status === status ? "text-[#c8a84b]" : "text-[#8aab8a]"
                                                                        }`}
                                                                    >
                                                                        {booking.status === status && <Check className="w-3 h-3" />}
                                                                        <span className={booking.status === status ? "" : "ml-5"}>{status}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredBookings.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-[#6a8a6a]">No bookings found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

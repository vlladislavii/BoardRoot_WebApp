import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dice6, Package, Calendar, Users, Clock, LogOut, LayoutDashboard, ClipboardList, AlertTriangle, Loader2 } from "lucide-react";
import { adminApi, gamesApi } from "../../../services/api";

export function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [lowStockGames, setLowStockGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsData, bookingsData, lowStockData] = await Promise.all([
                    adminApi.getDashboardStats().catch(() => ({
                        totalGames: 0,
                        activeRentals: 0,
                        upcomingReservations: 0,
                        totalUsers: 0,
                        overdueRentals: 0,
                        lowStockGames: 0,
                    })),
                    adminApi.getAllBookings().catch(() => ({ rentals: [], reservations: [] })),
                    gamesApi.getLowStock().catch(() => []),
                ]);

                setStats(statsData);

                // Combine rentals and reservations for recent bookings
                const allBookings = [
                    ...(bookingsData.rentals || []).map(r => ({
                        id: `rental-${r.id}`,
                        user: r.userName || "Unknown User",
                        type: "Rental",
                        item: r.gameTitle,
                        status: r.status,
                    })),
                    ...(bookingsData.reservations || []).map(r => ({
                        id: `reservation-${r.id}`,
                        user: r.userName || "Unknown User",
                        type: "Table",
                        item: r.tableName,
                        status: r.status,
                    })),
                ].slice(0, 5);

                setRecentBookings(allBookings);
                setLowStockGames(lowStockData || []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statusColors = {
        "UPCOMING": "bg-[#6abf6a]/10 text-[#6abf6a]",
        "ACTIVE": "bg-[#c8a84b]/10 text-[#c8a84b]",
        "COMPLETED": "bg-[#6a8a6a]/10 text-[#6a8a6a]",
        "CANCELLED": "bg-[#6a6a6a]/10 text-[#6a6a6a]",
        "OVERDUE": "bg-red-500/10 text-red-400",
    };

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
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#c8a84b]/10 text-[#c8a84b] border border-[#c8a84b]/30">
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

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-[#12201a] border-b border-[#1e3a1e] px-8 py-6">
                    <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Dashboard</h1>
                    <p className="text-[#6a8a6a] text-sm">Welcome back! Here's what's happening at BoardRoot.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Games"
                                value={stats?.totalGames || 0}
                                icon={Package}
                                color="#c8a84b"
                            />
                            <StatCard
                                title="Active Rentals"
                                value={stats?.activeRentals || 0}
                                icon={Clock}
                                color="#6abf6a"
                            />
                            <StatCard
                                title="Upcoming Reservations"
                                value={stats?.upcomingReservations || 0}
                                icon={Calendar}
                                color="#9b6abf"
                            />
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers || 0}
                                icon={Users}
                                color="#6a9bbf"
                            />
                        </div>

                        {/* Alerts */}
                        {(stats?.overdueRentals > 0 || stats?.lowStockGames > 0) && (
                            <div className="mb-8 space-y-3">
                                {stats?.overdueRentals > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                        <span className="text-red-400">
                                            {stats.overdueRentals} overdue rental{stats.overdueRentals !== 1 ? 's' : ''} require attention
                                        </span>
                                    </div>
                                )}
                                {stats?.lowStockGames > 0 && (
                                    <div className="bg-[#c8a84b]/10 border border-[#c8a84b]/30 rounded-xl p-4 flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-[#c8a84b]" />
                                        <span className="text-[#c8a84b]">
                                            {stats.lowStockGames} game{stats.lowStockGames !== 1 ? 's' : ''} running low on stock
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Recent Bookings */}
                            <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-white text-lg" style={{ fontWeight: 700 }}>Recent Bookings</h2>
                                    <Link to="/admin/bookings" className="text-[#c8a84b] text-sm hover:underline">
                                        View all →
                                    </Link>
                                </div>

                                {recentBookings.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentBookings.map((booking) => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 bg-[#0f1a0f] rounded-xl">
                                                <div>
                                                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{booking.user}</p>
                                                    <p className="text-[#6a8a6a] text-xs">
                                                        {booking.type}: {booking.item}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[booking.status] || statusColors.ACTIVE}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[#6a8a6a] text-center py-8">No recent bookings</p>
                                )}
                            </div>

                            {/* Low Stock Games */}
                            <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-white text-lg" style={{ fontWeight: 700 }}>Low Stock Games</h2>
                                    <Link to="/admin/games" className="text-[#c8a84b] text-sm hover:underline">
                                        Manage →
                                    </Link>
                                </div>

                                {lowStockGames.length > 0 ? (
                                    <div className="space-y-3">
                                        {lowStockGames.map((game) => (
                                            <div key={game.id} className="flex items-center justify-between p-4 bg-[#0f1a0f] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={game.imageUrl || "https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?w=100"}
                                                        alt={game.title}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-white text-sm" style={{ fontWeight: 600 }}>{game.title}</p>
                                                        <p className="text-[#6a8a6a] text-xs">{game.genre}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm ${game.availableCopies <= 1 ? "text-red-400" : "text-[#c8a84b]"}`} style={{ fontWeight: 600 }}>
                                                    {game.availableCopies}/{game.totalCopies}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[#6a8a6a] text-center py-8">All games are well stocked</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
            </div>
            <p className="text-white text-3xl mb-1" style={{ fontWeight: 700 }}>{value}</p>
            <p className="text-[#6a8a6a] text-sm">{title}</p>
        </div>
    );
}

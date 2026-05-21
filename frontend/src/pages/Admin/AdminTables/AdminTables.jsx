import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dice6, Package, Users, Plus, LogOut, LayoutDashboard, ClipboardList, Search, Edit, Trash2, X, Loader2, Armchair } from "lucide-react";
import { tablesApi } from "../../../services/api";

const emptyTable = {
    name: "",
    description: "",
    capacity: 4,
    hourlyRate: 5,
    isAvailable: true,
};

export function AdminTables() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [form, setForm] = useState(emptyTable);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const data = await tablesApi.getAll();
            setTables(data);
        } catch (err) {
            console.error("Failed to fetch tables:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTables = tables.filter(table =>
        table.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSaveTable = async () => {
        try {
            setSubmitting(true);
            if (editingTable) {
                await tablesApi.update(editingTable.id, form);
            } else {
                await tablesApi.create(form);
            }
            await fetchTables();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save table:", err);
            alert(err.message || "Failed to save table. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (table) => {
        setEditingTable(table);
        setForm({
            name: table.name,
            description: table.description || "",
            capacity: table.capacity,
            hourlyRate: table.hourlyRate,
            isAvailable: table.isAvailable,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTable(null);
        setForm(emptyTable);
    };

    const handleDeleteTable = async (tableId) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            await tablesApi.delete(tableId);
            await fetchTables();
        } catch (err) {
            console.error("Failed to delete table:", err);
            alert(err.message || "Failed to delete table. Please try again.");
        }
    };

    const handleToggleAvailability = async (table) => {
        try {
            await tablesApi.update(table.id, { ...table, isAvailable: !table.isAvailable });
            await fetchTables();
        } catch (err) {
            console.error("Failed to update table:", err);
            alert(err.message || "Failed to update table. Please try again.");
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
                            <Link to="/admin/games" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8aab8a] hover:bg-[#12201a] hover:text-white transition-colors">
                                <Package className="w-5 h-5" />
                                <span>Games</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/tables" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#c8a84b]/10 text-[#c8a84b] border border-[#c8a84b]/30">
                                <Armchair className="w-5 h-5" />
                                <span>Tables</span>
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
                            <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Tables Management</h1>
                            <p className="text-[#6a8a6a] text-sm">Add, edit, and manage club tables</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                            style={{ fontWeight: 600 }}
                        >
                            <Plus className="w-4 h-4" />
                            Add New Table
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
                                placeholder="Search tables..."
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
                                    <th className="p-4">Table</th>
                                    <th className="p-4">Capacity</th>
                                    <th className="p-4">Rate</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTables.map((table) => (
                                    <tr key={table.id} className="border-b border-[#1e3a1e] last:border-0 hover:bg-[#0f1a0f]/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#2a4a2a] flex items-center justify-center">
                                                    <Armchair className="w-5 h-5 text-[#c8a84b]" />
                                                </div>
                                                <div>
                                                    <span className="text-white block" style={{ fontWeight: 600 }}>{table.name}</span>
                                                    {table.description && <span className="text-[#6a8a6a] text-xs">{table.description}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-[#8aab8a]">
                                                <Users className="w-4 h-4" /> {table.capacity}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[#c8a84b]" style={{ fontWeight: 600 }}>€{table.hourlyRate}/hr</span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleAvailability(table)}
                                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                                                    table.isAvailable
                                                        ? "text-[#6abf6a] bg-[#6abf6a]/10 border-[#6abf6a]/30 hover:bg-[#6abf6a]/20"
                                                        : "text-red-400 bg-red-400/10 border-red-400/30 hover:bg-red-400/20"
                                                }`}
                                                title="Click to toggle availability"
                                            >
                                                {table.isAvailable ? "Available" : "Unavailable"}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(table)}
                                                    className="w-8 h-8 rounded-lg bg-[#0f1a0f] border border-[#2a4a2a] flex items-center justify-center text-[#8aab8a] hover:border-[#c8a84b] hover:text-[#c8a84b] transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTable(table.id)}
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
                            {filteredTables.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-[#6a8a6a]">No tables found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>
                                {editingTable ? "Edit Table" : "Add New Table"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-[#6a8a6a] hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Table Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Table 13"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="e.g. Cozy corner table for small groups"
                                    rows={2}
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Capacity (seats)</label>
                                    <input
                                        type="number"
                                        value={form.capacity}
                                        onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
                                        min="1"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#8aab8a] text-sm mb-2">Hourly Rate (€)</label>
                                    <input
                                        type="number"
                                        value={form.hourlyRate}
                                        onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        step="0.5"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isAvailable}
                                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                                    className="w-5 h-5 rounded border-[#2a4a2a] bg-[#0f1a0f] text-[#c8a84b] focus:ring-[#c8a84b]"
                                />
                                <span className="text-[#8aab8a] text-sm">Available for reservations</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 py-3 rounded-xl border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a] transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTable}
                                disabled={!form.name || submitting}
                                className="flex-1 py-3 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontWeight: 600 }}
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingTable ? "Update Table" : "Add Table")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

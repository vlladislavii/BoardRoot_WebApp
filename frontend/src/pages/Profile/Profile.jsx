import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Camera, Upload, X, Calendar, Clock, MapPin, Package, Star, Loader2 } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { rentalsApi, reservationsApi } from "../../services/api";

export function Profile() {
    const { user: authUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("rentals");
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [rentals, setRentals] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize user data from auth context
    useEffect(() => {
        if (authUser) {
            const userData = {
                firstName: authUser.firstName || "User",
                lastName: authUser.lastName || "",
                email: authUser.email || "",
                phone: authUser.phone || "",
                memberSince: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
                avatar: null,
            };
            setUser(userData);
            setEditForm(userData);
        }
    }, [authUser]);

    // Fetch rentals and reservations
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [rentalsData, reservationsData] = await Promise.all([
                    rentalsApi.getMy().catch(() => []),
                    reservationsApi.getMy().catch(() => []),
                ]);
                setRentals(rentalsData || []);
                setReservations(reservationsData || []);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // TODO: handle photo uploads using photo API
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhoto = {
                    id: Date.now(),
                    url: reader.result,
                    caption: "New gaming session",
                };
                setPhotos([newPhoto, ...photos]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = (photoId) => {
        setPhotos(photos.filter(p => p.id !== photoId));
    };

    const handleSaveProfile = () => {
        setUser(editForm);
        setIsEditing(false);
    };

    const statusColors = {
        "COMPLETED": "text-[#6a8a6a] bg-[#6a8a6a]/10 border-[#6a8a6a]/30",
        "ACTIVE": "text-[#c8a84b] bg-[#c8a84b]/10 border-[#c8a84b]/30",
        "UPCOMING": "text-[#6abf6a] bg-[#6abf6a]/10 border-[#6abf6a]/30",
        "OVERDUE": "text-red-400 bg-red-400/10 border-red-400/30",
        "CANCELLED": "text-[#6a8a6a] bg-[#6a8a6a]/10 border-[#6a8a6a]/30",
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0f1a0f] text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#c8a84b] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1a0f] text-white">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <section className="pt-28 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-28 h-28 rounded-2xl bg-[#c8a84b] flex items-center justify-center overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#0f1a0f] text-3xl" style={{ fontWeight: 700 }}>
                                            {user.firstName?.[0] || "U"}{user.lastName?.[0] || ""}
                                        </span>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-[#2a4a2a] border border-[#4a6a4a] flex items-center justify-center cursor-pointer hover:bg-[#3a5a3a] transition-colors">
                                    <Camera className="w-4 h-4 text-[#8aab8a]" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex flex-col md:flex-row gap-4 text-sm text-[#6a8a6a]">
                                    <span className="flex items-center gap-2 justify-center md:justify-start">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </span>
                                    {user.phone && (
                                        <span className="flex items-center gap-2 justify-center md:justify-start">
                                            <Phone className="w-4 h-4" />
                                            {user.phone}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[#4a6a4a] text-xs mt-2">
                                    Member since {user.memberSince}
                                </p>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => {
                                    setEditForm(user);
                                    setIsEditing(!isEditing);
                                }}
                                className="px-5 py-2 rounded-lg border border-[#c8a84b]/40 text-[#c8a84b] hover:bg-[#c8a84b]/10 transition-all text-sm"
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>

                        {/* Edit Form */}
                        {isEditing && (
                            <div className="mt-8 pt-8 border-t border-[#2a4a2a]">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[#8aab8a] text-sm mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={editForm.firstName}
                                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                            className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#8aab8a] text-sm mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={editForm.lastName}
                                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                            className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#8aab8a] text-sm mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#8aab8a] text-sm mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8a84b] transition-colors"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    className="mt-4 px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                                    style={{ fontWeight: 600 }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {[
                            { id: "rentals", label: "My Rentals", icon: Package },
                            { id: "reservations", label: "Table Reservations", icon: Calendar },
                            { id: "photos", label: "My Photos", icon: Camera },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? "bg-[#c8a84b] text-[#0f1a0f]"
                                        : "bg-[#12201a] border border-[#2a4a2a] text-[#8aab8a] hover:border-[#4a7a4a]"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-6">
                        {/* Rentals Tab */}
                        {activeTab === "rentals" && (
                            <div>
                                <h2 className="text-white text-lg mb-6" style={{ fontWeight: 700 }}>My Rentals</h2>
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-[#c8a84b] animate-spin" />
                                    </div>
                                ) : rentals.length > 0 ? (
                                    <div className="space-y-4">
                                        {rentals.map((rental) => (
                                            <div key={rental.id} className="bg-[#0f1a0f] border border-[#1e3a1e] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-white" style={{ fontWeight: 600 }}>{rental.gameTitle}</h3>
                                                    <p className="text-[#6a8a6a] text-sm">
                                                        {rental.rentalDate} · {rental.startTime?.slice(0, 5)} - {rental.endTime?.slice(0, 5)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[rental.status] || statusColors.ACTIVE}`}>
                                                        {rental.status}
                                                    </span>
                                                    <span className="text-[#c8a84b]" style={{ fontWeight: 600 }}>€{rental.totalPrice}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Package className="w-12 h-12 text-[#2a4a2a] mx-auto mb-4" />
                                        <p className="text-[#6a8a6a] mb-4">No rentals yet</p>
                                        <Link
                                            to="/catalog"
                                            className="inline-block px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                                        >
                                            Browse Catalog
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reservations Tab */}
                        {activeTab === "reservations" && (
                            <div>
                                <h2 className="text-white text-lg mb-6" style={{ fontWeight: 700 }}>Table Reservations</h2>
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-[#c8a84b] animate-spin" />
                                    </div>
                                ) : reservations.length > 0 ? (
                                    <div className="space-y-4">
                                        {reservations.map((reservation) => (
                                            <div key={reservation.id} className="bg-[#0f1a0f] border border-[#1e3a1e] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-white" style={{ fontWeight: 600 }}>{reservation.tableName}</h3>
                                                    <div className="flex gap-4 text-[#6a8a6a] text-sm">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {reservation.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {reservation.startTime?.slice(0, 5)} ({reservation.durationHours}h)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[reservation.status] || statusColors.UPCOMING}`}>
                                                        {reservation.status}
                                                    </span>
                                                    <span className="text-[#c8a84b]" style={{ fontWeight: 600 }}>€{reservation.totalPrice}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="w-12 h-12 text-[#2a4a2a] mx-auto mb-4" />
                                        <p className="text-[#6a8a6a] mb-4">No reservations yet</p>
                                        <Link
                                            to="/reserve"
                                            className="inline-block px-6 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm"
                                        >
                                            Reserve a Table
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Photos Tab */}
                        {activeTab === "photos" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-white text-lg" style={{ fontWeight: 700 }}>My Gaming Photos</h2>
                                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm cursor-pointer">
                                        <Upload className="w-4 h-4" />
                                        Upload Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {photos.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {photos.map((photo) => (
                                            <div key={photo.id} className="relative group rounded-xl overflow-hidden">
                                                <img
                                                    src={photo.url}
                                                    alt={photo.caption}
                                                    className="w-full h-40 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                                        <p className="text-white text-xs">{photo.caption}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeletePhoto(photo.id)}
                                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-3 h-3 text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Camera className="w-12 h-12 text-[#2a4a2a] mx-auto mb-4" />
                                        <p className="text-[#6a8a6a] mb-4">No photos yet</p>
                                        <p className="text-[#4a6a4a] text-sm">Share your gaming moments with the community!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

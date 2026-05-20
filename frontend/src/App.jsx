import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

// Pages
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { HowItWorks } from "./pages/HowItWorks";
import { Catalog } from "./pages/Catalog";
import { GameDetails } from "./pages/GameDetails";
import { TableReservation } from "./pages/TableReservation";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminGames } from "./pages/Admin/AdminGames";
import { AdminBookings } from "./pages/Admin/AdminBookings";

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />

                    {/* Protected Routes - Require Authentication */}
                    <Route
                        path="/catalog"
                        element={
                            <ProtectedRoute>
                                <Catalog />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/games/:id"
                        element={
                            <ProtectedRoute>
                                <GameDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reserve"
                        element={
                            <ProtectedRoute>
                                <TableReservation />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes - Admin role required */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/games"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminGames />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/bookings"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminBookings />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#c8a84b] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin-only routes: clients are sent back to the home page
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

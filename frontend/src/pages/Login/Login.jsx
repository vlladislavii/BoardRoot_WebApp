import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dice6, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || "/catalog";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1a0f] flex items-center justify-center px-6 py-12">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#c8a84b]/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#2a5a2a]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#c8a84b] flex items-center justify-center shadow-lg">
                        <Dice6 className="w-6 h-6 text-[#0f1a0f]" strokeWidth={2.5} />
                    </div>
                    <span className="text-white text-xl" style={{ fontWeight: 700 }}>
                        Board<span className="text-[#c8a84b]">Root</span>
                    </span>
                </Link>

                {/* Login Card */}
                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                            Welcome Back
                        </h1>
                        <p className="text-[#6a8a6a] text-sm">
                            Sign in to continue your board game journey
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-[#8aab8a] text-sm mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[#8aab8a] text-sm mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-12 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6a4a] hover:text-[#8aab8a] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-[#c8a84b] text-[#0f1a0f] hover:bg-[#dbbe60] transition-all text-sm shadow-lg shadow-[#c8a84b]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ fontWeight: 600 }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-[#0f1a0f] border-t-transparent rounded-full animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-[#2a4a2a]" />
                        <span className="text-[#4a6a4a] text-xs">or</span>
                        <div className="flex-1 h-px bg-[#2a4a2a]" />
                    </div>

                    {/* Register Link */}
                    <p className="text-center text-[#6a8a6a] text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#c8a84b] hover:underline" style={{ fontWeight: 600 }}>
                            Join the Club
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

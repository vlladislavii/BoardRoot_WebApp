import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dice6, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await register(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password,
                formData.phone || null
            );
            // After successful registration, redirect to login
            navigate("/login", { state: { message: "Registration successful! Please sign in." } });
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
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

                {/* Register Card */}
                <div className="bg-[#12201a] border border-[#2a4a2a] rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                            Join the Club
                        </h1>
                        <p className="text-[#6a8a6a] text-sm">
                            Create your account and start playing
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="John"
                                        className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[#8aab8a] text-sm mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Doe"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 px-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

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

                        {/* Phone */}
                        <div>
                            <label className="block text-[#8aab8a] text-sm mb-2">Phone (optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+351 912 345 678"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[#8aab8a] text-sm mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a6a4a]" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f1a0f] border border-[#2a4a2a] rounded-xl py-3 pl-12 pr-12 text-white placeholder-[#4a6a4a] focus:outline-none focus:border-[#c8a84b] transition-colors"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6a4a] hover:text-[#8aab8a] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                disabled={loading}
                                className="mt-1 w-4 h-4 rounded border-[#2a4a2a] bg-[#0f1a0f] text-[#c8a84b] focus:ring-[#c8a84b] focus:ring-offset-0"
                            />
                            <label htmlFor="terms" className="text-[#6a8a6a] text-sm">
                                I agree to the{" "}
                                <Link to="/terms" className="text-[#c8a84b] hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-[#c8a84b] hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
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
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-[#2a4a2a]" />
                        <span className="text-[#4a6a4a] text-xs">or</span>
                        <div className="flex-1 h-px bg-[#2a4a2a]" />
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-[#6a8a6a] text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#c8a84b] hover:underline" style={{ fontWeight: 600 }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

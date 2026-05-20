import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:8081/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.data);
                        setToken(storedToken);
                    } else {
                        // Token invalid, clear it
                        localStorage.removeItem("token");
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        const { token: newToken, user: userData } = data.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const register = async (firstName, lastName, email, password, phone) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName, email, password, phone }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        return data.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

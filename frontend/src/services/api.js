const API_URL = "http://localhost:8081/api";

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch wrapper
async function fetchApi(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data.data;
}

// Games API
export const gamesApi = {
    getAll: () => fetchApi("/games"),
    getById: (id) => fetchApi(`/games/${id}`),
    getByGenre: (genre) => fetchApi(`/games/genre/${genre}`),
    search: (query) => fetchApi(`/games/search?query=${encodeURIComponent(query)}`),
    getAvailable: () => fetchApi("/games/available"),
    getLowStock: () => fetchApi("/games/low-stock"),
    create: (game) => fetchApi("/games", { method: "POST", body: JSON.stringify(game) }),
    update: (id, game) => fetchApi(`/games/${id}`, { method: "PUT", body: JSON.stringify(game) }),
    updateCopies: (id, totalCopies) => fetchApi(`/games/${id}/copies?totalCopies=${totalCopies}`, { method: "PATCH" }),
    delete: (id) => fetchApi(`/games/${id}`, { method: "DELETE" }),
};

// Tables API
export const tablesApi = {
    getAll: () => fetchApi("/reservations/tables"),
    getByCapacity: (capacity) => fetchApi(`/reservations/tables/capacity/${capacity}`),
    getAvailable: (date, startTime, endTime, numberOfPlayers) =>
        fetchApi(`/reservations/tables/available?date=${date}&startTime=${startTime}&endTime=${endTime}&numberOfPlayers=${numberOfPlayers}`),
    checkAvailability: (tableId, date, startTime, endTime) =>
        fetchApi(`/reservations/tables/${tableId}/check?date=${date}&startTime=${startTime}&endTime=${endTime}`),
};

// Reservations API
export const reservationsApi = {
    getAll: () => fetchApi("/reservations"),
    getById: (id) => fetchApi(`/reservations/${id}`),
    getMy: () => fetchApi("/reservations/my"),
    getByStatus: (status) => fetchApi(`/reservations/status/${status}`),
    create: (reservation) => fetchApi("/reservations", { method: "POST", body: JSON.stringify(reservation) }),
    updateStatus: (id, status) => fetchApi(`/reservations/${id}/status?status=${status}`, { method: "PATCH" }),
};

// Rentals API
export const rentalsApi = {
    getAll: () => fetchApi("/rentals"),
    getById: (id) => fetchApi(`/rentals/${id}`),
    getMy: () => fetchApi("/rentals/my"),
    getByUserId: (userId) => fetchApi(`/rentals/user/${userId}`),
    getByStatus: (status) => fetchApi(`/rentals/status/${status}`),
    create: (rental) => fetchApi("/rentals", { method: "POST", body: JSON.stringify(rental) }),
    updateStatus: (id, status) => fetchApi(`/rentals/${id}/status?status=${status}`, { method: "PATCH" }),
};

// Admin API
export const adminApi = {
    getDashboardStats: () => fetchApi("/admin/dashboard/stats"),
    getAllBookings: () => fetchApi("/admin/bookings"),
};

// Users API
export const usersApi = {
    getMe: () => fetchApi("/auth/me"),
    updateProfile: (data) => fetchApi("/auth/me", { method: "PUT", body: JSON.stringify(data) }),
};

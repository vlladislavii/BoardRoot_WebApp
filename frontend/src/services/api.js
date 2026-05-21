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
    // Admin
    create: (table) => fetchApi("/reservations/tables", { method: "POST", body: JSON.stringify(table) }),
    update: (id, table) => fetchApi(`/reservations/tables/${id}`, { method: "PUT", body: JSON.stringify(table) }),
    delete: (id) => fetchApi(`/reservations/tables/${id}`, { method: "DELETE" }),
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
    updateProfile: (data) => fetchApi("/users/profile", { method: "PUT", body: JSON.stringify(data) }),
    // Multipart upload: do NOT set Content-Type so the browser adds the boundary
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_URL}/users/avatar`, {
            method: "POST",
            headers: { ...getAuthHeaders() },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Avatar upload failed");
        }
        return data.data;
    },
};

// Photos API
export const photosApi = {
    getMy: () => fetchApi("/photos/my"),
    delete: (photoId) => fetchApi(`/photos/${photoId}`, { method: "DELETE" }),
    // Multipart upload: do NOT set Content-Type so the browser adds the boundary
    upload: async (file, caption) => {
        const formData = new FormData();
        formData.append("file", file);
        if (caption) formData.append("caption", caption);
        const response = await fetch(`${API_URL}/photos/upload`, {
            method: "POST",
            headers: { ...getAuthHeaders() },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Upload failed");
        }
        return data.data;
    },
};

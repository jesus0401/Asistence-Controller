// src/api/services.js
// Todos los servicios de la API organizados por módulo
import api from "./client";

// ─── AUTH ──────────────────────────────────────────────
export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  me: () =>
    api.get("/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
};

// ─── MIEMBROS ──────────────────────────────────────────
export const membersService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/members${params ? `?${params}` : ""}`);
  },

  getById: (id) =>
    api.get(`/members/${id}`),

  create: (data) =>
    api.post("/members", data),

  update: (id, data) =>
    api.put(`/members/${id}`, data),

  remove: (id) =>
    api.delete(`/members/${id}`),
};

// ─── PLANES ────────────────────────────────────────────
export const plansService = {
  getAll: () => api.get("/plans"),
  create: (data) => api.post("/plans", data),
  update: (id, data) => api.put(`/plans/${id}`, data),
};

// ─── ASISTENCIA ────────────────────────────────────────
export const attendanceService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/attendance${params ? `?${params}` : ""}`);
  },

  getToday: () =>
    api.get("/attendance/today"),

  getStats: () =>
    api.get("/attendance/stats"),

  register: (memberId, verifiedBy = "manual") =>
    api.post("/attendance", { memberId, verifiedBy }),
};

// ─── MÉTRICAS CORPORALES ───────────────────────────────
export const metricsService = {
  getByMember: (memberId) =>
    api.get(`/metrics/${memberId}`),

  create: (data) =>
    api.post("/metrics", data),
};

// ─── EJERCICIOS ────────────────────────────────────────
export const exercisesService = {
  getAll: (muscle) => {
    const params = muscle ? `?muscle=${muscle}` : "";
    return api.get(`/exercises${params}`);
  },

  create: (data) =>
    api.post("/exercises", data),

  remove: (id) =>
    api.delete(`/exercises/${id}`),
};

// ─── RUTINAS ───────────────────────────────────────────
export const routinesService = {
  getByMember: (memberId) =>
    api.get(`/routines/${memberId}`),

  saveDay: (memberId, day, exercises) =>
    api.post(`/routines/${memberId}/day/${day}`, { exercises }),

  // Para la página QR pública (sin auth)
  getPublic: (memberId) =>
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/routines/public/${memberId}`)
      .then(r => r.json()),
};

// ─── NUTRICIÓN ─────────────────────────────────────────
export const nutritionService = {
  getByMember: (memberId) =>
    api.get(`/nutrition/${memberId}`),

  saveMeal: (memberId, day, mealId, data) =>
    api.post(`/nutrition/${memberId}/day/${day}/meal/${mealId}`, data),

  // Para la página QR pública (sin auth)
  getPublic: (memberId) =>
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/nutrition/public/${memberId}`)
      .then(r => r.json()),
};

// ─── BOLETAS ───────────────────────────────────────────
export const receiptsService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/receipts${params ? `?${params}` : ""}`);
  },

  getStats: () =>
    api.get("/receipts/stats"),

  create: (data) =>
    api.post("/receipts", data),

  annul: (id) =>
    api.put(`/receipts/${id}/annul`, {}),
};

// ─── PERFILES DEL SISTEMA ──────────────────────────────
export const profilesService = {
  getAll: () => api.get("/profiles"),

  create: (data) =>
    api.post("/profiles", data),

  update: (id, data) =>
    api.put(`/profiles/${id}`, data),

  remove: (id) =>
    api.delete(`/profiles/${id}`),
};

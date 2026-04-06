// src/api/client.js
// Cliente base para todas las llamadas a la API
// Maneja: URL base, token JWT, errores globales

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Obtener token del localStorage
const getToken = () => localStorage.getItem("solgym_token");

// Función base fetch con auth automático
async function request(path, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${BASE_URL}${path}`, config);

  // Token expirado → limpiar sesión y recargar
  if (res.status === 401) {
    localStorage.removeItem("solgym_token");
    localStorage.removeItem("solgym_user");
    window.location.reload();
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data;
}

// Métodos HTTP
export const api = {
  get:    (path)         => request(path, { method: "GET" }),
  post:   (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: "DELETE" }),
};

export default api;

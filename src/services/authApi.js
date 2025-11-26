
import { API_BASE_URL } from "../config";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Ocurrió un error en la petición.";
    throw new Error(message);
  }

  return data;
}

export function registerUser(payload) {

  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginStepOne(payload) {

  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verify2FA(payload) {

  return request("/api/auth/verify-2fa", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkHealth() {
  const url = `${API_BASE_URL}/health`;

  return fetch(url)
    .then(async (res) => {
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Error ${res.status}`;
        throw new Error(msg);
      }

      // devolvemos el JSON que responda el backend
      return data;
    })
    .catch((err) => {
      throw new Error("Error al conectar con /health: " + err.message);
    });
}


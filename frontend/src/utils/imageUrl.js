import api from "../api/api";

const toBackendOrigin = (baseURL = "") => {
  if (typeof baseURL !== "string") return "";
  return baseURL.replace(/\/?api\/?$/, "").replace(/\/$/, "");
};

const backendOrigin = toBackendOrigin(api?.defaults?.baseURL);

export function resolveImageUrl(value, fallback = "") {
  if (!value || typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const lowered = trimmed.toLowerCase();
  if (lowered === "null" || lowered === "undefined") return fallback;

  const normalized = trimmed.replace(/\\/g, "/");

  // Vite/SPA-local asset paths (should NOT be prefixed with backend origin)
  // Dev examples: /src/assets/...
  // Build examples: /assets/...
  // Vite internal: /@vite/..., /@fs/...
  if (
    normalized.startsWith("/src/") ||
    normalized.startsWith("/assets/") ||
    normalized.startsWith("/@") ||
    normalized.startsWith("/node_modules/")
  ) {
    return normalized;
  }

  // Common relative forms that should remain frontend-local
  if (normalized.startsWith("./src/") || normalized.startsWith("../src/")) {
    return normalized.replace(/^\.+\//, "/");
  }
  if (normalized.startsWith("src/") || normalized.startsWith("assets/")) {
    return `/${normalized}`;
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  if (!backendOrigin) return normalized;

  if (normalized.startsWith("/")) {
    return `${backendOrigin}${normalized}`;
  }

  return `${backendOrigin}/${normalized}`;
}

const API_BASE = import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
  : "http://localhost:8000";
const STORAGE_BASE = `${API_BASE}/storage/`;

export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  const cleanPath = avatar.replace(/^\/?storage\//, "").replace(/^\/+/, "");
  return `${STORAGE_BASE}${cleanPath}`;
};

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

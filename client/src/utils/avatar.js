const STORAGE_BASE = "http://localhost:8000/storage/";

export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${STORAGE_BASE}${avatar}`;
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

import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLogoutMutation,
  useDeleteAccountMutation,
  useUpdateMutation,
  useUpdatePasswordMutation,
} from "../../features/auth/authApiSlice";
import {
  selectCurrentUser,
  setCredentials,
  selectCurrentToken,
} from "../../features/auth/authSlice";
import { apiSlice } from "../../app/api/apiSlice";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  Check,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Save,
  Trash2,
  User,
  X,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_BASE = "http://localhost:8000/storage/";

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${STORAGE_BASE}${avatar}`;
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// ── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-white/10 bg-[#111827] p-5 sm:p-6 ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="mb-5 flex items-center gap-2.5">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5b5bf5]/15 text-[#7169ff]">
      <Icon size={16} />
    </span>
    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
      {children}
    </h2>
  </div>
);

const FormField = ({
  icon: IconComponent,
  id,
  label,
  trailing,
  disabled = false,
  type = "text",
  ...props
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500"
    >
      {label}
    </label>
    <div
      className={`flex h-11 items-center gap-3 rounded-lg border px-4 transition focus-within:border-[#7169ff] focus-within:ring-2 focus-within:ring-[#7169ff]/20 ${
        disabled
          ? "border-white/5 bg-[#0a0d14] opacity-60"
          : "border-white/12 bg-[#0c1118]"
      }`}
    >
      <IconComponent size={16} className="shrink-0 text-gray-500" />
      <input
        id={id}
        type={type}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
        {...props}
      />
      {trailing}
    </div>
  </div>
);

const PasswordToggle = ({ visible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="shrink-0 text-gray-500 transition hover:text-gray-300"
    tabIndex={-1}
  >
    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

// ── Main Component ───────────────────────────────────────────────────────────

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);
  const fileInputRef = useRef(null);

  // --- API hooks ---
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMutation();
  const [updatePassword, { isLoading: isChangingPw }] =
    useUpdatePasswordMutation();
  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteAccountMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // --- Profile edit state ---
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // --- Password state ---
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // --- Delete state ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleStartEdit = () => {
    setProfileForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    });
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileForm.name !== currentUser?.name)
      formData.append("name", profileForm.name);
    if (profileForm.email !== currentUser?.email)
      formData.append("email", profileForm.email);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const response = await updateProfile(formData).unwrap();
      dispatch(
        setCredentials({
          user: response.data,
          accessToken: currentToken,
        })
      );
      toast.success(response.message || "Profile updated!");
      setIsEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to update profile."
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePassword(passwordForm).unwrap();
      toast.success(response.message || "Password changed!");
      setPasswordForm({
        password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to change password."
      );
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteAccount({ password: deletePassword }).unwrap();
      toast.success(response.message || "Account deleted.");
      dispatch(apiSlice.util.resetApiState());
      navigate("/");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to delete account."
      );
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(response?.message || "Logged out successfully!");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || err?.message || "Logout failed."
      );
    } finally {
      navigate("/");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const avatarUrl = avatarPreview || getAvatarUrl(currentUser?.avatar);

  return (
    <main className="min-h-screen bg-[#0b0e14] px-4 pb-16 pt-8 text-white sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="fixed left-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-[#141922]/90 text-gray-300 shadow-lg shadow-black/20 backdrop-blur transition hover:border-white/25 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto w-full max-w-2xl space-y-5 pt-14">
        {/* ── Header / Avatar ─────────────────────────────────── */}
        <SectionCard>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser?.name}
                  className="h-24 w-24 rounded-2xl border-2 border-[#5b5bf5]/40 object-cover shadow-lg shadow-[#5b5bf5]/20"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-2xl border-2 border-[#5b5bf5]/40 bg-gradient-to-tr from-[#5b5bf5] to-[#8b5cf6] text-3xl font-bold text-white shadow-lg shadow-[#5b5bf5]/20">
                  {getInitials(currentUser?.name)}
                </div>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-[#111827] bg-[#5b5bf5] text-white shadow transition hover:bg-[#4a4af0]"
                >
                  <Camera size={14} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                {currentUser?.name || "User"}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {currentUser?.email || "—"}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5b5bf5]/30 bg-[#5b5bf5]/10 px-3 py-1 text-xs font-semibold text-[#a5a0ff]">
                  <User size={12} />
                  Member
                </span>
                {currentUser?.team_id && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <Check size={12} />
                    Team joined
                  </span>
                )}
              </div>
            </div>

            {/* Edit / Logout buttons */}
            <div className="flex shrink-0 gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#5b5bf5]/40 bg-[#5b5bf5]/10 px-3.5 py-2 text-xs font-semibold text-blue-300 transition hover:bg-[#5b5bf5]/20 active:scale-95"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 active:scale-95"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-95 disabled:opacity-60"
              >
                <LogOut size={14} />
                {isLoggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── Profile Information ──────────────────────────────── */}
        <SectionCard>
          <SectionTitle icon={User}>Profile Information</SectionTitle>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <FormField
              icon={User}
              id="profile-name"
              label="Full Name"
              name="name"
              disabled={!isEditing}
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Your name"
            />
            <FormField
              icon={Mail}
              id="profile-email"
              label="Email Address"
              name="email"
              type="email"
              disabled={!isEditing}
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@example.com"
            />
            {isEditing && (
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#4a4af0] active:scale-95 disabled:opacity-60"
              >
                <Save size={14} />
                {isUpdating ? "Saving…" : "Save Changes"}
              </button>
            )}
          </form>
        </SectionCard>

        {/* ── Change Password ─────────────────────────────────── */}
        <SectionCard>
          <SectionTitle icon={Lock}>Change Password</SectionTitle>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <FormField
              icon={Lock}
              id="current-password"
              label="Current Password"
              name="password"
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.password}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="Enter current password"
              autoComplete="current-password"
              trailing={
                <PasswordToggle
                  visible={showPasswords.current}
                  onClick={() =>
                    setShowPasswords((s) => ({ ...s, current: !s.current }))
                  }
                />
              }
            />
            <FormField
              icon={Lock}
              id="new-password"
              label="New Password"
              name="new_password"
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm((f) => ({
                  ...f,
                  new_password: e.target.value,
                }))
              }
              placeholder="At least 8 characters"
              autoComplete="new-password"
              trailing={
                <PasswordToggle
                  visible={showPasswords.new}
                  onClick={() =>
                    setShowPasswords((s) => ({ ...s, new: !s.new }))
                  }
                />
              }
            />
            <FormField
              icon={Lock}
              id="confirm-password"
              label="Confirm New Password"
              name="new_password_confirmation"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.new_password_confirmation}
              onChange={(e) =>
                setPasswordForm((f) => ({
                  ...f,
                  new_password_confirmation: e.target.value,
                }))
              }
              placeholder="Re-enter new password"
              autoComplete="new-password"
              trailing={
                <PasswordToggle
                  visible={showPasswords.confirm}
                  onClick={() =>
                    setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))
                  }
                />
              }
            />
            <button
              type="submit"
              disabled={
                isChangingPw ||
                !passwordForm.password ||
                !passwordForm.new_password ||
                !passwordForm.new_password_confirmation
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#4a4af0] active:scale-95 disabled:opacity-60"
            >
              <Lock size={14} />
              {isChangingPw ? "Updating…" : "Update Password"}
            </button>
          </form>
        </SectionCard>

        {/* ── Danger Zone ─────────────────────────────────────── */}
        <SectionCard className="border-rose-500/20">
          <SectionTitle icon={AlertTriangle}>Danger Zone</SectionTitle>
          <p className="mb-4 text-xs text-gray-400">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 active:scale-95"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="mb-3 text-xs font-semibold text-rose-300">
                  Enter your password to confirm deletion:
                </p>
                <FormField
                  icon={Lock}
                  id="delete-password"
                  label="Password"
                  name="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isDeleting || !deletePassword}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-rose-700 active:scale-95 disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  {isDeleting ? "Deleting…" : "Confirm Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </SectionCard>
      </div>
    </main>
  );
};

export default UserProfile;

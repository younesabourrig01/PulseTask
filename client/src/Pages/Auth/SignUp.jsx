import React from "react";
import Icon from "../../assets/pulsetask-icon.svg";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  Lock,
  Mail,
  MonitorDot,
  Server,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    avatar: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      const maxSize = 2 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error("Avatar must be under 2 MB");
        return;
      }

      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        });

        setFormData((prev) => ({
          ...prev,
          [name]: compressedFile,
        }));
      } catch (error) {
        console.error("Image compression failed:", error);
        toast.error("Could not prepare that image. Please try another one.");
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await register(dataToSend).unwrap();
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.token,
        }),
      );

      toast.success(response.message || "Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("failed", err);
      toast.error(
        err?.data?.message ||
          err?.error ||
          err?.message ||
          "Registration failed. Please check your information and try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0d18] px-4 py-8 text-white">
      <Link
        to="/"
        aria-label="Back to home"
        className="fixed left-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-[#141922]/90 text-gray-300 shadow-lg shadow-black/20 backdrop-blur transition hover:border-white/25 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-5xl place-items-center">
        <section className="grid w-full overflow-hidden rounded-lg border border-indigo-400/10 bg-[#141922] shadow-2xl shadow-black/40 lg:grid-cols-[0.86fr_1.4fr]">
          <aside className="relative hidden overflow-hidden bg-[#171242] px-10 py-10 lg:flex lg:flex-col lg:justify-center">
            <div className="absolute left-16 top-20 h-1 w-1 rounded-full bg-indigo-300/60" />
            <div className="absolute right-14 top-36 h-1.5 w-1.5 rounded-full bg-violet-300/50" />
            <div className="absolute bottom-32 left-24 h-1 w-1 rounded-full bg-indigo-200/40" />
            <div className="relative">
              <div className="mb-8 flex items-center gap-4">
                <img src={Icon} alt="PulseTask" className="h-11 w-11" />
                <span className="text-2xl font-bold tracking-tight">
                  PulseTask
                </span>
              </div>
              <p className="mb-7 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-100/60">
                All your servers in one place
              </p>
              <div className="space-y-4 text-sm text-indigo-50/70">
                <AuthBenefit icon={ShieldCheck}>
                  Secure and encrypted server management
                </AuthBenefit>
                <AuthBenefit icon={MonitorDot}>
                  Real-time monitoring dashboard included
                </AuthBenefit>
                <AuthBenefit icon={Server}>
                  Manage unlimited servers effortlessly
                </AuthBenefit>
              </div>
            </div>
          </aside>

          <div className="px-6 py-7 sm:px-8 lg:px-10 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
                Create your <span className="text-[#7169ff]">account</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Start managing your servers in seconds
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <AuthField
                icon={User}
                id="name"
                label="Name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={255}
              />
              <AuthField
                icon={Mail}
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                maxLength={255}
              />
              <AuthField
                icon={Lock}
                id="password"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                trailing={
                  <VisibilityButton
                    onClick={() => setShowPassword((value) => !value)}
                    label="Toggle password visibility"
                  />
                }
              />

              <div className="h-px bg-white/10" />

              <AuthField
                icon={Lock}
                id="password_confirmation"
                label="Confirm password"
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                trailing={
                  <VisibilityButton
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    label="Toggle confirm password visibility"
                  />
                }
              />

              <div>
                <label
                  htmlFor="avatar"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500"
                >
                  Avatar
                </label>
                <label
                  htmlFor="avatar"
                  className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/12 bg-[#141922] px-4 py-4 text-center transition hover:border-[#7169ff]/70"
                >
                  <Upload size={24} className="mb-2 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {formData.avatar?.name || "Drag & drop or "}
                    {!formData.avatar && (
                      <span className="font-semibold text-[#817bff]">
                        browse
                      </span>
                    )}
                  </span>
                  <span className="mt-1 text-[11px] uppercase text-gray-600">
                    JPG or PNG, up to 2 MB
                  </span>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleChange}
                    className="sr-only"
                  />
                </label>
              </div>

              <SubmitButton loading={isLoading}>Sign up</SubmitButton>
              <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                <Link to="/signin" className="font-semibold text-[#817bff]">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

const AuthBenefit = ({ icon: IconComponent, children }) => (
  <div className="flex gap-4">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/20 text-indigo-200">
      <IconComponent size={18} />
    </span>
    <p>{children}</p>
  </div>
);

const AuthField = ({
  icon: IconComponent,
  id,
  label,
  trailing,
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
    <div className="flex h-11 items-center gap-3 rounded-lg border border-white/12 bg-[#0c1118] px-4 transition focus-within:border-[#7169ff] focus-within:ring-2 focus-within:ring-[#7169ff]/20">
      <IconComponent size={18} className="shrink-0 text-gray-500" />
      <input
        id={id}
        type={type}
        required
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        {...props}
      />
      {trailing}
    </div>
  </div>
);

const VisibilityButton = ({ onClick, label }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="shrink-0 text-gray-500 transition hover:text-gray-300"
  >
    <Eye size={18} />
  </button>
);

const SubmitButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="h-12 w-full rounded-lg bg-[#5c50f5] px-4 text-sm font-bold text-white shadow-lg shadow-[#5c50f5]/20 transition hover:bg-[#6d63ff] focus:outline-none focus:ring-2 focus:ring-[#7169ff] focus:ring-offset-2 focus:ring-offset-[#141922] disabled:cursor-not-allowed disabled:opacity-70"
  >
    {loading ? `${children.replace("Sign", "Signing")}...` : children}
  </button>
);

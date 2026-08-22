import React from "react";
import Icon from "../../assets/pulsetask-icon.svg";
import { useState } from "react";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";

const providers = ["Google", "GitHub", "Discord"];

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataTosend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        dataTosend.append(key, formData[key]);
      }
    });

    try {
      const response = await login(dataTosend).unwrap();
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.token,
        }),
      );

      toast.success(response.message || "Signed in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message ||
          err?.error ||
          err?.message ||
          "Something went wrong. Please try again.",
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
                Welcome <span className="text-[#7169ff]">back</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Sign in to continue managing your servers
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
              />
              <AuthField
                icon={Lock}
                id="password"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                trailing={
                  <VisibilityButton
                    onClick={() => setShowPassword((value) => !value)}
                    label="Toggle password visibility"
                  />
                }
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/12 bg-[#0c1118] accent-[#5c50f5]"
                  />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-[#817bff]">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-lg bg-[#5c50f5] px-4 text-sm font-bold text-white shadow-lg shadow-[#5c50f5]/20 transition hover:bg-[#6d63ff] focus:outline-none focus:ring-2 focus:ring-[#7169ff] focus:ring-offset-2 focus:ring-offset-[#141922] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <SocialProviders />
              <p className="text-center text-xs text-gray-500">
                Need an account?{" "}
                <Link to="/signup" className="font-semibold text-[#817bff]">
                  Sign up
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

const SocialProviders = () => (
  <>
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
      <span className="h-px flex-1 bg-white/10" />
      Or continue with
      <span className="h-px flex-1 bg-white/10" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/12 bg-[#0c1118] text-xs font-semibold text-gray-400 transition hover:border-white/25 hover:text-white"
        >
          {provider === "Google" && <FaGoogle size={15} />}
          {provider === "GitHub" && <FaGithub size={16} />}
          {provider === "Discord" && <FaDiscord size={16} />}
          <span className="hidden sm:inline">{provider}</span>
        </button>
      ))}
    </div>
  </>
);

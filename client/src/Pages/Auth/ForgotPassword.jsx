import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Icon from "../../assets/pulsetask-icon.svg";
import {
  useResetPasswordMutation,
  useSendOtpMutation,
} from "../../features/auth/authApiSlice";

export const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await sendOtp({ email: formData.email }).unwrap();
      toast.success(
        response?.message || "If this email exists, a code has been sent.",
      );
      setStep("reset");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "Could not send the verification code."));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await resetPassword(formData).unwrap();
      toast.success(response?.message || "Password changed successfully.");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "Could not reset your password."));
    }
  };

  const isResetStep = step === "reset";

  return (
    <main className="min-h-screen bg-[#0a0d18] px-4 py-8 text-white">
      <Link
        to="/signin"
        aria-label="Back to sign in"
        className="fixed left-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-[#141922]/90 text-gray-300 shadow-lg shadow-black/20 backdrop-blur transition hover:border-white/25 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-4xl place-items-center">
        <section className="grid w-full overflow-hidden rounded-lg border border-indigo-400/10 bg-[#141922] shadow-2xl shadow-black/40 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative hidden overflow-hidden bg-[#171242] px-10 py-10 lg:flex lg:flex-col lg:justify-center">
            <div className="relative">
              <div className="mb-8 flex items-center gap-4">
                <img src={Icon} alt="PulseTask" className="h-11 w-11" />
                <span className="text-2xl font-bold tracking-tight">
                  PulseTask
                </span>
              </div>
              <p className="mb-7 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-100/60">
                Account recovery
              </p>
              <div className="flex gap-4 text-sm text-indigo-50/70">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/20 text-indigo-200">
                  <ShieldCheck size={18} />
                </span>
                <p>
                  Verify your email with a short-lived code, then choose a new
                  password for your workspace.
                </p>
              </div>
            </div>
          </aside>

          <div className="px-6 py-7 sm:px-8 lg:px-10 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
                Reset your <span className="text-[#7169ff]">password</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {isResetStep
                  ? "Enter the code from your email and create a new password"
                  : "Enter your email and we will send a verification code"}
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={isResetStep ? handleResetPassword : handleSendOtp}
            >
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
                disabled={isResetStep}
              />

              {isResetStep && (
                <>
                  <AuthField
                    icon={KeyRound}
                    id="otp"
                    label="Verification code"
                    name="otp"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder="6-digit code"
                    value={formData.otp}
                    onChange={handleChange}
                    autoComplete="one-time-code"
                  />
                  <AuthField
                    icon={Lock}
                    id="new_password"
                    label="New password"
                    name="new_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={formData.new_password}
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
                  <AuthField
                    icon={Lock}
                    id="new_password_confirmation"
                    label="Confirm password"
                    name="new_password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.new_password_confirmation}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    trailing={
                      <VisibilityButton
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        label="Toggle confirm password visibility"
                      />
                    }
                  />
                </>
              )}

              <button
                type="submit"
                disabled={isSendingOtp || isResettingPassword}
                className="h-12 w-full rounded-lg bg-[#5c50f5] px-4 text-sm font-bold text-white shadow-lg shadow-[#5c50f5]/20 transition hover:bg-[#6d63ff] focus:outline-none focus:ring-2 focus:ring-[#7169ff] focus:ring-offset-2 focus:ring-offset-[#141922] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {getSubmitText(isResetStep, isSendingOtp, isResettingPassword)}
              </button>

              {isResetStep && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="w-full text-center text-xs font-semibold text-[#817bff] transition hover:text-[#a5a0ff] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSendingOtp ? "Sending code..." : "Send a new code"}
                </button>
              )}

              <p className="text-center text-xs text-gray-500">
                Remembered it?{" "}
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
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500 disabled:text-gray-500"
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

const getSubmitText = (isResetStep, isSendingOtp, isResettingPassword) => {
  if (isSendingOtp) return "Sending code...";
  if (isResettingPassword) return "Resetting password...";
  return isResetStep ? "Reset password" : "Send code";
};

const getErrorMessage = (err, fallback) =>
  err?.data?.message || err?.error || err?.message || fallback;

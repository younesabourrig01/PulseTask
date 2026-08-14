import React from "react";
import Logo from "../../assets/pulsetask-logo.svg";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import { toast } from "sonner";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    avatar: null,
  });

  const [register, { isLoading, error }] = useRegisterMutation();

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
    <main className="min-h-screen bg-[#0b0e14] px-4 pb-6 pt-20 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-104px)] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-lg border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/30">
          <div className="mb-5 flex flex-col items-center text-center">
            <img src={Logo} alt="PulseTask" className="mb-3 h-10 w-auto" />
            <h1 className="text-xl font-semibold">JOIN US</h1>
            <p className="mt-1 text-sm text-gray-400">
              ALL YOUR SERVERS IN ONE PLACE.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={255}
                autoComplete="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Confirm password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
              />
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="mb-1.5 block text-sm font-medium text-gray-200"
              >
                Avatar
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleChange}
                className="w-full cursor-pointer rounded-lg border border-dashed border-white/15 bg-[#0b0e14] px-4 py-2 text-sm text-gray-300 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[#5b5bf5] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:border-white/30 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
              />
              <p className="mt-1 text-xs text-gray-500">
                JPG or PNG, up to 2MB.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a4af0] focus:outline-none focus:ring-2 focus:ring-[#5b5bf5] focus:ring-offset-2 focus:ring-offset-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>

            {/* {error && (
              <p className="text-sm text-red-400">
                Registration failed. Please check your information and try
                again.
              </p>
            )} */}
          </form>
        </section>
      </div>
    </main>
  );
};

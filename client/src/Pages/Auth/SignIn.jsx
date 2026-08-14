import React from "react";
import Logo from "../../assets/pulsetask-logo.svg";
import { useState } from "react";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../features/auth/authSlice";
import { toast } from "sonner";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    <main className="min-h-screen bg-[#0b0e14] px-4 pb-6 pt-20 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-104px)] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-lg border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/30">
          <div className="mb-5 flex flex-col items-center text-center">
            <img src={Logo} alt="PulseTask" className="mb-3 h-10 w-auto" />
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-400">
              Sign in to continue managing your servers.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
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
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
                onChange={handleChange}
                value={formData.email}
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
                autoComplete="current-password"
                placeholder="Your password"
                className="w-full rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a4af0] focus:outline-none focus:ring-2 focus:ring-[#5b5bf5] focus:ring-offset-2 focus:ring-offset-[#111827]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "SignIn"}
            </button>

            {/* {error && (
              <p className="text-sm text-red-400">
                Signin in failed. Please check your information and try again.
              </p>
            )} */}
          </form>
        </section>
      </div>
    </main>
  );
};

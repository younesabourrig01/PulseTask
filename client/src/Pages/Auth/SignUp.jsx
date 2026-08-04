import React from "react";
import Logo from "../../assets/pulsetask-logo.svg";

export const SignUp = () => {
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

          <form className="space-y-3">
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
                className="w-full cursor-pointer rounded-lg border border-dashed border-white/15 bg-[#0b0e14] px-4 py-2 text-sm text-gray-300 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[#5b5bf5] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:border-white/30 focus:border-[#5b5bf5] focus:ring-2 focus:ring-[#5b5bf5]/30"
              />
              <p className="mt-1 text-xs text-gray-500">
                JPG or PNG, up to 2MB.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a4af0] focus:outline-none focus:ring-2 focus:ring-[#5b5bf5] focus:ring-offset-2 focus:ring-offset-[#111827]"
            >
              Sign up
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

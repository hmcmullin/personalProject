"use client";

import { useActionState, useState } from "react";
import { signupAction } from "@/auth";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const [state, action, isPending] = useActionState(signupAction, undefined);
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLocalError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      e.preventDefault();
      setLocalError("Passwords do not match");
    }
  };

  // 1. signUp successful, provide recovery code
  if (state?.recoveryCodeToShow) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-green-950 font-sans text-white px-4">
        <div className="mx-auto flex w-full max-w-[420px] flex-col space-y-6 p-6 bg-gray-900/90 border border-green-700/50 rounded-xl shadow-2xl text-center">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-green-800 p-3 md:h-14 shadow-md">
            <div className="text-white font-bold text-xl">
              Save Your Recovery Code
            </div>
          </div>

          <p className="text-sm text-gray-300 px-2 leading-relaxed">
            Your account has been created successfully! Please save the code
            below. If you ever lose your password, this is the{" "}
            <span className="text-green-400 font-bold">only way</span> to
            recover your account.
          </p>

          <div className="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div className="bg-black/40 text-green-400 font-mono text-2xl tracking-widest py-3 px-2 rounded border border-green-900/50 select-all">
              {state.recoveryCodeToShow}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              Double click to select, then copy (Ctrl+C / Cmd+C)
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md"
          >
            I have saved it, continue to App
          </button>
        </div>
      </main>
    );
  }

  // 2. signUp Form
  return (
    <main className="flex items-center justify-center min-h-screen bg-green-950 font-sans text-white">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-4 p-6 bg-gray-900/80 border border-gray-700 rounded-xl shadow-2xl">
        <div className="flex h-10 w-full items-center justify-center rounded-lg bg-green-800 p-3 md:h-14 shadow-md">
          <div className="text-white font-bold text-2xl">Create Account</div>
        </div>

        <form
          className="flex flex-col gap-4 pt-2"
          onSubmit={handleSubmit}
          action={action}
        >
          {(localError || state?.message) && (
            <p className="text-red-400 text-xs text-center">
              {localError || state?.message}
            </p>
          )}
          <input type="hidden" name="name" value="User" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
              required
            />
            {state?.errors?.email && (
              <p className="text-red-400 text-[10px] mt-0.5">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
              required
            />
            {state?.errors?.password && (
              <div className="text-red-400 text-[10px] space-y-0.5 mt-0.5">
                {state.errors.password.map((err) => (
                  <p key={err}>{err}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

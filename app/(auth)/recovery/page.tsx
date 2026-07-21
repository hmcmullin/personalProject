"use client";

import { useActionState, useState } from "react";
import { recoverPasswordAction } from "@/auth";

export default function RecoverPage() {
  const [state, action, isPending] = useActionState(
    recoverPasswordAction,
    undefined,
  );
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLocalError("");

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    if (newPassword !== confirmNewPassword) {
      e.preventDefault();
      setLocalError("Passwords do not match");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-green-950 font-sans text-white">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-4 p-6 bg-gray-900/80 border border-gray-700 rounded-xl shadow-2xl">
        <div className="flex h-10 w-full items-center justify-center rounded-lg bg-green-800 p-3 md:h-14 shadow-md">
          <div className="text-white font-bold text-2xl">Recover Account</div>
        </div>

        {state?.newRecoveryCodeToShow ? (
          <div className="flex flex-col space-y-4 text-center py-2">
            <p className="text-sm text-gray-300 px-2 leading-relaxed">
              Your password has been successfully reset! Please save your new
              code below. If you ever lose your password, this is the{" "}
              <span className="text-green-400 font-bold">only way</span> to
              recover your account.
            </p>

            <div className="bg-gray-850 border border-gray-700 p-4 rounded-lg">
              <div className="bg-black/40 text-green-400 font-mono text-2xl tracking-widest py-3 px-2 rounded border border-green-900/50 select-all">
                {state.newRecoveryCodeToShow}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Double click to select, then copy (Ctrl+C / Cmd+C)
              </p>
            </div>

            <a
              href="/login"
              className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-center shadow-md text-sm block"
            >
              Go to Login
            </a>
          </div>
        ) : (
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
                <p className="text-red-400 text-[11px]">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* in future could create function to auto format */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recovery Code
              </label>
              <input
                type="text"
                name="recoveryCode"
                placeholder="ABCD-1234-EF56"
                pattern="[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}"
                maxLength={14}
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                required
              />
              {state?.errors?.recoveryCode && (
                <p className="text-red-400 text-[11px]">
                  {state.errors.recoveryCode[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                required
              />
              {state?.errors?.newPassword && (
                <p className="text-red-400 text-[11px]">
                  {state.errors.newPassword[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
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
              {isPending ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Remember your password?{" "}
                <a href="/login" className="text-green-400 hover:underline">
                  Log In
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

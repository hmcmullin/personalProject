"use client";

import { useActionState } from "react";
import { loginAction } from "@/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <main className="flex items-center justify-center min-h-screen bg-green-950 font-sans text-white">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-4 p-6 bg-gray-900/80 border border-gray-700 rounded-xl shadow-2xl">
        <div className="flex h-10 w-full items-center justify-center rounded-lg bg-green-800 p-3 md:h-14 shadow-md">
          <div className="text-white font-bold text-2xl">Log In</div>
        </div>

        <form className="flex flex-col gap-4 pt-2" action={action}>
          {state?.message && (
            <p className="text-red-400 text-xs text-center">{state.message}</p>
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
          </div>

          {/* should improve ui here at some point */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              Don't have an account?{" "}
              <a href="/signUp" className="text-green-400 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Forgot your Password?{"  "}
              <a href="/recovery" className="text-green-400 hover:underline">
                Recovery
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            {isPending ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}

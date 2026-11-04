"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Mode = "password" | "magic-link";
type Status = "idle" | "working" | "sent" | "error";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setStatus("error");
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    router.replace("/admin");
  }

  async function handleMagicLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 lg:px-10">
      <div className="w-full">
        <h1 className="font-heading text-2xl font-bold text-forest">AgriXpert Staff Login</h1>
        <p className="mt-2 text-sm text-forest-dark/70">
          Access is restricted to approved AgriXpert staff accounts.
        </p>

        <div className="mt-6 flex gap-2 text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setStatus("idle");
              setErrorMessage(null);
            }}
            className={`rounded-full px-4 py-1.5 transition ${
              mode === "password" ? "bg-forest text-natural-white" : "bg-forest/5 text-forest-dark/60"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magic-link");
              setStatus("idle");
              setErrorMessage(null);
            }}
            className={`rounded-full px-4 py-1.5 transition ${
              mode === "magic-link" ? "bg-forest text-natural-white" : "bg-forest/5 text-forest-dark/60"
            }`}
          >
            Email link
          </button>
        </div>

        {mode === "password" && (
          <form
            onSubmit={handlePasswordSubmit}
            className="mt-4 space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
          >
            <div>
              <label className="text-sm font-medium text-forest-dark" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-forest-dark" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              />
            </div>
            {status === "error" && errorMessage && (
              <p className="text-sm font-medium text-red-600">{errorMessage}</p>
            )}
            <button
              type="submit"
              disabled={status === "working"}
              className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
            >
              {status === "working" ? "Signing in…" : "Sign In"}
            </button>
            <p className="text-xs text-forest-dark/50">
              No password set yet? Use the &quot;Email link&quot; tab once to sign in, then set a
              password from the dashboard.
            </p>
          </form>
        )}

        {mode === "magic-link" &&
          (status === "sent" ? (
            <div className="mt-4 rounded-2xl border border-agri-green/20 bg-agri-green/10 p-6 text-sm text-forest-dark">
              <h2 className="font-heading text-lg font-bold text-forest">Check your email</h2>
              <p className="mt-2">
                If that address is an approved staff account, a sign-in link has been sent. Open it on
                this device to access the dashboard.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleMagicLinkSubmit}
              className="mt-4 space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
            >
              <div>
                <label className="text-sm font-medium text-forest-dark" htmlFor="ml-email">
                  Email
                </label>
                <input
                  id="ml-email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              {status === "error" && errorMessage && (
                <p className="text-sm font-medium text-red-600">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === "working"}
                className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
              >
                {status === "working" ? "Sending…" : "Send Sign-In Link"}
              </button>
            </form>
          ))}
      </div>
    </section>
  );
}

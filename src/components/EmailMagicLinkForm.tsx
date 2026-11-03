"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "sending" | "sent" | "error";

export default function EmailMagicLinkForm({
  redirectPath,
  buttonLabel = "Send Sign-In Link",
}: {
  /** Path (e.g. "/portal") the user lands on after clicking the emailed link. */
  redirectPath: string;
  buttonLabel?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
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
          typeof window !== "undefined" ? `${window.location.origin}${redirectPath}` : undefined,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-agri-green/20 bg-agri-green/10 p-6 text-sm text-forest-dark">
        <h3 className="font-heading text-lg font-bold text-forest">Check your email</h3>
        <p className="mt-2">
          If that address matches a record we have on file, a sign-in link has been sent. Open it on
          this device to continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
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
        <p className="mt-1 text-xs text-forest-dark/50">
          Use the same email address you registered with.
        </p>
      </div>
      {status === "error" && errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
      >
        {status === "sending" ? "Sending…" : buttonLabel}
      </button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { enquiryTypes } from "@/lib/site-data";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const enquiryType = String(formData.get("enquiryType") ?? enquiryTypes[0]);
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill in your name, email and message.");
      return;
    }

    const { error } = await supabase.from("enquiries").insert({
      name,
      email,
      enquiry_type: enquiryType,
      message,
    });

    if (error) {
      setStatus("error");
      setErrorMessage("Something went wrong submitting your enquiry. Please try again or email us directly.");
      return;
    }

    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-agri-green/20 bg-agri-green/10 p-6 text-sm text-forest-dark">
        <h2 className="font-heading text-lg font-bold text-forest">Thank you</h2>
        <p className="mt-2">
          Your enquiry has been received. Our team will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="text-sm font-medium text-forest-dark" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
        />
      </div>
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
        <label className="text-sm font-medium text-forest-dark" htmlFor="enquiryType">
          Type of Enquiry
        </label>
        <select
          id="enquiryType"
          name="enquiryType"
          className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 text-sm"
          defaultValue={enquiryTypes[0]}
        >
          {enquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-forest-dark" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
        />
      </div>
      {status === "error" && errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
      >
        {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}

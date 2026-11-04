"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

const serviceCategories = [
  "Mechanisation & Farm Equipment",
  "Input Supply (seeds, fertiliser, agrochemicals)",
  "Logistics & Transportation",
  "Storage & Warehousing",
  "Processing Equipment & Technology",
  "Financial Services",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function SupplierRegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  function toggleService(name: string) {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const companyName = String(formData.get("companyName") ?? "").trim();
    const contactName = String(formData.get("contactName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!companyName || !contactName || !email) {
      setStatus("error");
      setErrorMessage("Please provide your company name, contact name and email.");
      return;
    }

    if (selectedServices.length === 0) {
      setStatus("error");
      setErrorMessage("Please select at least one service you provide.");
      return;
    }

    const { error } = await supabase.from("suppliers").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone: phone || null,
      services: selectedServices,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        "Something went wrong submitting your registration. Please try again or contact us directly."
      );
      return;
    }

    // Best-effort email notification — the registration is already saved
    // above, so a failure here must never block the success state.
    fetch("/api/notify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `New supplier/partner registration: ${companyName}`,
        replyTo: email,
        fields: [
          { label: "Company Name", value: companyName },
          { label: "Contact Name", value: contactName },
          { label: "Email", value: email },
          { label: "Phone", value: phone || "Not provided" },
          { label: "Services", value: selectedServices.join(", ") },
        ],
      }),
    }).catch(() => {});

    setStatus("success");
    form.reset();
    setSelectedServices([]);
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-agri-green/20 bg-agri-green/10 p-6 text-sm text-forest-dark">
        <h3 className="font-heading text-lg font-bold text-forest">Registration received</h3>
        <p className="mt-2">
          Thank you for registering as an AgriXpert supplier partner. Our team will review your details
          and reach out about next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="companyName">
            Company / Organisation Name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="contactName">
            Contact Person
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <label className="text-sm font-medium text-forest-dark" htmlFor="phone">
            Phone <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-forest-dark">Services You Provide</span>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {serviceCategories.map((service) => (
            <label
              key={service}
              className="flex items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-sm text-forest-dark/80"
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
                className="h-4 w-4 rounded border-forest/30 text-agri-green focus:ring-agri-green"
              />
              {service}
            </label>
          ))}
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Register as a Supplier"}
      </button>
    </form>
  );
}

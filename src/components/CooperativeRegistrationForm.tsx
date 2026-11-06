"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import RegistrationConsent from "./RegistrationConsent";

const commodityOptions = [
  "Maize",
  "Soybeans",
  "Rice",
  "Groundnuts",
  "Vegetables",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function CooperativeRegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);

  function toggleCommodity(name: string) {
    setSelectedCommodities((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const leadContactName = String(formData.get("leadContactName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const locationLabel = String(formData.get("locationLabel") ?? "").trim();
    const memberCountEstimateRaw = String(formData.get("memberCountEstimate") ?? "").trim();
    const memberCountEstimate = memberCountEstimateRaw ? Number(memberCountEstimateRaw) : null;

    if (!name || !leadContactName || !email) {
      setStatus("error");
      setErrorMessage("Please provide your cooperative's name, lead contact name and email.");
      return;
    }

    if (selectedCommodities.length === 0) {
      setStatus("error");
      setErrorMessage("Please select at least one commodity your cooperative works with.");
      return;
    }

    if (!consentGiven) {
      setStatus("error");
      setErrorMessage("Please agree to the Privacy Policy, Terms of Service and Cookie Policy to continue.");
      return;
    }

    const { error } = await supabase.from("cooperatives").insert({
      name,
      lead_contact_name: leadContactName,
      email,
      phone: phone || null,
      location_label: locationLabel || null,
      member_count_estimate: memberCountEstimate,
      primary_commodities: selectedCommodities,
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
        subject: `New cooperative registration: ${name}`,
        entityType: "cooperative",
        replyTo: email,
        submitterName: leadContactName || name,
        fields: [
          { label: "Cooperative Name", value: name },
          { label: "Lead Contact Name", value: leadContactName },
          { label: "Email", value: email },
          { label: "Phone", value: phone || "Not provided" },
          { label: "Location", value: locationLabel || "Not provided" },
          { label: "Estimated Members", value: memberCountEstimateRaw || "Not provided" },
          { label: "Primary Commodities", value: selectedCommodities.join(", ") },
        ],
      }),
    }).catch(() => {});

    setStatus("success");
    form.reset();
    setSelectedCommodities([]);
    setConsentGiven(false);
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-agri-green/20 bg-agri-green/10 p-6 text-sm text-forest-dark">
        <h3 className="font-heading text-lg font-bold text-forest">Registration received</h3>
        <p className="mt-2">
          Thank you for registering your cooperative with AgriXpert. Our team will review your details
          and reach out about next steps, including how to add your members.
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
          <label className="text-sm font-medium text-forest-dark" htmlFor="name">
            Cooperative / Group Name
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
          <label className="text-sm font-medium text-forest-dark" htmlFor="leadContactName">
            Lead Contact Person
          </label>
          <input
            id="leadContactName"
            name="leadContactName"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="locationLabel">
            Location <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="locationLabel"
            name="locationLabel"
            type="text"
            placeholder="e.g. Savelugu, Northern Region"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="memberCountEstimate">
            Estimated Number of Members <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="memberCountEstimate"
            name="memberCountEstimate"
            type="number"
            min="0"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-forest-dark">Primary Commodities</span>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {commodityOptions.map((commodity) => (
            <label
              key={commodity}
              className="flex items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-sm text-forest-dark/80"
            >
              <input
                type="checkbox"
                checked={selectedCommodities.includes(commodity)}
                onChange={() => toggleCommodity(commodity)}
                className="h-4 w-4 rounded border-forest/30 text-agri-green focus:ring-agri-green"
              />
              {commodity}
            </label>
          ))}
        </div>
      </div>

      <RegistrationConsent checked={consentGiven} onChange={setConsentGiven} />

      {status === "error" && errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Register Your Cooperative"}
      </button>
    </form>
  );
}

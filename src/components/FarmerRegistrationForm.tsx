"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { valueChains } from "@/lib/site-data";
import RegistrationConsent from "./RegistrationConsent";

type Status = "idle" | "submitting" | "success" | "error";

export default function FarmerRegistrationForm() {
  const searchParams = useSearchParams();
  const requestedCommodity = searchParams.get("commodity");
  const preselected = valueChains.find(
    (vc) => vc.name.toLowerCase() === requestedCommodity?.toLowerCase()
  )?.name;

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(
    preselected ? [preselected] : []
  );
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
    const fullName = String(formData.get("fullName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const farmSizeRaw = String(formData.get("farmSize") ?? "").trim();
    const cooperative = String(formData.get("cooperative") ?? "").trim();

    if (!fullName || !phone) {
      setStatus("error");
      setErrorMessage("Please provide at least your full name and phone number.");
      return;
    }

    if (!consentGiven) {
      setStatus("error");
      setErrorMessage("Please agree to the Privacy Policy, Terms of Service and Cookie Policy to continue.");
      return;
    }

    const farmSize = farmSizeRaw ? Number(farmSizeRaw) : null;
    if (farmSizeRaw && Number.isNaN(farmSize)) {
      setStatus("error");
      setErrorMessage("Farm size must be a number (in hectares).");
      return;
    }

    const { error } = await supabase.from("farmers").insert({
      full_name: fullName,
      phone,
      email: email || null,
      location: location || null,
      farm_size_hectares: farmSize,
      commodities: selectedCommodities,
      cooperative_or_group: cooperative || null,
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
        subject: `New farmer registration: ${fullName}`,
        entityType: "farmer",
        replyTo: email || undefined,
        submitterName: fullName,
        fields: [
          { label: "Full Name", value: fullName },
          { label: "Phone", value: phone },
          { label: "Email", value: email || "Not provided" },
          { label: "Location", value: location || "Not provided" },
          { label: "Farm Size (ha)", value: farmSizeRaw || "Not provided" },
          { label: "Commodities", value: selectedCommodities.join(", ") || "None selected" },
          { label: "Cooperative/Group", value: cooperative || "Not provided" },
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
          Thank you for registering with AgriXpert. Our team will review your details and reach out
          about next steps, including verification and onboarding.
        </p>
      </div>
    );
  }

  return (
    <form
      id="register"
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="email">
            Email <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="location">
            Farm Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Community / District / Region"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="farmSize">
            Farm Size (hectares) <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="farmSize"
            name="farmSize"
            type="number"
            min="0"
            step="0.1"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="cooperative">
            Cooperative / Farmer Group <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="cooperative"
            name="cooperative"
            type="text"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-forest-dark">Commodities You Grow</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {valueChains.map((vc) => (
            <label
              key={vc.slug}
              className="flex items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-sm text-forest-dark/80"
            >
              <input
                type="checkbox"
                checked={selectedCommodities.includes(vc.name)}
                onChange={() => toggleCommodity(vc.name)}
                className="h-4 w-4 rounded border-forest/30 text-agri-green focus:ring-agri-green"
              />
              {vc.name}
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
        {status === "submitting" ? "Submitting…" : "Register as a Farmer"}
      </button>
    </form>
  );
}

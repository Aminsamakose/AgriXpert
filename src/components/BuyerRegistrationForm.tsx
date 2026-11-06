"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { valueChains } from "@/lib/site-data";
import RegistrationConsent from "./RegistrationConsent";

type Status = "idle" | "submitting" | "success" | "error";

export default function BuyerRegistrationForm() {
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
    const companyName = String(formData.get("companyName") ?? "").trim();
    const contactName = String(formData.get("contactName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const quantityRequired = String(formData.get("quantityRequired") ?? "").trim();
    const qualityRequirements = String(formData.get("qualityRequirements") ?? "").trim();

    if (!companyName || !contactName || !email) {
      setStatus("error");
      setErrorMessage("Please provide your company name, contact name and email.");
      return;
    }

    if (selectedCommodities.length === 0) {
      setStatus("error");
      setErrorMessage("Please select at least one commodity you're sourcing.");
      return;
    }

    if (!consentGiven) {
      setStatus("error");
      setErrorMessage("Please agree to the Privacy Policy, Terms of Service and Cookie Policy to continue.");
      return;
    }

    const { error } = await supabase.from("buyers").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone: phone || null,
      commodities_needed: selectedCommodities,
      quantity_required: quantityRequired || null,
      quality_requirements: qualityRequirements || null,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        "Something went wrong submitting your sourcing request. Please try again or contact us directly."
      );
      return;
    }

    // Best-effort email notification — the request is already saved above,
    // so a failure here must never block the success state.
    fetch("/api/notify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `New buyer sourcing request: ${companyName}`,
        entityType: "buyer",
        replyTo: email,
        submitterName: contactName || companyName,
        fields: [
          { label: "Company Name", value: companyName },
          { label: "Contact Name", value: contactName },
          { label: "Email", value: email },
          { label: "Phone", value: phone || "Not provided" },
          { label: "Commodities Needed", value: selectedCommodities.join(", ") },
          { label: "Quantity Required", value: quantityRequired || "Not provided" },
          { label: "Quality Requirements", value: qualityRequirements || "Not provided" },
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
      <div className="rounded-2xl border border-harvest-gold/30 bg-harvest-gold/10 p-6 text-sm text-forest-dark">
        <h3 className="font-heading text-lg font-bold text-forest">Sourcing request received</h3>
        <p className="mt-2">
          Thank you. Our team will review your requirements and get in touch about available supply and
          next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      id="enquiry"
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
        <span className="text-sm font-medium text-forest-dark">Commodities You&apos;re Sourcing</span>
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
                className="h-4 w-4 rounded border-forest/30 text-harvest-gold focus:ring-harvest-gold"
              />
              {vc.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="quantityRequired">
            Quantity Required <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="quantityRequired"
            name="quantityRequired"
            type="text"
            placeholder="e.g. 50 tonnes per month"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark" htmlFor="qualityRequirements">
            Quality Requirements <span className="font-normal text-forest-dark/50">(optional)</span>
          </label>
          <input
            id="qualityRequirements"
            name="qualityRequirements"
            type="text"
            placeholder="e.g. Grade A, moisture content, certification"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
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
        {status === "submitting" ? "Submitting…" : "Submit Sourcing Request"}
      </button>
    </form>
  );
}

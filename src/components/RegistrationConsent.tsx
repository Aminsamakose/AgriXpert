"use client";

import { useState } from "react";
import PolicyModal from "./PolicyModal";

const policies = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function RegistrationConsent({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
}) {
  const [openPolicy, setOpenPolicy] = useState<{ label: string; href: string } | null>(null);

  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-forest-dark/80">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest/30 text-agri-green focus:ring-agri-green"
        />
        <span>
          I have read and agree to AgriXpert&apos;s{" "}
          {policies.map((p, i) => (
            <span key={p.href}>
              <button
                type="button"
                onClick={() => setOpenPolicy(p)}
                className="font-semibold text-forest underline hover:text-forest-dark"
              >
                {p.label}
              </button>
              {i < policies.length - 2 ? ", " : i === policies.length - 2 ? " and " : ""}
            </span>
          ))}
          .
        </span>
      </label>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

      {openPolicy && (
        <PolicyModal title={openPolicy.label} href={openPolicy.href} onClose={() => setOpenPolicy(null)} />
      )}
    </div>
  );
}

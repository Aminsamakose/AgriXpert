"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ContentManager from "@/components/admin/ContentManager";

type Tab = "enquiries" | "farmers" | "buyers" | "suppliers" | "content";

type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  enquiry_type: string;
  message: string;
  status: string;
};

type Farmer = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string | null;
  location: string | null;
  farm_size_hectares: number | null;
  commodities: string[];
  cooperative_or_group: string | null;
  status: string;
};

type Buyer = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  commodities_needed: string[];
  quantity_required: string | null;
  quality_requirements: string | null;
  status: string;
};

type Supplier = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  services: string[];
  status: string;
};

const leadStatuses = ["pending", "verified", "active", "inactive"];
const enquiryStatuses = ["new", "in_progress", "resolved", "archived"];

const tabs: { key: Tab; label: string }[] = [
  { key: "enquiries", label: "Enquiries" },
  { key: "farmers", label: "Farmers" },
  { key: "buyers", label: "Buyers" },
  { key: "suppliers", label: "Suppliers" },
  { key: "content", label: "Site Content" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "unauthenticated" | "unauthorized" | "authorized">(
    "checking"
  );
  const [activeTab, setActiveTab] = useState<Tab>("enquiries");
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setAuthState("unauthenticated");
      router.replace("/admin/login");
      return;
    }
    const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
    if (rpcError || !isAdmin) {
      setAuthState("unauthorized");
      return;
    }
    setAuthState("authorized");
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async auth bootstrap on mount
    checkAuth();
  }, [checkAuth]);

  const loadTab = useCallback(async (tab: Tab) => {
    if (tab === "content") return;
    setLoading(true);
    setError(null);

    if (tab === "enquiries") {
      const { data, error: qError } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setEnquiries(data as Enquiry[]);
    } else if (tab === "farmers") {
      const { data, error: qError } = await supabase
        .from("farmers")
        .select("*")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setFarmers(data as Farmer[]);
    } else if (tab === "buyers") {
      const { data, error: qError } = await supabase
        .from("buyers")
        .select("*")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setBuyers(data as Buyer[]);
    } else {
      const { data, error: qError } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setSuppliers(data as Supplier[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (authState === "authorized") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on tab/auth change
      loadTab(activeTab);
    }
  }, [authState, activeTab, loadTab]);

  async function updateStatus(table: Tab, id: string, status: string) {
    const { error: updateError } = await supabase.from(table).update({ status }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    loadTab(table);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (authState === "checking" || authState === "unauthenticated") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="text-forest-dark/70">Checking access…</p>
      </section>
    );
  }

  if (authState === "unauthorized") {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center lg:px-10">
        <h1 className="font-heading text-xl font-bold text-forest">Not authorized</h1>
        <p className="mt-3 text-sm text-forest-dark/70">
          You&apos;re signed in, but this account isn&apos;t on the AgriXpert staff list. Contact an
          administrator if you believe this is a mistake.
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
        >
          Sign Out
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-forest">AgriXpert Staff Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/5"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-forest/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "border-b-2 border-forest text-forest"
                : "text-forest-dark/60 hover:text-forest"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-forest-dark/60">Loading…</p>}

      {!loading && activeTab === "enquiries" && (
        <div className="mt-6 space-y-4">
          {enquiries.length === 0 && <p className="text-sm text-forest-dark/60">No enquiries yet.</p>}
          {enquiries.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-dark">
                    {row.name} <span className="font-normal text-forest-dark/50">({row.email})</span>
                  </p>
                  <p className="text-xs uppercase tracking-wide text-harvest-gold">{row.enquiry_type}</p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus("enquiries", row.id, e.target.value)}
                  className="rounded-lg border border-forest/20 px-3 py-1.5 text-sm"
                >
                  {enquiryStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-3 text-sm text-forest-dark/80">{row.message}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "farmers" && (
        <div className="mt-6 space-y-4">
          {farmers.length === 0 && <p className="text-sm text-forest-dark/60">No farmer registrations yet.</p>}
          {farmers.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-dark">{row.full_name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.phone}
                    {row.email ? ` · ${row.email}` : ""}
                    {row.location ? ` · ${row.location}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus("farmers", row.id, e.target.value)}
                  className="rounded-lg border border-forest/20 px-3 py-1.5 text-sm"
                >
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {row.commodities.length > 0 ? (
                  row.commodities.map((c) => (
                    <span key={c} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-forest-dark/40">No commodities listed</span>
                )}
                {row.cooperative_or_group && (
                  <span className="rounded-full bg-forest/5 px-3 py-1 text-forest-dark/70">
                    {row.cooperative_or_group}
                  </span>
                )}
                {row.farm_size_hectares != null && (
                  <span className="rounded-full bg-forest/5 px-3 py-1 text-forest-dark/70">
                    {row.farm_size_hectares} ha
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "buyers" && (
        <div className="mt-6 space-y-4">
          {buyers.length === 0 && <p className="text-sm text-forest-dark/60">No buyer requests yet.</p>}
          {buyers.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-dark">{row.company_name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.contact_name} · {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus("buyers", row.id, e.target.value)}
                  className="rounded-lg border border-forest/20 px-3 py-1.5 text-sm"
                >
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {row.commodities_needed.map((c) => (
                  <span key={c} className="rounded-full bg-harvest-gold/10 px-3 py-1 text-harvest-gold">
                    {c}
                  </span>
                ))}
              </div>
              {(row.quantity_required || row.quality_requirements) && (
                <p className="mt-3 text-sm text-forest-dark/70">
                  {row.quantity_required && <span>Qty: {row.quantity_required}. </span>}
                  {row.quality_requirements && <span>Quality: {row.quality_requirements}</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "suppliers" && (
        <div className="mt-6 space-y-4">
          {suppliers.length === 0 && <p className="text-sm text-forest-dark/60">No supplier registrations yet.</p>}
          {suppliers.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-dark">{row.company_name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.contact_name} · {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus("suppliers", row.id, e.target.value)}
                  className="rounded-lg border border-forest/20 px-3 py-1.5 text-sm"
                >
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {row.services.map((s) => (
                  <span key={s} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "content" && <ContentManager />}
    </section>
  );
}

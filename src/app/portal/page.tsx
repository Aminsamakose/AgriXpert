"use client";

import { useCallback, useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import EmailMagicLinkForm from "@/components/EmailMagicLinkForm";
import { supabase } from "@/lib/supabase";
import { stockImages } from "@/lib/site-data";

type FarmerRecord = {
  id: string;
  created_at: string;
  full_name: string;
  commodities: string[];
  status: string;
};

type BuyerRecord = {
  id: string;
  created_at: string;
  company_name: string;
  commodities_needed: string[];
  status: string;
};

type SupplierRecord = {
  id: string;
  created_at: string;
  company_name: string;
  services: string[];
  status: string;
};

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-harvest-gold/15 text-harvest-gold",
    verified: "bg-agri-green/15 text-agri-green",
    active: "bg-agri-green/15 text-agri-green",
    inactive: "bg-forest-dark/10 text-forest-dark/60",
  };
  return colors[status] ?? "bg-forest-dark/10 text-forest-dark/60";
}

export default function PortalPage() {
  const [authState, setAuthState] = useState<"checking" | "signedOut" | "signedIn">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [farmerRecords, setFarmerRecords] = useState<FarmerRecord[]>([]);
  const [buyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([]);
  const [supplierRecords, setSupplierRecords] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setEmail(data.session.user.email ?? null);
      setAuthState("signedIn");
    } else {
      setAuthState("signedOut");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async auth bootstrap on mount
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });
    return () => listener.subscription.unsubscribe();
  }, [checkSession]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const [farmers, buyers, suppliers] = await Promise.all([
      supabase.from("farmers").select("id, created_at, full_name, commodities, status"),
      supabase.from("buyers").select("id, created_at, company_name, commodities_needed, status"),
      supabase.from("suppliers").select("id, created_at, company_name, services, status"),
    ]);
    setFarmerRecords((farmers.data as FarmerRecord[]) ?? []);
    setBuyerRecords((buyers.data as BuyerRecord[]) ?? []);
    setSupplierRecords((suppliers.data as SupplierRecord[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authState === "signedIn") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch once signed in
      loadRecords();
    }
  }, [authState, loadRecords]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthState("signedOut");
    setFarmerRecords([]);
    setBuyerRecords([]);
    setSupplierRecords([]);
  }

  const hasAnyRecord = farmerRecords.length + buyerRecords.length + supplierRecords.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Portal"
        title="Farmer / Buyer Portal"
        description="Sign in to track your registration and the status of your submissions with AgriXpert."
        image={stockImages.dataScreen}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <p className="text-forest-dark/70">
          Not registered yet? See{" "}
          <a href="/for-farmers" className="font-semibold text-forest hover:text-forest-dark">
            For Farmers
          </a>
          ,{" "}
          <a href="/for-buyers" className="font-semibold text-forest hover:text-forest-dark">
            For Buyers
          </a>{" "}
          or{" "}
          <a href="/partnerships" className="font-semibold text-forest hover:text-forest-dark">
            Partnerships
          </a>{" "}
          to submit your details first. Once registered, sign in below with the same email to track
          your status.
        </p>

        <div className="mt-8">
          {authState === "checking" && <p className="text-sm text-forest-dark/60">Checking sign-in status…</p>}

          {authState === "signedOut" && <EmailMagicLinkForm redirectPath="/portal" buttonLabel="Sign In to Portal" />}

          {authState === "signedIn" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-white p-4">
                <p className="text-sm text-forest-dark/70">
                  Signed in as <span className="font-semibold text-forest-dark">{email}</span>
                </p>
                <button
                  onClick={handleSignOut}
                  className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/5"
                >
                  Sign Out
                </button>
              </div>

              {loading && <p className="mt-6 text-sm text-forest-dark/60">Loading your records…</p>}

              {!loading && !hasAnyRecord && (
                <p className="mt-6 text-sm text-forest-dark/60">
                  No records found for this email yet. If you just registered, check that you used the
                  same email address, or register via{" "}
                  <a href="/for-farmers" className="font-semibold text-forest hover:text-forest-dark">
                    For Farmers
                  </a>
                  ,{" "}
                  <a href="/for-buyers" className="font-semibold text-forest hover:text-forest-dark">
                    For Buyers
                  </a>{" "}
                  or{" "}
                  <a href="/partnerships" className="font-semibold text-forest hover:text-forest-dark">
                    Partnerships
                  </a>
                  .
                </p>
              )}

              {!loading && farmerRecords.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-heading text-lg font-bold text-forest">Farmer Registration</h2>
                  {farmerRecords.map((r) => (
                    <div key={r.id} className="mt-3 rounded-2xl border border-forest/10 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold text-forest-dark">{r.full_name}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {r.commodities.map((c) => (
                          <span key={c} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && buyerRecords.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-heading text-lg font-bold text-forest">Buyer Sourcing Requests</h2>
                  {buyerRecords.map((r) => (
                    <div key={r.id} className="mt-3 rounded-2xl border border-forest/10 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold text-forest-dark">{r.company_name}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {r.commodities_needed.map((c) => (
                          <span key={c} className="rounded-full bg-harvest-gold/10 px-3 py-1 text-harvest-gold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && supplierRecords.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-heading text-lg font-bold text-forest">Supplier Registration</h2>
                  {supplierRecords.map((r) => (
                    <div key={r.id} className="mt-3 rounded-2xl border border-forest/10 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold text-forest-dark">{r.company_name}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {r.services.map((s) => (
                          <span key={s} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

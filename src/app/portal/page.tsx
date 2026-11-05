"use client";

import { useCallback, useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import EmailMagicLinkForm from "@/components/EmailMagicLinkForm";
import { supabase } from "@/lib/supabase";
import { stockImages, valueChains } from "@/lib/site-data";

type VerificationStatus = "pending" | "verified" | "rejected";

type FarmerRecord = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  location: string | null;
  farm_size_hectares: number | null;
  commodities: string[];
  cooperative_or_group: string | null;
  status: string;
  verification_status: VerificationStatus;
};

type BuyerRecord = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  phone: string | null;
  commodities_needed: string[];
  quantity_required: string | null;
  quality_requirements: string | null;
  status: string;
  verification_status: VerificationStatus;
};

type SupplierRecord = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  phone: string | null;
  services: string[];
  status: string;
  verification_status: VerificationStatus;
};

type CooperativeRecord = {
  id: string;
  created_at: string;
  name: string;
  lead_contact_name: string;
  phone: string | null;
  location_label: string | null;
  member_count_estimate: number | null;
  primary_commodities: string[];
  status: string;
  verification_status: VerificationStatus;
};

function VerificationBanner({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-agri-green/10 px-3 py-1 text-xs font-semibold text-agri-green">
        ✓ Verified
      </p>
    );
  }
  if (status === "rejected") {
    return (
      <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
        This registration was not approved. Contact AgriXpert if you believe this was in error or to
        update your details and be reconsidered.
      </p>
    );
  }
  return (
    <p className="mt-3 rounded-xl bg-harvest-gold/10 px-3 py-2 text-xs font-medium text-harvest-gold">
      Pending verification — an AgriXpert admin is reviewing this registration. Some marketplace
      features will be unavailable until it&apos;s approved.
    </p>
  );
}

const supplierServiceCategories = [
  "Mechanisation & Farm Equipment",
  "Input Supply (seeds, fertiliser, agrochemicals)",
  "Logistics & Transportation",
  "Storage & Warehousing",
  "Processing Equipment & Technology",
  "Financial Services",
  "Other",
];

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-harvest-gold/15 text-harvest-gold",
    verified: "bg-agri-green/15 text-agri-green",
    active: "bg-agri-green/15 text-agri-green",
    inactive: "bg-forest-dark/10 text-forest-dark/60",
  };
  return colors[status] ?? "bg-forest-dark/10 text-forest-dark/60";
}

function CommodityToggle({
  options,
  selected,
  onToggle,
  activeClass,
}: {
  options: string[];
  selected: string[];
  onToggle: (name: string) => void;
  activeClass: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isOn = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              isOn ? activeClass : "bg-forest-dark/5 text-forest-dark/50 hover:bg-forest-dark/10"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function PortalPage() {
  const [authState, setAuthState] = useState<"checking" | "signedOut" | "signedIn">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [farmerRecords, setFarmerRecords] = useState<FarmerRecord[]>([]);
  const [buyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([]);
  const [supplierRecords, setSupplierRecords] = useState<SupplierRecord[]>([]);
  const [cooperativeRecords, setCooperativeRecords] = useState<CooperativeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<"farmer" | "buyer" | "supplier" | "cooperative" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setEmail(data.session.user.email ?? null);
      // Best-effort: link this login to any farmer/buyer/supplier record(s)
      // matching the signed-in email across all three tables (a user can
      // hold more than one role). Safe to call every sign-in — it only
      // updates rows where user_id is still null.
      await supabase.rpc("link_my_identity");
      // An admin account is not a farmer/buyer/supplier. Without this check,
      // RLS's "is_admin() OR email match" SELECT policy lets an admin see
      // every registration on this page — every other actor's data, shown
      // as if it were the admin's own, with an "Edit Details" button next
      // to each one. Steer them to the real admin dashboard instead.
      const { data: adminCheck } = await supabase.rpc("is_admin");
      setIsAdmin(Boolean(adminCheck));
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
    const [farmers, buyers, suppliers, cooperatives] = await Promise.all([
      supabase
        .from("farmers")
        .select(
          "id, created_at, full_name, phone, location, farm_size_hectares, commodities, cooperative_or_group, status, verification_status"
        ),
      supabase
        .from("buyers")
        .select(
          "id, created_at, company_name, contact_name, phone, commodities_needed, quantity_required, quality_requirements, status, verification_status"
        ),
      supabase
        .from("suppliers")
        .select("id, created_at, company_name, contact_name, phone, services, status, verification_status"),
      supabase
        .from("cooperatives")
        .select(
          "id, created_at, name, lead_contact_name, phone, location_label, member_count_estimate, primary_commodities, status, verification_status"
        ),
    ]);
    setFarmerRecords((farmers.data as FarmerRecord[]) ?? []);
    setBuyerRecords((buyers.data as BuyerRecord[]) ?? []);
    setSupplierRecords((suppliers.data as SupplierRecord[]) ?? []);
    setCooperativeRecords((cooperatives.data as CooperativeRecord[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authState === "signedIn" && !isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch once signed in
      loadRecords();
    }
  }, [authState, isAdmin, loadRecords]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthState("signedOut");
    setFarmerRecords([]);
    setBuyerRecords([]);
    setSupplierRecords([]);
    setCooperativeRecords([]);
  }

  async function saveFarmer(form: HTMLFormElement, commodities: string[]) {
    setSaving(true);
    setSaveError(null);
    const fd = new FormData(form);
    const farmSizeRaw = String(fd.get("farmSize") ?? "").trim();
    const { error } = await supabase.rpc("update_own_farmer", {
      p_full_name: String(fd.get("fullName") ?? ""),
      p_phone: String(fd.get("phone") ?? ""),
      p_location: String(fd.get("location") ?? ""),
      p_farm_size_hectares: farmSizeRaw ? Number(farmSizeRaw) : null,
      p_commodities: commodities,
      p_cooperative_or_group: String(fd.get("cooperative") ?? ""),
    });
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setEditingSection(null);
    loadRecords();
  }

  async function saveBuyer(form: HTMLFormElement, commodities: string[]) {
    setSaving(true);
    setSaveError(null);
    const fd = new FormData(form);
    const { error } = await supabase.rpc("update_own_buyer", {
      p_contact_name: String(fd.get("contactName") ?? ""),
      p_phone: String(fd.get("phone") ?? ""),
      p_commodities_needed: commodities,
      p_quantity_required: String(fd.get("quantityRequired") ?? ""),
      p_quality_requirements: String(fd.get("qualityRequirements") ?? ""),
    });
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setEditingSection(null);
    loadRecords();
  }

  async function saveSupplier(form: HTMLFormElement, services: string[]) {
    setSaving(true);
    setSaveError(null);
    const fd = new FormData(form);
    const { error } = await supabase.rpc("update_own_supplier", {
      p_contact_name: String(fd.get("contactName") ?? ""),
      p_phone: String(fd.get("phone") ?? ""),
      p_services: services,
    });
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setEditingSection(null);
    loadRecords();
  }

  async function saveCooperative(form: HTMLFormElement, commodities: string[]) {
    setSaving(true);
    setSaveError(null);
    const fd = new FormData(form);
    const { error } = await supabase.rpc("update_own_cooperative", {
      p_lead_contact_name: String(fd.get("leadContactName") ?? ""),
      p_phone: String(fd.get("phone") ?? ""),
      p_primary_commodities: commodities,
    });
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setEditingSection(null);
    loadRecords();
  }

  const hasAnyRecord =
    farmerRecords.length + buyerRecords.length + supplierRecords.length + cooperativeRecords.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Portal"
        title="Farmer / Buyer Portal"
        description="Sign in to track and update your registration with AgriXpert. For farmers registered under a cooperative or group, your group affiliation is shown alongside your status."
        image={stockImages.dataScreen}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <div className="rounded-2xl border border-agri-green/20 bg-agri-green/5 p-5">
          <p className="text-sm font-semibold text-forest">Our focus is access</p>
          <p className="mt-2 text-sm text-forest-dark/70">
            AgriXpert&apos;s role is to get farmers and agricultural businesses access: to buyers,
            mechanisation, storage, processing and finance, whether through our own coordination or
            through specialist partners in these areas. Equipment, logistics and financial-service
            providers register here so we can connect farmers to them. We are also building toward
            group-level visibility for cooperatives, and linking registration to the business
            strengthening support AgriXpert and its partners provide, so that registering here is a
            step toward a more investment-ready enterprise, not only a status update.
          </p>
        </div>
        <p className="mt-6 text-forest-dark/70">
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
          </a>
          , or register a group via{" "}
          <a href="/for-cooperatives" className="font-semibold text-forest hover:text-forest-dark">
            For Cooperatives
          </a>{" "}
          to submit your details first. Once registered, sign in below with the same email to track
          and update your status.
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

              {isAdmin ? (
                <p className="mt-6 rounded-2xl border border-harvest-gold/20 bg-harvest-gold/5 p-5 text-sm text-forest-dark/70">
                  This account is an AgriXpert staff account, not a farmer/buyer/supplier
                  registration. Use the{" "}
                  <a href="/admin" className="font-semibold text-forest hover:text-forest-dark">
                    staff dashboard
                  </a>{" "}
                  to review and verify registrations.
                </p>
              ) : (
                <>
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
                  , or{" "}
                  <a href="/for-cooperatives" className="font-semibold text-forest hover:text-forest-dark">
                    For Cooperatives
                  </a>
                  .
                </p>
              )}

              {!loading &&
                farmerRecords.map((r) => (
                  <FarmerCard
                    key={`${r.id}-${editingSection === "farmer"}`}
                    record={r}
                    editing={editingSection === "farmer"}
                    saving={saving}
                    saveError={editingSection === "farmer" ? saveError : null}
                    onEdit={() => {
                      setSaveError(null);
                      setEditingSection("farmer");
                    }}
                    onCancel={() => setEditingSection(null)}
                    onSave={saveFarmer}
                  />
                ))}

              {!loading &&
                buyerRecords.map((r) => (
                  <BuyerCard
                    key={`${r.id}-${editingSection === "buyer"}`}
                    record={r}
                    editing={editingSection === "buyer"}
                    saving={saving}
                    saveError={editingSection === "buyer" ? saveError : null}
                    onEdit={() => {
                      setSaveError(null);
                      setEditingSection("buyer");
                    }}
                    onCancel={() => setEditingSection(null)}
                    onSave={saveBuyer}
                  />
                ))}

              {!loading &&
                supplierRecords.map((r) => (
                  <SupplierCard
                    key={`${r.id}-${editingSection === "supplier"}`}
                    record={r}
                    editing={editingSection === "supplier"}
                    saving={saving}
                    saveError={editingSection === "supplier" ? saveError : null}
                    onEdit={() => {
                      setSaveError(null);
                      setEditingSection("supplier");
                    }}
                    onCancel={() => setEditingSection(null)}
                    onSave={saveSupplier}
                  />
                ))}

              {!loading &&
                cooperativeRecords.map((r) => (
                  <CooperativeCard
                    key={`${r.id}-${editingSection === "cooperative"}`}
                    record={r}
                    editing={editingSection === "cooperative"}
                    saving={saving}
                    saveError={editingSection === "cooperative" ? saveError : null}
                    onEdit={() => {
                      setSaveError(null);
                      setEditingSection("cooperative");
                    }}
                    onCancel={() => setEditingSection(null)}
                    onSave={saveCooperative}
                  />
                ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FarmerCard({
  record,
  editing,
  saving,
  saveError,
  onEdit,
  onCancel,
  onSave,
}: {
  record: FarmerRecord;
  editing: boolean;
  saving: boolean;
  saveError: string | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (form: HTMLFormElement, commodities: string[]) => void;
}) {
  const [commodities, setCommodities] = useState<string[]>(record.commodities);

  function toggle(name: string) {
    setCommodities((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  }

  if (!editing) {
    return (
      <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-forest">Farmer Registration</h2>
            <p className="mt-1 font-semibold text-forest-dark">{record.full_name}</p>
            <p className="text-xs text-forest-dark/60">
              {record.phone}
              {record.location ? ` · ${record.location}` : ""}
              {record.farm_size_hectares != null ? ` · ${record.farm_size_hectares} ha` : ""}
            </p>
            {record.cooperative_or_group && (
              <span className="mt-2 inline-flex items-center rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                Group: {record.cooperative_or_group}
              </span>
            )}
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(record.status)}`}>
            {record.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {record.commodities.map((c) => (
            <span key={c} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
              {c}
            </span>
          ))}
        </div>
        <VerificationBanner status={record.verification_status} />
        <button
          onClick={onEdit}
          className="mt-4 rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
        >
          Edit Details
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(e.currentTarget, commodities);
      }}
      className="mt-6 space-y-4 rounded-2xl border border-forest/10 bg-white p-5"
    >
      <h2 className="font-heading text-lg font-bold text-forest">Edit Farmer Registration</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark">Full Name</label>
          <input name="fullName" defaultValue={record.full_name} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Phone</label>
          <input name="phone" defaultValue={record.phone} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Location</label>
          <input name="location" defaultValue={record.location ?? ""} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Farm Size (ha)</label>
          <input
            name="farmSize"
            type="number"
            min="0"
            step="0.1"
            defaultValue={record.farm_size_hectares ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-forest-dark">Cooperative / Farmer Group</label>
          <input
            name="cooperative"
            defaultValue={record.cooperative_or_group ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-forest-dark">Commodities</span>
        <div className="mt-2">
          <CommodityToggle
            options={valueChains.map((v) => v.name)}
            selected={commodities}
            onToggle={toggle}
            activeClass="bg-agri-green/20 text-agri-green"
          />
        </div>
      </div>
      {saveError && <p className="text-sm font-medium text-red-600">{saveError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest-dark hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function BuyerCard({
  record,
  editing,
  saving,
  saveError,
  onEdit,
  onCancel,
  onSave,
}: {
  record: BuyerRecord;
  editing: boolean;
  saving: boolean;
  saveError: string | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (form: HTMLFormElement, commodities: string[]) => void;
}) {
  const [commodities, setCommodities] = useState<string[]>(record.commodities_needed);

  function toggle(name: string) {
    setCommodities((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  }

  if (!editing) {
    return (
      <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-forest">Buyer Sourcing Request</h2>
            <p className="mt-1 font-semibold text-forest-dark">{record.company_name}</p>
            <p className="text-xs text-forest-dark/60">
              {record.contact_name}
              {record.phone ? ` · ${record.phone}` : ""}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(record.status)}`}>
            {record.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {record.commodities_needed.map((c) => (
            <span key={c} className="rounded-full bg-harvest-gold/10 px-3 py-1 text-harvest-gold">
              {c}
            </span>
          ))}
        </div>
        {(record.quantity_required || record.quality_requirements) && (
          <p className="mt-2 text-sm text-forest-dark/70">
            {record.quantity_required && <span>Qty: {record.quantity_required}. </span>}
            {record.quality_requirements && <span>Quality: {record.quality_requirements}</span>}
          </p>
        )}
        <VerificationBanner status={record.verification_status} />
        <button
          onClick={onEdit}
          className="mt-4 rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
        >
          Edit Details
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(e.currentTarget, commodities);
      }}
      className="mt-6 space-y-4 rounded-2xl border border-forest/10 bg-white p-5"
    >
      <h2 className="font-heading text-lg font-bold text-forest">Edit Buyer Sourcing Request</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark">Contact Person</label>
          <input name="contactName" defaultValue={record.contact_name} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Phone</label>
          <input name="phone" defaultValue={record.phone ?? ""} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Quantity Required</label>
          <input
            name="quantityRequired"
            defaultValue={record.quantity_required ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Quality Requirements</label>
          <input
            name="qualityRequirements"
            defaultValue={record.quality_requirements ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-forest-dark">Commodities Needed</span>
        <div className="mt-2">
          <CommodityToggle
            options={valueChains.map((v) => v.name)}
            selected={commodities}
            onToggle={toggle}
            activeClass="bg-harvest-gold/20 text-harvest-gold"
          />
        </div>
      </div>
      {saveError && <p className="text-sm font-medium text-red-600">{saveError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest-dark hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SupplierCard({
  record,
  editing,
  saving,
  saveError,
  onEdit,
  onCancel,
  onSave,
}: {
  record: SupplierRecord;
  editing: boolean;
  saving: boolean;
  saveError: string | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (form: HTMLFormElement, services: string[]) => void;
}) {
  const [services, setServices] = useState<string[]>(record.services);

  function toggle(name: string) {
    setServices((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
  }

  if (!editing) {
    return (
      <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-forest">Supplier Registration</h2>
            <p className="mt-1 font-semibold text-forest-dark">{record.company_name}</p>
            <p className="text-xs text-forest-dark/60">
              {record.contact_name}
              {record.phone ? ` · ${record.phone}` : ""}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(record.status)}`}>
            {record.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {record.services.map((s) => (
            <span key={s} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
              {s}
            </span>
          ))}
        </div>
        <VerificationBanner status={record.verification_status} />
        <button
          onClick={onEdit}
          className="mt-4 rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
        >
          Edit Details
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(e.currentTarget, services);
      }}
      className="mt-6 space-y-4 rounded-2xl border border-forest/10 bg-white p-5"
    >
      <h2 className="font-heading text-lg font-bold text-forest">Edit Supplier Registration</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark">Contact Person</label>
          <input name="contactName" defaultValue={record.contact_name} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Phone</label>
          <input name="phone" defaultValue={record.phone ?? ""} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-forest-dark">Services You Provide</span>
        <div className="mt-2">
          <CommodityToggle
            options={supplierServiceCategories}
            selected={services}
            onToggle={toggle}
            activeClass="bg-agri-green/20 text-agri-green"
          />
        </div>
      </div>
      {saveError && <p className="text-sm font-medium text-red-600">{saveError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest-dark hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function CooperativeCard({
  record,
  editing,
  saving,
  saveError,
  onEdit,
  onCancel,
  onSave,
}: {
  record: CooperativeRecord;
  editing: boolean;
  saving: boolean;
  saveError: string | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (form: HTMLFormElement, commodities: string[]) => void;
}) {
  const [commodities, setCommodities] = useState<string[]>(record.primary_commodities);

  function toggle(name: string) {
    setCommodities((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  }

  if (!editing) {
    return (
      <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-forest">Cooperative Registration</h2>
            <p className="mt-1 font-semibold text-forest-dark">{record.name}</p>
            <p className="text-xs text-forest-dark/60">
              {record.lead_contact_name}
              {record.phone ? ` · ${record.phone}` : ""}
            </p>
            <p className="text-xs text-forest-dark/60">
              {record.location_label ?? "Location not provided"}
              {record.member_count_estimate ? ` · ~${record.member_count_estimate} members` : ""}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(record.status)}`}>
            {record.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {record.primary_commodities.map((c) => (
            <span key={c} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
              {c}
            </span>
          ))}
        </div>
        <VerificationBanner status={record.verification_status} />
        <button
          onClick={onEdit}
          className="mt-4 rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
        >
          Edit Details
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(e.currentTarget, commodities);
      }}
      className="mt-6 space-y-4 rounded-2xl border border-forest/10 bg-white p-5"
    >
      <h2 className="font-heading text-lg font-bold text-forest">Edit Cooperative Registration</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest-dark">Lead Contact Person</label>
          <input
            name="leadContactName"
            defaultValue={record.lead_contact_name}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-dark">Phone</label>
          <input name="phone" defaultValue={record.phone ?? ""} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-forest-dark">Primary Commodities</span>
        <div className="mt-2">
          <CommodityToggle
            options={valueChains.map((v) => v.name)}
            selected={commodities}
            onToggle={toggle}
            activeClass="bg-agri-green/20 text-agri-green"
          />
        </div>
      </div>
      {saveError && <p className="text-sm font-medium text-red-600">{saveError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest-dark hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

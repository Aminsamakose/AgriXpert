"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ContentManager from "@/components/admin/ContentManager";
import PageContentManager from "@/components/admin/PageContentManager";
import InsightsManager from "@/components/admin/InsightsManager";
import StaffManager from "@/components/admin/StaffManager";
import CrmPanel from "@/components/admin/CrmPanel";
import FollowUpsManager from "@/components/admin/FollowUpsManager";
import { valueChains, stockImages } from "@/lib/site-data";
import { solutionsList } from "@/lib/solutions-content";

type Tab =
  | "enquiries"
  | "farmers"
  | "buyers"
  | "suppliers"
  | "cooperatives"
  | "followups"
  | "reporting"
  | "content"
  | "value-chains"
  | "solutions"
  | "insights"
  | "staff";

const stockImageOptions = Object.entries(stockImages).map(([key, img]) => ({ key, src: img.src }));

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
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | null;
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
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | null;
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
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | null;
};

type Cooperative = {
  id: string;
  created_at: string;
  name: string;
  lead_contact_name: string;
  email: string | null;
  phone: string | null;
  location_label: string | null;
  primary_commodities: string[];
  member_count_estimate: number | null;
  status: string;
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | null;
};

type VerifiableEntity = "farmer" | "buyer" | "supplier" | "cooperative";

function verificationBadge(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-harvest-gold/15 text-harvest-gold",
    verified: "bg-agri-green/15 text-agri-green",
    rejected: "bg-red-100 text-red-700",
  };
  return colors[status] ?? "bg-forest-dark/10 text-forest-dark/60";
}

const leadStatuses = ["pending", "verified", "active", "inactive"];
const enquiryStatuses = ["new", "in_progress", "resolved", "archived"];

// Tabs marked adminOnly are hidden from "staff" accounts — site/platform
// configuration (content, insights) and managing this staff list itself
// are reserved for full "admin" accounts. Everything else (verifying
// registrations, moderating the marketplace, reporting) is available to
// both roles, matching the is_admin()/is_staff() RLS split in the database.
const tabs: { key: Tab; label: string; adminOnly?: boolean }[] = [
  { key: "enquiries", label: "Enquiries" },
  { key: "farmers", label: "Farmers" },
  { key: "buyers", label: "Buyers" },
  { key: "suppliers", label: "Suppliers" },
  { key: "cooperatives", label: "Cooperatives" },
  { key: "followups", label: "Follow-ups" },
  { key: "reporting", label: "Reporting" },
  { key: "content", label: "Site Content", adminOnly: true },
  { key: "value-chains", label: "Value Chains", adminOnly: true },
  { key: "solutions", label: "Solutions", adminOnly: true },
  { key: "insights", label: "Insights", adminOnly: true },
  { key: "staff", label: "Staff Accounts", adminOnly: true },
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
  return (
    <Suspense fallback={null}>
      <AdminDashboardInner />
    </Suspense>
  );
}

function AdminDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<"checking" | "unauthenticated" | "unauthorized" | "authorized">(
    "checking"
  );
  const [role, setRole] = useState<"admin" | "staff" | null>(null);
  const validTabs: Tab[] = [
    "enquiries",
    "farmers",
    "buyers",
    "suppliers",
    "cooperatives",
    "followups",
    "reporting",
    "content",
    "value-chains",
    "solutions",
    "insights",
    "staff",
  ];
  const tabFromQuery = searchParams.get("tab");
  const initialTab: Tab = validTabs.includes(tabFromQuery as Tab) ? (tabFromQuery as Tab) : "enquiries";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [stageFilter, setStageFilter] = useState<"all" | "new" | "contacted" | "engaged" | "active" | "dormant">("all");
  const [stageMap, setStageMap] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

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
    const { data: ownRow } = await supabase
      .from("admins")
      .select("role")
      .eq("email", sessionData.session.user.email ?? "")
      .maybeSingle();
    setRole((ownRow?.role as "admin" | "staff" | undefined) ?? "staff");
    setAuthState("authorized");
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async auth bootstrap on mount
    checkAuth();
  }, [checkAuth]);

  const [summary, setSummary] = useState<
    { entity_type: string; verification_status: string; status: string; actor_count: number }[]
  >([]);
  const [timeToVerify, setTimeToVerify] = useState<
    { entity_type: string; region: string; avg_time_to_verification: string | null; verified_count: number }[]
  >([]);

  const loadTab = useCallback(async (tab: Tab) => {
    if (tab === "content" || tab === "value-chains" || tab === "solutions" || tab === "insights" || tab === "followups" || tab === "staff")
      return;
    if (tab === "reporting") {
      setLoading(true);
      setError(null);
      const [summaryRes, timeRes] = await Promise.all([
        supabase.from("v_verification_summary").select("*"),
        supabase.from("v_time_to_verification").select("*"),
      ]);
      if (summaryRes.error) setError(summaryRes.error.message);
      else setSummary(summaryRes.data ?? []);
      if (timeRes.error) setError((prev) => prev ?? timeRes.error!.message);
      else setTimeToVerify(timeRes.data ?? []);
      setLoading(false);
      return;
    }
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
    } else if (tab === "suppliers") {
      const { data, error: qError } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setSuppliers(data as Supplier[]);
    } else {
      const { data, error: qError } = await supabase
        .from("cooperatives")
        .select("*")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setCooperatives(data as Cooperative[]);
    }

    if (tab === "farmers" || tab === "buyers" || tab === "suppliers" || tab === "cooperatives") {
      const entityType = tab === "farmers" ? "farmer" : tab === "buyers" ? "buyer" : tab === "suppliers" ? "supplier" : "cooperative";
      const { data: stageRows } = await supabase
        .from("crm_pipeline")
        .select("entity_id, stage")
        .eq("entity_type", entityType);
      const map: Record<string, string> = {};
      (stageRows ?? []).forEach((r: { entity_id: string; stage: string }) => {
        map[r.entity_id] = r.stage;
      });
      setStageMap(map);
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

  const [verifying, setVerifying] = useState<string | null>(null);

  function contactForEntity(entityType: VerifiableEntity, id: string): { name: string; email: string } | null {
    if (entityType === "farmer") {
      const row = farmers.find((r) => r.id === id);
      return row?.email ? { name: row.full_name, email: row.email } : null;
    }
    if (entityType === "buyer") {
      const row = buyers.find((r) => r.id === id);
      return row?.email ? { name: row.contact_name, email: row.email } : null;
    }
    if (entityType === "supplier") {
      const row = suppliers.find((r) => r.id === id);
      return row?.email ? { name: row.contact_name, email: row.email } : null;
    }
    const row = cooperatives.find((r) => r.id === id);
    return row?.email ? { name: row.lead_contact_name, email: row.email } : null;
  }

  function notifyVerificationDecision(
    entityType: VerifiableEntity,
    contact: { name: string; email: string },
    decision: "verified" | "rejected"
  ) {
    const entityLabel = { farmer: "farmer", buyer: "buyer", supplier: "supplier", cooperative: "cooperative" }[
      entityType
    ];
    const isVerified = decision === "verified";
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: contact.email,
        subject: isVerified ? "You're verified on AgriXpert" : "Update on your AgriXpert registration",
        name: contact.name,
        badgeLabel: isVerified ? "VERIFIED" : "NOT APPROVED",
        badgeColor: isVerified ? "agriGreen" : "red",
        heading: isVerified ? "You're verified!" : "Update on your registration",
        message: isVerified
          ? `your ${entityLabel} account has been verified. You now have full access to the AgriXpert marketplace.`
          : `after review, we were unable to verify your ${entityLabel} registration at this time. If you have questions or would like to update your details and resubmit, just reply to this email.`,
        ctaLabel: isVerified ? "Open AgriXpert" : undefined,
        ctaUrl: isVerified ? (process.env.NEXT_PUBLIC_SITE_URL || "https://agri-xpert.vercel.app") + "/marketplace" : undefined,
      }),
    }).catch(() => {});
  }

  async function decide(entityType: VerifiableEntity, id: string, decision: "verified" | "rejected" | "pending") {
    setVerifying(id);
    setError(null);
    const contact = decision === "pending" ? null : contactForEntity(entityType, id);
    const { error: rpcError } = await supabase.rpc("verify_entity", {
      p_entity_type: entityType,
      p_entity_id: id,
      p_decision: decision,
    });
    setVerifying(null);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    if (contact && (decision === "verified" || decision === "rejected")) {
      notifyVerificationDecision(entityType, contact, decision);
    }
    loadTab(
      entityType === "farmer"
        ? "farmers"
        : entityType === "buyer"
          ? "buyers"
          : entityType === "supplier"
            ? "suppliers"
            : "cooperatives"
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset filter/selection UI state on tab change
    setSearchQuery("");
    setVerificationFilter("all");
    setStageFilter("all");
    setSelectedIds(new Set());
  }, [activeTab]);

  async function bulkDecide(entityType: VerifiableEntity, decision: "verified" | "rejected") {
    if (selectedIds.size === 0) return;
    setBulkWorking(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("bulk_verify_entity", {
      p_entity_type: entityType,
      p_entity_ids: Array.from(selectedIds),
      p_decision: decision,
    });
    setBulkWorking(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    const results = (data as { entity_id: string; ok: boolean; error: string | null }[] | null) ?? [];
    const failures = results.filter((r) => !r.ok);
    if (failures.length > 0) {
      setError(`${failures.length} of ${selectedIds.size} record(s) failed: ${failures[0].error}`);
    }
    results
      .filter((r) => r.ok)
      .forEach((r) => {
        const contact = contactForEntity(entityType, r.entity_id);
        if (contact) notifyVerificationDecision(entityType, contact, decision);
      });
    setSelectedIds(new Set());
    loadTab(
      entityType === "farmer"
        ? "farmers"
        : entityType === "buyer"
          ? "buyers"
          : entityType === "supplier"
            ? "suppliers"
            : "cooperatives"
    );
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function matchesFilters<T extends { id: string; verification_status: string }>(
    row: T,
    searchFields: (string | null | undefined)[]
  ) {
    if (verificationFilter !== "all" && row.verification_status !== verificationFilter) return false;
    if (stageFilter !== "all" && (stageMap[row.id] ?? "new") !== stageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return searchFields.some((f) => f && f.toLowerCase().includes(q));
    }
    return true;
  }

  function SearchFilterBar({
    entityType,
    selectableIds,
  }: {
    entityType: VerifiableEntity;
    selectableIds: string[];
  }) {
    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.has(id));
    return (
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, company, email, location…"
            className="flex-1 min-w-[200px] rounded-lg border border-forest/20 px-3 py-2 text-sm"
          />
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value as typeof verificationFilter)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm"
          >
            <option value="all">All verification states</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as typeof stageFilter)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm"
          >
            <option value="all">All CRM stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="engaged">Engaged</option>
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
          </select>
          {selectableIds.length > 0 && (
            <label className="flex items-center gap-2 text-xs font-semibold text-forest-dark/70">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) =>
                  setSelectedIds(e.target.checked ? new Set(selectableIds) : new Set())
                }
              />
              Select all shown ({selectableIds.length})
            </label>
          )}
        </div>
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-forest/5 p-3">
            <span className="text-xs font-semibold text-forest-dark/70">
              {selectedIds.size} selected
            </span>
            <button
              onClick={() => bulkDecide(entityType, "verified")}
              disabled={bulkWorking}
              className="rounded-full bg-agri-green px-4 py-1.5 text-xs font-semibold text-natural-white hover:bg-agri-green/90 disabled:opacity-40"
            >
              {bulkWorking ? "Working…" : "Verify Selected"}
            </button>
            <button
              onClick={() => bulkDecide(entityType, "rejected")}
              disabled={bulkWorking}
              className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
            >
              {bulkWorking ? "Working…" : "Reject Selected"}
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="rounded-full border border-forest/20 px-4 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  }

  function VerificationControls({ entityType, row }: { entityType: VerifiableEntity; row: { id: string; verification_status: string; verified_at: string | null } }) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-forest/5 pt-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verificationBadge(row.verification_status)}`}>
          Verification: {row.verification_status}
        </span>
        {row.verified_at && (
          <span className="text-xs text-forest-dark/40">as of {formatDate(row.verified_at)}</span>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => decide(entityType, row.id, "verified")}
            disabled={verifying === row.id || row.verification_status === "verified"}
            className="rounded-full bg-agri-green px-3 py-1.5 text-xs font-semibold text-natural-white hover:bg-agri-green/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {verifying === row.id ? "…" : "Verify"}
          </button>
          <button
            onClick={() => decide(entityType, row.id, "rejected")}
            disabled={verifying === row.id || row.verification_status === "rejected"}
            className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {verifying === row.id ? "…" : "Reject"}
          </button>
          {row.verification_status === "rejected" && (
            <button
              onClick={() => decide(entityType, row.id, "pending")}
              disabled={verifying === row.id}
              className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send this applicant back to pending for a fresh review, e.g. after they've fixed what got them rejected"
            >
              {verifying === row.id ? "…" : "Reset to Pending"}
            </button>
          )}
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  async function exportCsv(table: "farmers" | "buyers" | "suppliers" | "cooperatives") {
    setError(null);
    const { data, error: qError } = await supabase.from(table).select("*");
    if (qError) {
      setError(qError.message);
      return;
    }
    const rows = data ?? [];
    if (rows.length === 0) {
      setError(`No ${table} records to export yet.`);
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvEscape = (v: unknown) => {
      if (v == null) return "";
      const s = Array.isArray(v) ? v.join("; ") : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => csvEscape((r as Record<string, unknown>)[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agrixpert-${table}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatInterval(value: string | null) {
    if (!value) return "—";
    return value;
  }

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSetPassword() {
    if (newPassword.length < 8) {
      setPasswordStatus("error");
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setPasswordStatus("saving");
    setPasswordError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setPasswordStatus("error");
      setPasswordError(updateError.message);
      return;
    }
    setPasswordStatus("saved");
    setNewPassword("");
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasswordForm((v) => !v)}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/5"
          >
            {showPasswordForm ? "Close" : "Set Password"}
          </button>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/5"
          >
            Sign Out
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <div className="mt-4 max-w-md rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-harvest-gold">
            Set a password for this account
          </h2>
          <p className="mt-2 text-xs text-forest-dark/60">
            Once set, you can sign in with your email and this password instead of waiting for an
            email link each time.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min. 8 characters)"
              className="flex-1 rounded-lg border border-forest/20 px-3 py-2 text-sm"
            />
            <button
              onClick={handleSetPassword}
              disabled={passwordStatus === "saving"}
              className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:opacity-40"
            >
              {passwordStatus === "saving" ? "Saving…" : "Save"}
            </button>
          </div>
          {passwordStatus === "saved" && (
            <p className="mt-2 text-xs font-semibold text-agri-green">
              Password set. You can now sign in with it from the login page.
            </p>
          )}
          {passwordStatus === "error" && passwordError && (
            <p className="mt-2 text-xs font-semibold text-red-600">{passwordError}</p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-b border-forest/10">
        {tabs.filter((tab) => !tab.adminOnly || role === "admin").map((tab) => (
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
              <CrmPanel entityType="enquiry" entityId={row.id} entityLabel={row.name} />
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "farmers" && (() => {
        const filtered = farmers.filter((row) =>
          matchesFilters(row, [row.full_name, row.email, row.location, row.cooperative_or_group])
        );
        return (
        <div className="mt-6 space-y-4">
          <SearchFilterBar entityType="farmer" selectableIds={filtered.map((r) => r.id)} />
          {filtered.length === 0 && <p className="text-sm text-forest-dark/60">No farmer registrations match.</p>}
          {filtered.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelected(row.id)}
                    className="mt-1"
                  />
                  <div>
                  <p className="font-semibold text-forest-dark">{row.full_name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.phone}
                    {row.email ? ` · ${row.email}` : ""}
                    {row.location ? ` · ${row.location}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                  </div>
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
              <VerificationControls entityType="farmer" row={row} />
              <CrmPanel
                entityType="farmer"
                entityId={row.id}
                entityLabel={row.full_name}
                onStageChange={(stage) => setStageMap((prev) => ({ ...prev, [row.id]: stage }))}
              />
            </div>
          ))}
        </div>
        );
      })()}

      {!loading && activeTab === "buyers" && (() => {
        const filtered = buyers.filter((row) => matchesFilters(row, [row.company_name, row.contact_name, row.email]));
        return (
        <div className="mt-6 space-y-4">
          <SearchFilterBar entityType="buyer" selectableIds={filtered.map((r) => r.id)} />
          {filtered.length === 0 && <p className="text-sm text-forest-dark/60">No buyer requests match.</p>}
          {filtered.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelected(row.id)}
                    className="mt-1"
                  />
                  <div>
                  <p className="font-semibold text-forest-dark">{row.company_name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.contact_name} · {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                  </div>
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
              <VerificationControls entityType="buyer" row={row} />
              <CrmPanel
                entityType="buyer"
                entityId={row.id}
                entityLabel={row.company_name}
                onStageChange={(stage) => setStageMap((prev) => ({ ...prev, [row.id]: stage }))}
              />
            </div>
          ))}
        </div>
        );
      })()}

      {!loading && activeTab === "suppliers" && (() => {
        const filtered = suppliers.filter((row) => matchesFilters(row, [row.company_name, row.contact_name, row.email]));
        return (
        <div className="mt-6 space-y-4">
          <SearchFilterBar entityType="supplier" selectableIds={filtered.map((r) => r.id)} />
          {filtered.length === 0 && <p className="text-sm text-forest-dark/60">No supplier registrations match.</p>}
          {filtered.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelected(row.id)}
                    className="mt-1"
                  />
                  <div>
                  <p className="font-semibold text-forest-dark">{row.company_name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.contact_name} · {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                  </div>
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
              <VerificationControls entityType="supplier" row={row} />
              <CrmPanel
                entityType="supplier"
                entityId={row.id}
                entityLabel={row.company_name}
                onStageChange={(stage) => setStageMap((prev) => ({ ...prev, [row.id]: stage }))}
              />
            </div>
          ))}
        </div>
        );
      })()}

      {!loading && activeTab === "cooperatives" && (() => {
        const filtered = cooperatives.filter((row) =>
          matchesFilters(row, [row.name, row.lead_contact_name, row.email, row.location_label])
        );
        return (
        <div className="mt-6 space-y-4">
          <SearchFilterBar entityType="cooperative" selectableIds={filtered.map((r) => r.id)} />
          {filtered.length === 0 && <p className="text-sm text-forest-dark/60">No cooperative registrations match.</p>}
          {filtered.map((row) => (
            <div key={row.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelected(row.id)}
                    className="mt-1"
                  />
                  <div>
                  <p className="font-semibold text-forest-dark">{row.name}</p>
                  <p className="text-xs text-forest-dark/60">
                    {row.lead_contact_name}
                    {row.email ? ` · ${row.email}` : ""}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/60">
                    {row.location_label ?? "Location not provided"}
                    {row.member_count_estimate ? ` · ~${row.member_count_estimate} members` : ""}
                  </p>
                  <p className="text-xs text-forest-dark/50">{formatDate(row.created_at)}</p>
                  </div>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus("cooperatives", row.id, e.target.value)}
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
                {row.primary_commodities.map((c) => (
                  <span key={c} className="rounded-full bg-agri-green/10 px-3 py-1 text-agri-green">
                    {c}
                  </span>
                ))}
              </div>
              <VerificationControls entityType="cooperative" row={row} />
              <CrmPanel
                entityType="cooperative"
                entityId={row.id}
                entityLabel={row.name}
                onStageChange={(stage) => setStageMap((prev) => ({ ...prev, [row.id]: stage }))}
              />
            </div>
          ))}
        </div>
        );
      })()}

      {!loading && activeTab === "reporting" && (
        <div className="mt-6 space-y-8">
          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-harvest-gold">
              Export Records
            </h2>
            <p className="mt-1 text-xs text-forest-dark/60">
              Download the full, current table as CSV for reporting, grant applications, or offline
              review.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => exportCsv("farmers")}
                className="rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
              >
                Export Farmers CSV
              </button>
              <button
                onClick={() => exportCsv("buyers")}
                className="rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
              >
                Export Buyers CSV
              </button>
              <button
                onClick={() => exportCsv("suppliers")}
                className="rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
              >
                Export Suppliers CSV
              </button>
              <button
                onClick={() => exportCsv("cooperatives")}
                className="rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest-dark hover:bg-forest/5"
              >
                Export Cooperatives CSV
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-harvest-gold">
              Verification Summary
            </h2>
            <p className="mt-1 text-xs text-forest-dark/60">
              Counts by actor type, verification outcome, and general status.
            </p>
            {summary.length === 0 ? (
              <p className="mt-3 text-sm text-forest-dark/60">No records yet.</p>
            ) : (
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-forest/10 text-xs uppercase tracking-wide text-forest-dark/50">
                    <th className="py-2 pr-4">Actor type</th>
                    <th className="py-2 pr-4">Verification</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, i) => (
                    <tr key={i} className="border-b border-forest/5">
                      <td className="py-2 pr-4 capitalize">{row.entity_type}</td>
                      <td className="py-2 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${verificationBadge(row.verification_status)}`}>
                          {row.verification_status}
                        </span>
                      </td>
                      <td className="py-2 pr-4 capitalize">{row.status}</td>
                      <td className="py-2 pr-4 font-semibold">{row.actor_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-harvest-gold">
              Average Time to Verification
            </h2>
            <p className="mt-1 text-xs text-forest-dark/60">
              By actor type and region, for records that have been verified. The kind of figure a
              donor midterm review asks for.
            </p>
            {timeToVerify.length === 0 ? (
              <p className="mt-3 text-sm text-forest-dark/60">No verified records yet.</p>
            ) : (
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-forest/10 text-xs uppercase tracking-wide text-forest-dark/50">
                    <th className="py-2 pr-4">Actor type</th>
                    <th className="py-2 pr-4">Region</th>
                    <th className="py-2 pr-4">Avg. time to verify</th>
                    <th className="py-2 pr-4">Verified count</th>
                  </tr>
                </thead>
                <tbody>
                  {timeToVerify.map((row, i) => (
                    <tr key={i} className="border-b border-forest/5">
                      <td className="py-2 pr-4 capitalize">{row.entity_type}</td>
                      <td className="py-2 pr-4">{row.region}</td>
                      <td className="py-2 pr-4">{formatInterval(row.avg_time_to_verification)}</td>
                      <td className="py-2 pr-4 font-semibold">{row.verified_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "followups" && <FollowUpsManager />}

      {role === "admin" && activeTab === "content" && <ContentManager />}
      {role === "admin" && activeTab === "value-chains" && (
        <PageContentManager
          entityType="value_chain"
          items={valueChains.map((vc) => ({ slug: vc.slug, label: vc.name }))}
          stockImageOptions={stockImageOptions}
        />
      )}
      {role === "admin" && activeTab === "solutions" && (
        <PageContentManager
          entityType="solution"
          items={solutionsList.map((s) => ({ slug: s.slug, label: s.name }))}
          stockImageOptions={stockImageOptions}
        />
      )}
      {role === "admin" && activeTab === "insights" && <InsightsManager />}
      {role === "admin" && activeTab === "staff" && <StaffManager />}
    </section>
  );
}

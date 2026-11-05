"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "admin" | "staff";

type AdminRow = {
  email: string;
  role: Role;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StaffManager() {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("staff");
  const [adding, setAdding] = useState(false);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [{ data: sessionData }, { data, error: loadError }] = await Promise.all([
      supabase.auth.getSession(),
      supabase.from("admins").select("email, role, created_at").order("created_at", { ascending: true }),
    ]);
    setCurrentEmail(sessionData.session?.user.email ?? null);
    if (loadError) {
      setError(loadError.message);
    } else {
      setRows((data as AdminRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on mount
    load();
  }, [load]);

  const fullAdminCount = rows.filter((r) => r.role === "admin").length;

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    setAdding(true);
    setError(null);
    const { error: insertError } = await supabase.from("admins").insert({ email, role: newRole });
    setAdding(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setNewEmail("");
    setNewRole("staff");
    load();
  }

  async function handleRoleChange(email: string, role: Role) {
    setBusyEmail(email);
    setError(null);
    const { error: updateError } = await supabase.from("admins").update({ role }).eq("email", email);
    setBusyEmail(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    load();
  }

  async function handleRemove(email: string) {
    setBusyEmail(email);
    setError(null);
    const { error: deleteError } = await supabase.from("admins").delete().eq("email", email);
    setBusyEmail(null);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  }

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-forest/10 bg-white p-5">
        <h2 className="font-heading text-lg font-bold text-forest">Staff Accounts</h2>
        <p className="mt-1 text-sm text-forest-dark/60">
          <span className="font-semibold">Admin</span> accounts have full access, including this page and
          site content, value chains, solutions and insights management.{" "}
          <span className="font-semibold">Staff</span> accounts can verify registrations, moderate the
          marketplace and view reporting, but cannot change site content or manage this list.
        </p>

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-4 text-sm text-forest-dark/60">Loading…</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-xs uppercase tracking-wide text-forest-dark/50">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Added</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isSelf = currentEmail?.toLowerCase() === row.email.toLowerCase();
                const isLastFullAdmin = row.role === "admin" && fullAdminCount <= 1;
                const locked = isLastFullAdmin;
                return (
                  <tr key={row.email} className="border-b border-forest/5">
                    <td className="py-2 pr-4">
                      {row.email}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-forest">
                          You
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <select
                        value={row.role}
                        disabled={busyEmail === row.email || locked}
                        onChange={(e) => handleRoleChange(row.email, e.target.value as Role)}
                        className="rounded-lg border border-forest/20 px-2 py-1 text-xs disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </td>
                    <td className="py-2 pr-4 text-xs text-forest-dark/60">{formatDate(row.created_at)}</td>
                    <td className="py-2 pr-4 text-right">
                      <button
                        type="button"
                        disabled={busyEmail === row.email || locked}
                        onClick={() => handleRemove(row.email)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        title={locked ? "At least one admin account must remain" : undefined}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-sm text-forest-dark/60">
                    No staff accounts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <form onSubmit={handleAdd} className="mt-5 flex flex-wrap items-end gap-3 border-t border-forest/10 pt-4">
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-semibold text-forest-dark/70">Email</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-forest-dark/70">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
              className="mt-1 rounded-lg border border-forest/20 px-3 py-2 text-sm"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={adding || !newEmail.trim()}
            className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:bg-forest/40"
          >
            {adding ? "Adding…" : "Add Account"}
          </button>
        </form>
        <p className="mt-2 text-xs text-forest-dark/50">
          The person signs in the same way as any staff account, via the{" "}
          <a href="/admin/login" className="font-semibold text-forest hover:text-forest-dark">
            staff login page
          </a>
          , using this email address.
        </p>
      </div>
    </div>
  );
}

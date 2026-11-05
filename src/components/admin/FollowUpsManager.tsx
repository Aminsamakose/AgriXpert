"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  entity_type: string;
  entity_label: string;
  title: string;
  due_date: string | null;
  status: "open" | "done";
  created_at: string;
};

const entityTypeLabels: Record<string, string> = {
  farmer: "Farmer",
  buyer: "Buyer",
  supplier: "Supplier",
  cooperative: "Cooperative",
  enquiry: "Enquiry",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FollowUpsManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase
      .from("crm_tasks")
      .select("id, entity_type, entity_label, title, due_date, status, created_at")
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(200);
    if (loadError) setError(loadError.message);
    else setTasks((data as Task[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on mount
    load();
  }, [load]);

  async function toggleTask(task: Task) {
    setBusyId(task.id);
    setError(null);
    const nextStatus = task.status === "open" ? "done" : "open";
    const { error: updateError } = await supabase
      .from("crm_tasks")
      .update({ status: nextStatus, completed_at: nextStatus === "done" ? new Date().toISOString() : null })
      .eq("id", task.id);
    setBusyId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    load();
  }

  const today = new Date(new Date().toDateString());
  const visible = tasks.filter((t) => showDone || t.status === "open");
  const openCount = tasks.filter((t) => t.status === "open").length;
  const overdueCount = tasks.filter(
    (t) => t.status === "open" && t.due_date && new Date(t.due_date) < today
  ).length;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-forest">Follow-ups</h2>
          <p className="mt-1 text-sm text-forest-dark/60">
            {openCount} open task{openCount === 1 ? "" : "s"}
            {overdueCount > 0 && <span className="font-semibold text-red-600"> · {overdueCount} overdue</span>}
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-forest-dark/70">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
          Show completed
        </label>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      {loading && <p className="mt-4 text-sm text-forest-dark/60">Loading…</p>}

      {!loading && visible.length === 0 && (
        <p className="mt-4 text-sm text-forest-dark/60">
          No {showDone ? "" : "open "}follow-up tasks. Add one from the CRM panel on any registration record.
        </p>
      )}

      {!loading && visible.length > 0 && (
        <div className="mt-4 space-y-2">
          {visible.map((t) => {
            const overdue = t.status === "open" && t.due_date && new Date(t.due_date) < today;
            return (
              <div
                key={t.id}
                className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${
                  overdue ? "border-red-200 bg-red-50" : "border-forest/10 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.status === "done"}
                  disabled={busyId === t.id}
                  onChange={() => toggleTask(t)}
                />
                <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-forest">
                  {entityTypeLabels[t.entity_type] ?? t.entity_type}
                </span>
                <span className="font-semibold text-forest-dark">{t.entity_label}</span>
                <span className={t.status === "done" ? "text-forest-dark/40 line-through" : "text-forest-dark/80"}>
                  {t.title}
                </span>
                {t.due_date && (
                  <span className={`ml-auto text-xs ${overdue ? "font-semibold text-red-600" : "text-forest-dark/50"}`}>
                    due {formatDate(t.due_date)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

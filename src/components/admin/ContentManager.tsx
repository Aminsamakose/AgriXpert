"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type ContentRow = {
  key: string;
  group_name: string;
  label: string;
  type: "text" | "textarea" | "image";
  value: string;
  sort_order: number;
};

export default function ContentManager() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: qError } = await supabase
      .from("site_content")
      .select("key, group_name, label, type, value, sort_order")
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true });
    if (qError) {
      setError(qError.message);
    } else {
      const loaded = (data ?? []) as ContentRow[];
      setRows(loaded);
      const nextDrafts: Record<string, string> = {};
      for (const row of loaded) nextDrafts[row.key] = row.value;
      setDrafts(nextDrafts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on mount
    load();
  }, [load]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, ContentRow[]>();
    for (const row of rows) {
      if (!byGroup.has(row.group_name)) byGroup.set(row.group_name, []);
      byGroup.get(row.group_name)!.push(row);
    }
    return Array.from(byGroup.entries());
  }, [rows]);

  async function save(row: ContentRow) {
    setSavingKey(row.key);
    setError(null);
    const { error: updateError } = await supabase
      .from("site_content")
      .update({ value: drafts[row.key] ?? "" })
      .eq("key", row.key);
    setSavingKey(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSavedKey(row.key);
    setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, value: drafts[row.key] ?? "" } : r)));
    setTimeout(() => setSavedKey((k) => (k === row.key ? null : k)), 2000);
  }

  async function handleUpload(row: ContentRow, file: File) {
    setUploadingKey(row.key);
    setError(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${row.key}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (uploadError) {
      setUploadingKey(null);
      setError(`Upload failed: ${uploadError.message}. You can still paste an image URL below instead.`);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("site-images").getPublicUrl(path);
    setDrafts((prev) => ({ ...prev, [row.key]: publicUrlData.publicUrl }));
    setUploadingKey(null);
  }

  if (loading) return <p className="mt-6 text-sm text-forest-dark/60">Loading site content…</p>;

  return (
    <div className="mt-6 space-y-10">
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <p className="text-sm text-forest-dark/60">
        Edit the text and images shown on the public site. Changes take effect immediately after saving — no
        redeploy needed.
      </p>
      {groups.map(([groupName, groupRows]) => (
        <div key={groupName}>
          <h3 className="font-heading text-lg font-bold text-forest">{groupName}</h3>
          <div className="mt-4 space-y-5">
            {groupRows.map((row) => (
              <div key={row.key} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-forest-dark" htmlFor={row.key}>
                    {row.label}
                  </label>
                  <div className="flex items-center gap-2">
                    {savedKey === row.key && <span className="text-xs font-semibold text-agri-green">Saved</span>}
                    <button
                      onClick={() => save(row)}
                      disabled={savingKey === row.key || drafts[row.key] === row.value}
                      className="rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-natural-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {savingKey === row.key ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>

                {row.type === "image" ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-[160px_1fr]">
                    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-forest/5 sm:h-28">
                      {drafts[row.key] && (
                        <Image src={drafts[row.key]} alt="" fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        id={row.key}
                        type="text"
                        value={drafts[row.key] ?? ""}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [row.key]: e.target.value }))}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputs.current[row.key]?.click()}
                          disabled={uploadingKey === row.key}
                          className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5 disabled:opacity-40"
                        >
                          {uploadingKey === row.key ? "Uploading…" : "Upload image"}
                        </button>
                        <span className="text-xs text-forest-dark/50">or paste an image URL above</span>
                      </div>
                      <input
                        ref={(el) => {
                          fileInputs.current[row.key] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(row, file);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                ) : row.type === "textarea" ? (
                  <textarea
                    id={row.key}
                    value={drafts[row.key] ?? ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [row.key]: e.target.value }))}
                    rows={3}
                    className="mt-3 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                  />
                ) : (
                  <input
                    id={row.key}
                    type="text"
                    value={drafts[row.key] ?? ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [row.key]: e.target.value }))}
                    className="mt-3 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

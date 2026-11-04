"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type EntityType = "value_chain" | "solution";

type Item = { slug: string; label: string };

export default function PageContentManager({
  entityType,
  items,
  stockImageOptions,
}: {
  entityType: EntityType;
  items: Item[];
  stockImageOptions: { key: string; src: string }[];
}) {
  const [selectedSlug, setSelectedSlug] = useState(items[0]?.slug ?? "");
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = async (slug: string) => {
    setLoading(true);
    setError(null);
    setSaved(false);
    const { data, error: qError } = await supabase
      .from("page_content")
      .select("data")
      .eq("entity_type", entityType)
      .eq("slug", slug)
      .maybeSingle();
    if (qError) {
      setError(qError.message);
    } else {
      setJsonText(JSON.stringify(data?.data ?? {}, null, 2));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSlug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on slug change
      load(selectedSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, entityType]);

  const parsed = useMemo(() => {
    try {
      return JSON.parse(jsonText || "{}");
    } catch {
      return null;
    }
  }, [jsonText]);

  function setField(path: string[], value: unknown) {
    try {
      const obj = JSON.parse(jsonText || "{}");
      let cursor = obj;
      for (let i = 0; i < path.length - 1; i++) {
        if (typeof cursor[path[i]] !== "object" || cursor[path[i]] === null) cursor[path[i]] = {};
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = value;
      setJsonText(JSON.stringify(obj, null, 2));
    } catch {
      // ignore: current JSON is invalid, friendly field edits are disabled until fixed
    }
  }

  function getField(path: string[], fallback = ""): string {
    let cursor: unknown = parsed;
    for (const key of path) {
      if (cursor && typeof cursor === "object") cursor = (cursor as Record<string, unknown>)[key];
      else return fallback;
    }
    return typeof cursor === "string" ? cursor : fallback;
  }

  async function save() {
    if (!parsed) {
      setError("The JSON below has a syntax error — fix it before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    const { error: upsertError } = await supabase
      .from("page_content")
      .upsert({ entity_type: entityType, slug: selectedSlug, data: parsed }, { onConflict: "entity_type,slug" });
    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const heroImageKey = getField(["heroImageKey"]);
  const selectedImage = stockImageOptions.find((o) => o.key === heroImageKey);

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-forest-dark" htmlFor="page-select">
          Page
        </label>
        <select
          id="page-select"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="rounded-lg border border-forest/20 px-3 py-2 text-sm"
        >
          {items.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
        {saved && <span className="text-xs font-semibold text-agri-green">Saved</span>}
        <button
          onClick={save}
          disabled={saving || loading}
          className="ml-auto rounded-full bg-forest px-5 py-2 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      {loading && <p className="text-sm text-forest-dark/60">Loading…</p>}

      {!loading && (
        <>
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-harvest-gold">
              Quick edit
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-forest-dark">Name</label>
                <input
                  value={getField(["name"])}
                  onChange={(e) => setField(["name"], e.target.value)}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-forest-dark">Hero image</label>
                <select
                  value={heroImageKey}
                  onChange={(e) => setField(["heroImageKey"], e.target.value)}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                >
                  {stockImageOptions.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.key}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-forest-dark">Tagline</label>
                <textarea
                  value={getField(["tagline"])}
                  onChange={(e) => setField(["tagline"], e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-forest-dark">Overview heading</label>
                <input
                  value={getField(["overview", "intro"])}
                  onChange={(e) => setField(["overview", "intro"], e.target.value)}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-forest-dark">
                  Overview paragraphs (one per line)
                </label>
                <textarea
                  value={(() => {
                    const arr = (parsed?.overview?.paragraphs ?? []) as string[];
                    return Array.isArray(arr) ? arr.join("\n") : "";
                  })()}
                  onChange={(e) => setField(["overview", "paragraphs"], e.target.value.split("\n"))}
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-forest-dark">Proposition banner</label>
                <input
                  value={getField(["overview", "proposition"])}
                  onChange={(e) => setField(["overview", "proposition"], e.target.value)}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-forest-dark">Closing headline</label>
                <input
                  value={getField(["closing", "headline"])}
                  onChange={(e) => setField(["closing", "headline"], e.target.value)}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-forest-dark">Closing body</label>
                <textarea
                  value={getField(["closing", "body"])}
                  onChange={(e) => setField(["closing", "body"], e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                />
              </div>
            </div>
            {selectedImage && (
              <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl">
                <Image src={selectedImage.src} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-harvest-gold">
              Advanced — full page content (JSON)
            </h3>
            <p className="mt-2 text-xs text-forest-dark/60">
              Every section on this page — sourcing, production coordination, quality specs, who benefits,
              partnerships, call-to-action buttons and more — lives in this JSON. Edit it directly to change or
              reorder bullet points and section copy, then Save. The quick-edit fields above write into this
              same JSON, so they stay in sync.
            </p>
            {!parsed && <p className="mt-2 text-xs font-semibold text-red-600">JSON has a syntax error.</p>}
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={24}
              spellCheck={false}
              className="mt-3 w-full rounded-lg border border-forest/20 px-3 py-2 font-mono text-xs"
            />
          </div>
        </>
      )}
    </div>
  );
}

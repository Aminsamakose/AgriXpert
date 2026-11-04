"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Insight = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  image_url: string;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type Draft = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  image_url: string;
  author: string;
  published: boolean;
};

const emptyDraft: Draft = {
  id: null,
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category: "News",
  image_url: "",
  author: "AgriXpert",
  published: false,
};

const categories = ["News", "Market Report", "Announcement", "Case Study", "Policy & Trade"];

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InsightsManager() {
  const [articles, setArticles] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: qError } = await supabase
      .from("insights")
      .select("*")
      .order("created_at", { ascending: false });
    if (qError) setError(qError.message);
    else setArticles((data ?? []) as Insight[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on mount
    load();
  }, [load]);

  function startCreate() {
    setEditing({ ...emptyDraft });
    setSlugTouched(false);
    setError(null);
  }

  function startEdit(article: Insight) {
    setEditing({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      body: article.body,
      category: article.category,
      image_url: article.image_url,
      author: article.author,
      published: article.published,
    });
    setSlugTouched(true);
    setError(null);
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `insight-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (uploadError) {
      setUploading(false);
      setError(`Upload failed: ${uploadError.message}. You can still paste an image URL below instead.`);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("site-images").getPublicUrl(path);
    setEditing((prev) => (prev ? { ...prev, image_url: publicUrlData.publicUrl } : prev));
    setUploading(false);
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title: editing.title.trim(),
      slug: editing.slug.trim(),
      excerpt: editing.excerpt.trim(),
      body: editing.body,
      category: editing.category,
      image_url: editing.image_url.trim(),
      author: editing.author.trim() || "AgriXpert",
      published: editing.published,
      published_at: editing.published ? new Date().toISOString() : null,
    };

    if (editing.id) {
      // Keep the original published_at if it was already published and stays published.
      const existing = articles.find((a) => a.id === editing.id);
      const published_at =
        editing.published && existing?.published ? existing.published_at : payload.published_at;
      const { error: updateError } = await supabase
        .from("insights")
        .update({ ...payload, published_at })
        .eq("id", editing.id);
      if (updateError) {
        setSaving(false);
        setError(updateError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("insights").insert(payload);
      if (insertError) {
        setSaving(false);
        setError(insertError.message);
        return;
      }
    }

    setSaving(false);
    setEditing(null);
    load();
  }

  async function togglePublished(article: Insight) {
    const nextPublished = !article.published;
    const { error: updateError } = await supabase
      .from("insights")
      .update({
        published: nextPublished,
        published_at: nextPublished ? article.published_at ?? new Date().toISOString() : article.published_at,
      })
      .eq("id", article.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    load();
  }

  async function remove(article: Insight) {
    if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("insights").delete().eq("id", article.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  }

  if (loading) return <p className="mt-6 text-sm text-forest-dark/60">Loading insights…</p>;

  return (
    <div className="mt-6 space-y-6">
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      {!editing && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-forest-dark/60">
            Manage articles, market reports and announcements shown on the public Insights page.
          </p>
          <button
            onClick={startCreate}
            className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-natural-white hover:bg-forest-dark"
          >
            + New Article
          </button>
        </div>
      )}

      {editing && (
        <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-lg font-bold text-forest">
            {editing.id ? "Edit Article" : "New Article"}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-forest-dark">Title</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditing((prev) =>
                    prev
                      ? { ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }
                      : prev
                  );
                }}
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                placeholder="Article title"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-forest-dark">Slug</label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  const slug = slugify(e.target.value);
                  setEditing((prev) => (prev ? { ...prev, slug } : prev));
                }}
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                placeholder="article-url-slug"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-forest-dark">Category</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing((prev) => (prev ? { ...prev, category: e.target.value } : prev))}
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-forest-dark">Author</label>
              <input
                type="text"
                value={editing.author}
                onChange={(e) => setEditing((prev) => (prev ? { ...prev, author: e.target.value } : prev))}
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="published"
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing((prev) => (prev ? { ...prev, published: e.target.checked } : prev))}
                className="h-4 w-4"
              />
              <label htmlFor="published" className="text-sm font-semibold text-forest-dark">
                Published (visible on the public site)
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-forest-dark">Excerpt</label>
              <textarea
                value={editing.excerpt}
                onChange={(e) => setEditing((prev) => (prev ? { ...prev, excerpt: e.target.value } : prev))}
                rows={2}
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                placeholder="Short summary shown on the Insights list page"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-forest-dark">Body</label>
              <textarea
                value={editing.body}
                onChange={(e) => setEditing((prev) => (prev ? { ...prev, body: e.target.value } : prev))}
                rows={10}
                className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                placeholder="Full article content"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-forest-dark">Image</label>
              <div className="mt-1 grid gap-4 sm:grid-cols-[160px_1fr]">
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-forest/5 sm:h-28">
                  {editing.image_url && (
                    <Image src={editing.image_url} alt="" fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editing.image_url}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, image_url: e.target.value } : prev))}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      disabled={uploading}
                      className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5 disabled:opacity-40"
                    >
                      {uploading ? "Uploading…" : "Upload image"}
                    </button>
                    <span className="text-xs text-forest-dark/50">or paste an image URL above</span>
                  </div>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-natural-white hover:bg-forest-dark disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save Article"}
            </button>
            <button
              onClick={cancelEdit}
              className="rounded-full border border-forest/20 px-5 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!editing && (
        <div className="space-y-4">
          {articles.length === 0 && <p className="text-sm text-forest-dark/60">No articles yet.</p>}
          {articles.map((article) => (
            <div key={article.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-forest-dark">{article.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        article.published
                          ? "bg-agri-green/10 text-agri-green"
                          : "bg-forest-dark/5 text-forest-dark/50"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-harvest-gold">{article.category}</p>
                  <p className="text-xs text-forest-dark/50">
                    /{article.slug} &middot; updated {formatDate(article.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(article)}
                    className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                  >
                    {article.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => startEdit(article)}
                    className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest-dark hover:bg-forest/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(article)}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-forest-dark/70">{article.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

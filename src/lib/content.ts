// Server-side helper for reading editable site content (hero text, hero
// images, contact details) that admins manage from /admin. Falls back
// silently to the hardcoded defaults in each page if Supabase is
// unreachable or a key hasn't been seeded yet, so the site never breaks
// because of a missing row.

import { supabase } from "@/lib/supabase";

export type SiteContentMap = Record<string, string>;

export async function getSiteContent(): Promise<SiteContentMap> {
  try {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return {};
    const map: SiteContentMap = {};
    for (const row of data) {
      map[row.key as string] = row.value as string;
    }
    return map;
  } catch {
    return {};
  }
}

export function pick(content: SiteContentMap, key: string, fallback: string): string {
  const value = content[key];
  return value && value.trim().length > 0 ? value : fallback;
}

/** Bulk-fetches all page_content overrides of one entity type, keyed by slug. */
export async function getAllPageContentOverrides<T>(
  entityType: "value_chain" | "solution"
): Promise<Record<string, T>> {
  try {
    const { data, error } = await supabase.from("page_content").select("slug, data").eq("entity_type", entityType);
    if (error || !data) return {};
    const map: Record<string, T> = {};
    for (const row of data) map[row.slug as string] = row.data as T;
    return map;
  } catch {
    return {};
  }
}

/**
 * Full structured content (JSON) for a value-chain or solution detail page,
 * stored in the `page_content` table. Returns null if there's no override
 * yet (or Supabase is unreachable), so the page can fall back to its
 * hardcoded default content.
 */
export async function getPageContentOverride<T>(
  entityType: "value_chain" | "solution",
  slug: string
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("data")
      .eq("entity_type", entityType)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as T;
  } catch {
    return null;
  }
}

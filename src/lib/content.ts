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

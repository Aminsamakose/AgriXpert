import type { MetadataRoute } from "next";
import { valueChains, solutions } from "@/lib/site-data";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://agri-xpert.vercel.app";

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/what-we-do", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.8, changeFrequency: "monthly" },
  { path: "/value-chains", priority: 0.8, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.7, changeFrequency: "daily" },
  { path: "/for-farmers", priority: 0.7, changeFrequency: "monthly" },
  { path: "/for-buyers", priority: 0.7, changeFrequency: "monthly" },
  { path: "/partnerships", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
];

async function getPublishedInsightSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  try {
    const { data, error } = await supabase.from("insights").select("slug, updated_at").eq("published", true);
    if (error || !data) return [];
    return data as { slug: string; updated_at: string }[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insightSlugs = await getPublishedInsightSlugs();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (const vc of valueChains) {
    entries.push({
      url: `${SITE_URL}/value-chains/${vc.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const s of solutions) {
    entries.push({
      url: `${SITE_URL}/solutions/${s.anchor}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const article of insightSlugs) {
    entries.push({
      url: `${SITE_URL}/insights/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}

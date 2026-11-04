import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export const instant = false;

export const metadata: Metadata = {
  title: "Insights | AgriXpert",
};

type InsightRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  author: string;
  published_at: string | null;
  created_at: string;
};

async function getPublishedInsights(): Promise<InsightRow[]> {
  try {
    const { data, error } = await supabase
      .from("insights")
      .select("slug, title, excerpt, category, image_url, author, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data as InsightRow[];
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function InsightsPage() {
  const content = await getSiteContent();
  const articles = await getPublishedInsights();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={pick(content, "insights.hero.title", "Industry news, market intelligence and knowledge")}
        description={pick(
          content,
          "insights.hero.description",
          "Market reports, project updates and announcements from across AgriXpert's agricultural value chains."
        )}
        image={{ src: pick(content, "insights.hero.image", stockImages.dataCharts.src), alt: stockImages.dataCharts.alt }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        {articles.length === 0 ? (
          <p className="text-center text-forest-dark/70">
            Articles, market reports and announcements will be published here. No content has been added yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="group overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-44 w-full overflow-hidden bg-forest/5">
                  {article.image_url && (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-forest-dark/80 px-3 py-1 text-xs font-semibold text-natural-white">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-forest-dark/50">
                    {formatDate(article.published_at ?? article.created_at)} &middot; {article.author}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-forest">{article.title}</h3>
                  <p className="mt-2 text-sm text-forest-dark/70">{article.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-agri-green">Read More &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

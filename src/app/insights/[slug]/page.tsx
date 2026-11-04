import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";
import { supabase } from "@/lib/supabase";

export const instant = false;

type InsightArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  image_url: string;
  author: string;
  published_at: string | null;
  created_at: string;
};

async function getInsight(slug: string): Promise<InsightArticle | null> {
  try {
    const { data, error } = await supabase
      .from("insights")
      .select("slug, title, excerpt, body, category, image_url, author, published_at, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as InsightArticle;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsight(slug);
  return { title: article ? `${article.title} | AgriXpert Insights` : "Insights | AgriXpert" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getInsight(slug);

  if (!article) {
    notFound();
  }

  const heroImage = article.image_url
    ? { src: article.image_url, alt: article.title }
    : stockImages.dataCharts;

  return (
    <>
      <PageHero eyebrow={article.category} title={article.title} image={heroImage} />

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <Link href="/insights" className="text-sm font-semibold text-agri-green hover:underline">
          &larr; Back to Insights
        </Link>

        <p className="mt-6 text-xs uppercase tracking-wide text-forest-dark/50">
          {formatDate(article.published_at ?? article.created_at)} &middot; {article.author}
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-forest sm:text-3xl">{article.title}</h1>
        <p className="mt-4 text-lg text-forest-dark/70">{article.excerpt}</p>

        {article.image_url && (
          <div className="relative mt-8 h-64 overflow-hidden rounded-2xl sm:h-80">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8 space-y-4 whitespace-pre-line text-forest-dark/80">{article.body}</div>

        <div className="mt-16 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <h2 className="font-heading text-xl font-bold">Stay Informed on Agricultural Value Chains</h2>
          <p className="mx-auto mt-3 max-w-xl text-natural-white/80">
            Explore more insights, or get in touch to discuss opportunities with AgriXpert.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-4">
            <Link
              href="/insights"
              className="rounded-full bg-natural-white px-6 py-3 text-sm font-semibold text-forest-dark hover:bg-natural-white/90"
            >
              More Insights
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

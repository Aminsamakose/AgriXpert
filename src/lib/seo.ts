import type { Metadata } from "next";

const SITE_URL = "https://agri-xpert.vercel.app";
const SITE_NAME = "AgriXpert";

/**
 * Builds consistent page-level metadata (title, description, canonical URL,
 * Open Graph and Twitter card) for a static or dynamic page. `path` should
 * start with "/" (e.g. "/about", "/value-chains/maize").
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string };
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: image ? [{ url: image.src, width: 1200, height: 630, alt: image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image.src] : undefined,
    },
  };
}

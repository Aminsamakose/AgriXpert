import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { stockImages } from "@/lib/site-data";

const SITE_URL = "https://agri-xpert.vercel.app";
const SITE_NAME = "AgriXpert";
const DEFAULT_TITLE = "AgriXpert | Connecting Agricultural Production to Profitable Markets";
const DEFAULT_DESCRIPTION =
  "AgriXpert builds commercially sustainable agricultural supply chains by connecting farmers, agricultural service providers, processors and buyers through coordinated production, aggregation, value addition and market access.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: stockImages.cropFieldsAerial.src, width: 1200, height: 630, alt: stockImages.cropFieldsAerial.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [stockImages.cropFieldsAerial.src],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-natural-white text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

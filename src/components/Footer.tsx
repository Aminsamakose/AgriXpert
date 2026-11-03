import Link from "next/link";
import { footerColumns } from "@/lib/site-data";

// Static on purpose: Next.js 16's Cache Components treats `new Date()` as a
// dynamic value that blocks static prerendering of this page. Bump manually
// each January, or revisit if this page needs to be dynamic for another reason.
const COPYRIGHT_YEAR = 2026;

export default function Footer() {
  const year = COPYRIGHT_YEAR;

  return (
    <footer className="mt-auto border-t border-forest/10 bg-forest-dark text-natural-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-harvest-gold">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-natural-white/80 transition-colors hover:text-natural-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-natural-white/10 pt-6 text-xs text-natural-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} AgriXpert. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-natural-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-natural-white">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-natural-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

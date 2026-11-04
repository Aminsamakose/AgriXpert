import Image from "next/image";
import Link from "next/link";
import { navLinks, portalCta } from "@/lib/site-data";
import logo from "../../public/logo.png";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-natural-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center">
          <Image src={logo} alt="AgriXpert" className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-forest-dark/80 transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={portalCta.href}
          className="shrink-0 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white transition-colors hover:bg-forest-dark"
        >
          {portalCta.label}
        </Link>
      </div>

      {/* Mobile nav: simple wrap list, no JS menu for Phase 1 */}
      <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-forest/10 px-6 py-3 lg:hidden">
        {navLinks.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-forest-dark/80 hover:text-forest"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

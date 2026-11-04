import Link from "next/link";

export default function ValueChainCtas({ commodity }: { commodity: string }) {
  const q = encodeURIComponent(commodity);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link
        href={`/for-farmers?commodity=${q}#register`}
        className="rounded-2xl bg-forest px-6 py-5 text-center text-sm font-semibold text-natural-white transition hover:bg-forest-dark"
      >
        I Want to Produce
        <span className="mt-1 block text-xs font-normal text-natural-white/70">Register as a {commodity.toLowerCase()} farmer</span>
      </Link>
      <Link
        href={`/for-buyers?commodity=${q}#enquiry`}
        className="rounded-2xl bg-harvest-gold px-6 py-5 text-center text-sm font-semibold text-forest-dark transition hover:bg-harvest-gold/90"
      >
        I Want to Buy
        <span className="mt-1 block text-xs font-normal text-forest-dark/70">Submit a sourcing request</span>
      </Link>
      <Link
        href={`/contact?type=${encodeURIComponent("Partnership & Investment")}&commodity=${q}#form`}
        className="rounded-2xl border-2 border-forest bg-white px-6 py-5 text-center text-sm font-semibold text-forest transition hover:bg-forest/5"
      >
        I Want to Partner
        <span className="mt-1 block text-xs font-normal text-forest/70">Explore a commercial partnership</span>
      </Link>
    </div>
  );
}

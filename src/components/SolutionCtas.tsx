import Link from "next/link";

type SolutionCta = { label: string; sub: string; href: string };

export default function SolutionCtas({ ctas }: { ctas: SolutionCta[] }) {
  const palettes = [
    "bg-forest text-natural-white hover:bg-forest-dark",
    "bg-harvest-gold text-forest-dark hover:bg-harvest-gold/90",
    "border-2 border-natural-white bg-transparent text-natural-white hover:bg-natural-white/10",
    "border-2 border-natural-white bg-transparent text-natural-white hover:bg-natural-white/10",
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ctas.map((cta, i) => (
        <Link
          key={cta.label}
          href={cta.href}
          className={`rounded-2xl px-6 py-5 text-center text-sm font-semibold transition ${palettes[i % palettes.length]}`}
        >
          {cta.label}
          <span className="mt-1 block text-xs font-normal opacity-70">{cta.sub}</span>
        </Link>
      ))}
    </div>
  );
}

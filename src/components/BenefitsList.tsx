import { CircleCheck } from "lucide-react";

/**
 * A simple line-icon list, in place of plain colored-dot bullets — closer
 * to the hand-drawn/line-icon treatment used by editorial NGO sites than
 * a generic SaaS bullet list.
 */
export default function BenefitsList({
  items,
  variant = "light",
  tone = "forest",
}: {
  items: readonly string[];
  /** "light" = dark text for light/card backgrounds, "dark" = light text for dark backgrounds */
  variant?: "light" | "dark";
  /** Icon/accent color */
  tone?: "forest" | "harvest-gold" | "agri-green";
}) {
  const textColor = variant === "dark" ? "text-natural-white/85" : "text-forest-dark/80";
  const iconColor = tone === "harvest-gold" ? "text-harvest-gold" : tone === "agri-green" ? "text-agri-green" : "text-forest";

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 text-sm ${textColor}`}>
          <CircleCheck aria-hidden className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} strokeWidth={1.5} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

import {
  Award,
  BadgeCheck,
  Briefcase,
  Gem,
  Handshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/** Peta nama ikon (dipakai di data layer) → komponen lucide. */
const ICONS: Record<string, LucideIcon> = {
  gem: Gem,
  "shield-check": ShieldCheck,
  award: Award,
  handshake: Handshake,
  briefcase: Briefcase,
  "badge-check": BadgeCheck,
};

export function ValueIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Gem;
  return <Cmp className={className} aria-hidden />;
}

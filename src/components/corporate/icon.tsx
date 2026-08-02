import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Gem,
  Handshake,
  Ship,
  ShieldCheck,
  Stethoscope,
  UtensilsCrossed,
  Users,
  Wheat,
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
  building: Building2,
  ship: Ship,
  stethoscope: Stethoscope,
  wheat: Wheat,
  utensils: UtensilsCrossed,
  users: Users,
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

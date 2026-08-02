import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Gem,
  Globe,
  Handshake,
  Package,
  Scale,
  Ship,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Tag,
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
  sprout: Sprout,
  tag: Tag,
  package: Package,
  globe: Globe,
  scale: Scale,
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

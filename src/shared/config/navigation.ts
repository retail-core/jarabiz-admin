import { Ellipsis, Layers, Package, Plus, type LucideIcon } from "lucide-react";
import type { Role } from "@/shared/lib/auth";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Omit = every authenticated role. */
  roles?: readonly Role[];
  /** Sidebar section heading. */
  group: string;
  /** Position in the mobile bottom nav (1-based). Omit = not in bottom nav. */
  mobileSlot?: number;
  /** Rendered prominent (center button on mobile). */
  primary?: boolean;
}

/**
 * Single source of truth for both navs.
 * To add a module: append items with a new `group` and `roles`.
 * Brands and Dashboard are intentionally omitted until built.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  {
    id: "products",
    label: "Products",
    href: "/products",
    icon: Package,
    group: "Catalog",
    mobileSlot: 1,
  },
  {
    id: "add",
    label: "Add",
    href: "/products/new",
    icon: Plus,
    group: "Catalog",
    mobileSlot: 2,
    primary: true,
  },
  {
    id: "categories",
    label: "Categories",
    href: "/products/categories",
    icon: Layers,
    group: "Catalog",
    mobileSlot: 3,
  },
];

/** Fourth bottom-nav slot. Opens the More sheet (Settings, theme, logout). */
export const MORE_ITEM = { id: "more", label: "More", icon: Ellipsis } as const;

const allowed = (item: NavItem, role: Role) =>
  !item.roles || item.roles.includes(role);

export function getNavForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => allowed(item, role));
}

export function getMobileTabs(role: Role): NavItem[] {
  return getNavForRole(role)
    .filter((item) => item.mobileSlot !== undefined)
    .sort((a, b) => a.mobileSlot! - b.mobileSlot!);
}

export function getSidebarGroups(
  role: Role,
): { label: string; items: NavItem[] }[] {
  const groups = new Map<string, NavItem[]>();
  for (const item of getNavForRole(role)) {
    groups.set(item.group, [...(groups.get(item.group) ?? []), item]);
  }
  return [...groups].map(([label, items]) => ({ label, items }));
}

/** Add/edit screens: bottom nav hidden, only the Save bar shows. */
const FULLSCREEN_ROUTES = [/^\/products\/new$/, /^\/products\/[^/]+\/edit$/];

export const isFullscreenRoute = (pathname: string) =>
  FULLSCREEN_ROUTES.some((pattern) => pattern.test(pathname));

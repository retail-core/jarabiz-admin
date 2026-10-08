import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Boxes} from "lucide-react";

export const DASHBOARD_NAV = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Products',
    icon: ShoppingBag,
    children: [
      { name: 'Catalog', href: '/products', icon: ShoppingBag }, // Main List
      { name: 'Categories', href: '/products/categories', icon: Layers },
      { name: 'Brands', href: '/products/brands', icon: Boxes },
    ],
  },
];
const ROUTE_META = [
  { path: "/login", title: "Login", description: "Retailer login" },
  { path: "/register", title: "Register", description: "Retailer registration" },
  { path: "/", title: "Dashboard", description: "Analytics overview" },
  { path: "/products", title: "Products", description: "Product management" },
  { path: "/products/new", title: "New Product", description: "Create product" },
  { path: "/products/:id/edit", title: "Edit Product", description: "Update product" },
  { path: "/orders", title: "Orders", description: "Order management" },
  { path: "/orders/:id", title: "Order Detail", description: "Order details" },
  { path: "/coupons", title: "Coupons", description: "Coupon management" },
  { path: "/coupons/new", title: "New Coupon", description: "Create coupon" },
  { path: "/coupons/:id/edit", title: "Edit Coupon", description: "Update coupon" },
  { path: "/bundles", title: "Bundles", description: "Bundle management" },
  { path: "/bundles/new", title: "New Bundle", description: "Create bundle" },
  { path: "/bundles/:id/edit", title: "Edit Bundle", description: "Update bundle" },
  { path: "/categories", title: "Categories", description: "Category management" },
  { path: "/store", title: "Store Settings", description: "Store profile & settings" },
];

function matchRoute(pathname, pattern) {
  if (pattern.includes(":")) {
    const regex = new RegExp("^" + pattern.replace(/:id/g, "[^/]+") + "$");
    return regex.test(pathname);
  }
  return pathname === pattern;
}

export function getPageMeta(pathname) {
  const matched = ROUTE_META.find((r) => matchRoute(pathname, r.path));
  const base = matched || { title: "DiObral Admin", description: "Retailer dashboard" };
  return {
    title: `${base.title} | DiObral Admin`,
    description: base.description,
  };
}

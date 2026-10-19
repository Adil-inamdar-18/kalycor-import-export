export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalycorexport.com";
export const SHOW_PLACEHOLDERS =
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false";

export const site = {
  name: "Kalycor Import & Export",
  description:
    "Kalycor Import & Export connects products with markets through international import, export and product trading.",
  contact: {
    phone: "+00 000 000 0000",
    email: "hello@kalycorexport.com",
    location: "Business address to be confirmed",
  },
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

export const businesses = [
  {
    name: "Kalycor Agriculture",
    href:
      process.env.NEXT_PUBLIC_AGRICULTURE_URL ??
      "https://kalycoragriculture.com",
    blurb: "Seeds, products and the crop lifecycle.",
  },
  {
    name: "Kalycor Real Estate",
    href:
      process.env.NEXT_PUBLIC_REAL_ESTATE_URL ??
      "https://kalycorrealestate.com",
    blurb: "Buy, sell, invest and manage property.",
  },
  {
    name: "Kalycor Import & Export",
    href: SITE_URL,
    current: true,
    blurb: "Products connected to markets.",
  },
  {
    name: "Kalycor Services",
    href: process.env.NEXT_PUBLIC_SERVICES_URL ?? "https://kalycorservices.com",
    blurb: "Security and commercial services.",
  },
] as { name: string; href: string; blurb: string; current?: boolean }[];

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Import", href: "/import" },
  { label: "Export", href: "/export" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Product Categories", href: "/product-categories" },
    ],
  },
  {
    label: "Trade",
    href: "/global-markets",
    children: [
      { label: "Global Markets", href: "/global-markets" },
      { label: "Logistics / Supply", href: "/logistics" },
      { label: "Quality & Compliance", href: "/quality-compliance" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export type Category = {
  slug: string;
  name: string;
  text: string;
  color: string;
};
export const categories: Category[] = [
  {
    slug: "electronics",
    name: "Electronics",
    text: "Electronic goods sourced and traded for import and export.",
    color: "#1F5489",
  },
  {
    slug: "furniture",
    name: "Furniture",
    text: "Furniture for homes, offices and commercial spaces.",
    color: "#9E3512",
  },
  {
    slug: "machinery",
    name: "Machinery",
    text: "Machines and machinery for trade customers.",
    color: "#2C8596",
  },
  {
    slug: "crockery",
    name: "Crockery",
    text: "Crockery for households and hospitality.",
    color: "#C8481C",
  },
  {
    slug: "clothing",
    name: "Clothing",
    text: "Clothing ranges for international buyers.",
    color: "#163F6A",
  },
  {
    slug: "footwear",
    name: "Footwear",
    text: "Footwear sourced for import and export.",
    color: "#6E3B1E",
  },
  {
    slug: "stationery",
    name: "Stationery",
    text: "Stationery for offices, schools and retail.",
    color: "#0F2D4D",
  },
  {
    slug: "plywood",
    name: "Plywood",
    text: "Plywood for construction and furnishing use.",
    color: "#8A5A2B",
  },
  {
    slug: "vegetables",
    name: "Vegetables",
    text: "Fresh vegetables moved with care for time and handling.",
    color: "#2F7D4F",
  },
  {
    slug: "kitchenware",
    name: "Kitchenware",
    text: "Kitchenware for homes and commercial kitchens.",
    color: "#3C4F63",
  },
];

export type Product = {
  name: string;
  category: Category["slug"];
  summary: string;
};
export const products: Product[] = [];

export const services = [
  {
    title: "Import",
    text: "Bringing products into the market from international suppliers.",
    confirmed: true,
  },
  {
    title: "Export",
    text: "Taking products to international buyers.",
    confirmed: true,
  },
  {
    title: "Product sourcing",
    text: "Finding the right supplier for the product you need.",
    confirmed: false,
  },
  {
    title: "Supply",
    text: "Regular supply against your requirements.",
    confirmed: false,
  },
  {
    title: "Distribution",
    text: "Getting products to the people who need them.",
    confirmed: false,
  },
];

export const importSteps = [
  {
    title: "Define the product",
    text: "You tell us what you need, in what quantity and by when.",
  },
  {
    title: "Find the supplier",
    text: "We source and shortlist suppliers for the product.",
  },
  {
    title: "Check quality",
    text: "Samples and product details are reviewed before commitment.",
  },
  {
    title: "Arrange documents",
    text: "Paperwork for the shipment is prepared and checked.",
  },
  {
    title: "Ship and clear",
    text: "Goods move through transport and customs.",
  },
  { title: "Deliver", text: "Products arrive where you need them." },
];
export const exportSteps = [
  {
    title: "Understand the buyer’s need",
    text: "We confirm the product, quantity and destination requirements.",
  },
  {
    title: "Prepare the product",
    text: "Goods are sourced, checked and packed for transport.",
  },
  {
    title: "Arrange documents",
    text: "Export paperwork is prepared and checked.",
  },
  {
    title: "Book transport",
    text: "Shipping is arranged to suit the product and timeline.",
  },
  {
    title: "Ship and track",
    text: "The shipment moves and the buyer is kept informed.",
  },
  { title: "Hand over", text: "Goods are delivered to the agreed point." },
];

export const tradeProcess = [
  {
    id: "sourcing",
    name: "Sourcing",
    text: "Identify where the product can be obtained.",
  },
  {
    id: "supplier",
    name: "Supplier coordination",
    text: "Stay in contact with suppliers on terms and timing.",
  },
  {
    id: "quality",
    name: "Quality check",
    text: "Review the product against what was agreed.",
  },
  {
    id: "docs",
    name: "Documentation",
    text: "Prepare and verify the paperwork.",
  },
  { id: "logistics", name: "Logistics", text: "Plan and book the transport." },
  {
    id: "trade",
    name: "Import / Export",
    text: "Move the goods across the border.",
  },
  { id: "delivery", name: "Delivery", text: "Hand the goods to the customer." },
];

export type Market = {
  name: string;
  lon?: number;
  lat?: number;
  note?: string;
};
export const homeBase: Market | null = null;
export const markets: Market[] = [
  { name: "Market one (to be confirmed)" },
  { name: "Market two (to be confirmed)" },
  { name: "Market three (to be confirmed)" },
];

export const logistics = [
  {
    title: "Transport planning",
    text: "Choosing a route and mode that suits the product.",
  },
  {
    title: "Warehousing and storage",
    text: "Describe storage arrangements once confirmed.",
  },
  {
    title: "Documentation flow",
    text: "How paperwork moves with the shipment.",
  },
  {
    title: "Tracking and updates",
    text: "How customers are kept informed during transit.",
  },
];
export const quality = [
  {
    title: "Product checks",
    text: "Describe the checks carried out before shipment, once confirmed.",
  },
  {
    title: "Documentation accuracy",
    text: "Describe how documents are verified, once confirmed.",
  },
  {
    title: "Regulatory requirements",
    text: "Describe how import and export rules are handled, once confirmed.",
  },
];
export const why = [
  {
    title: "Product range",
    text: "Ten product categories, ready to grow as the catalogue expands.",
  },
  {
    title: "Reliable sourcing",
    text: "Editable: describe the sourcing approach the business actually uses.",
  },
  {
    title: "Professional coordination",
    text: "Editable: describe how suppliers, documents and transport are coordinated.",
  },
  {
    title: "Quality focus",
    text: "Editable: describe the quality practices the business follows.",
  },
  {
    title: "International approach",
    text: "Editable: describe the markets and relationships once confirmed.",
  },
];

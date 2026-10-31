export interface BundleItemDef {
  productId: string;
  defaultQty: number;
  productName: string;
  hasVariants?: boolean;
  variantOptions?: { id: string; name: string }[];
}

export interface BundleDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  items: BundleItemDef[];
}

export const POPULAR_BUNDLES: BundleDef[] = [
  {
    id: "BUNDLE-DIWALI-FAMILY-18",
    name: "Diwali Family Pack (18 Varieties)",
    tagline: "Our most requested all-in-one family celebration combo",
    description: "Carefully curated mix of sparkling pots, sound crackers, ground chakkars, sparkles, and sky shots.",
    items: [
      { productId: "PRD-106", defaultQty: 2, productName: "CAT 100 BIJILI Green" },
      { productId: "PRD-098", defaultQty: 2, productName: "DPM 30CM SADA pipe" },
      { productId: "PRD-100", defaultQty: 2, productName: "DPM 15CM COLOR pipe" },
      { productId: "PRD-099", defaultQty: 2, productName: "DPM 30CM COLOR pipe" },
      { productId: "PRD-001", defaultQty: 5, productName: "MU 2.75 Bird" },
      { productId: "PRD-003", defaultQty: 3, productName: "MU 4\" Lakshmi" },
      { productId: "PRD-005", defaultQty: 2, productName: "W.G 4\" Gold DLX Lakshmi" },
      { productId: "PRD-007", defaultQty: 1, productName: "DPM FP Big" },
      {
        productId: "PRD-009",
        defaultQty: 1,
        productName: "FP Asoka (Flower Pot)",
        hasVariants: true,
        variantOptions: [
          { id: "PRD-009", name: "JRB FP Asoka (₹250)" },
          { id: "PRD-010", name: "WG FP Asoka (₹250)" },
          { id: "PRD-011", name: "Kamadhenu FP Asoka (₹250)" },
          { id: "PRD-012", name: "Lord FP Asoka (Brand) (₹275)" }
        ]
      },
      { productId: "PRD-015", defaultQty: 1, productName: "VML DLX COLOR KOTI FP" },
      { productId: "PRD-019", defaultQty: 1, productName: "INDHU Mega Bullet Bomb" },
      { productId: "PRD-021", defaultQty: 1, productName: "Cat Atom DLX Bomb" },
      {
        productId: "PRD-060",
        defaultQty: 2,
        productName: "GC Big (Ground Chakkar)",
        hasVariants: true,
        variantOptions: [
          { id: "PRD-059", name: "R.G GC Big 10 pcs (₹70)" },
          { id: "PRD-060", name: "SV GC Big (₹210)" },
          { id: "PRD-061", name: "MU GC Big 25 pcs (₹210)" }
        ]
      },
      { productId: "PRD-065", defaultQty: 1, productName: "DPM GC Dlx" },
      { productId: "PRD-070", defaultQty: 15, productName: "Loose 4F T-Star Thread" },
      {
        productId: "PRD-073",
        defaultQty: 1,
        productName: "Pencil Sparkler",
        hasVariants: true,
        variantOptions: [
          { id: "PRD-073", name: "MU 10\" Pencil (₹120)" },
          { id: "PRD-074", name: "Vel 15\" Pencil (₹220)" }
        ]
      },
      { productId: "PRD-075", defaultQty: 1, productName: "1.25 comet (small sky shot)" },
      { productId: "PRD-085", defaultQty: 2, productName: "Turkey 28 Wala" }
    ]
  },
  {
    id: "BUNDLE-SMALL-COMBO-10",
    name: "SMALL COMBO",
    tagline: "Essential festive pack (10 Varieties)",
    description: "Compact budget combo featuring Bijili, sparkles, flower pots, ground chakkars, crackers, pencil sparklers, and sky shot.",
    items: [
      { productId: "PRD-106", defaultQty: 2, productName: "CAT 100 BIJILI Green" },
      { productId: "PRD-098", defaultQty: 1, productName: "DPM 30CM SADA pipe" },
      { productId: "PRD-100", defaultQty: 2, productName: "DPM 15CM COLOR pipe" },
      {
        productId: "PRD-009",
        defaultQty: 1,
        productName: "FP Asoka (Flower Pot)",
        hasVariants: true,
        variantOptions: [
          { id: "PRD-009", name: "JRB FP Asoka (₹250)" },
          { id: "PRD-010", name: "WG FP Asoka (₹250)" },
          { id: "PRD-011", name: "Kamadhenu FP Asoka (₹250)" },
          { id: "PRD-012", name: "Lord FP Asoka (Brand) (₹275)" }
        ]
      },
      {
        productId: "PRD-060",
        defaultQty: 1,
        productName: "GC Big (Ground Chakkar)",
        hasVariants: true,
        variantOptions: [
          { id: "PRD-059", name: "R.G GC Big 10 pcs (₹70)" },
          { id: "PRD-060", name: "SV GC Big (₹210)" },
          { id: "PRD-061", name: "MU GC Big 25 pcs (₹210)" }
        ]
      },
      { productId: "PRD-001", defaultQty: 5, productName: "MU 2.75 Bird" },
      { productId: "PRD-003", defaultQty: 2, productName: "MU 4\" Lakshmi" },
      { productId: "PRD-070", defaultQty: 5, productName: "Loose 4F T-Star Thread" },
      { productId: "PRD-074", defaultQty: 1, productName: "Vel 15\" Pencil" },
      { productId: "PRD-075", defaultQty: 1, productName: "1.25 comet (small sky shot)" }
    ]
  }
];

// Master 107 Authoritative Fireworks Catalog for Bheema Fireworks POS
// Sourced and verified from "Bheema final list.pdf"

export interface Product {
  id: string;
  serialNo: number;
  name: string;
  category: string;
  sellingPrice: number;
  aliases: string[];
  imageUrl?: string | null;
}

export const CATEGORIES: string[] = [
  "All",
  "Lakshmi / Bird / Jalli Kattu",
  "FP",
  "Atom / Bullet / Naraout",
  "Fancy",
  "GC",
  "T-Star / Thread",
  "Pencil",
  "Comet / Shot",
  "Wala",
  "Rocket",
  "Pipe",
  "Other / Unclassified"
];

export const MASTER_PRODUCTS: Product[] = [
  {
    "id": "PRD-001",
    "serialNo": 1,
    "name": "MU 2.75 Bird",
    "category": "Lakshmi / Bird / Jalli Kattu",
    "sellingPrice": 15,
    "aliases": [
      "75",
      "mu",
      "bird",
      "lakshmi"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-002",
    "serialNo": 2,
    "name": "W.G 3½ Lakshmi",
    "category": "Lakshmi / Bird / Jalli Kattu",
    "sellingPrice": 31,
    "aliases": [
      "lakshmi",
      "3½"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-003",
    "serialNo": 3,
    "name": "MU 4\" Lakshmi",
    "category": "Lakshmi / Bird / Jalli Kattu",
    "sellingPrice": 40,
    "aliases": [
      "lakshmi",
      "mu"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-004",
    "serialNo": 4,
    "name": "MU 4\" Jumbo DLX laksmi",
    "category": "Lakshmi / Bird / Jalli Kattu",
    "sellingPrice": 63,
    "aliases": [
      "laksmi",
      "dlx",
      "jumbo",
      "mu",
      "lakshmi"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-005",
    "serialNo": 5,
    "name": "W.G 4\" Gold DLX Lakshmi",
    "category": "Lakshmi / Bird / Jalli Kattu",
    "sellingPrice": 81,
    "aliases": [
      "dlx",
      "lakshmi",
      "gold"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-006",
    "serialNo": 6,
    "name": "Mithra’s 5\" Jalli Kattu",
    "category": "Lakshmi / Bird / Jalli Kattu",
    "sellingPrice": 138,
    "aliases": [
      "kattu",
      "mithra’s",
      "jalli",
      "lakshmi"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-007",
    "serialNo": 7,
    "name": "DPM FP Big",
    "category": "FP",
    "sellingPrice": 245,
    "aliases": [
      "dpm",
      "fp",
      "big"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-008",
    "serialNo": 8,
    "name": "Swathik FP SPl",
    "category": "FP",
    "sellingPrice": 277,
    "aliases": [
      "swathik",
      "fp",
      "spl"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-009",
    "serialNo": 9,
    "name": "JRB FP Asoka",
    "category": "FP",
    "sellingPrice": 331,
    "aliases": [
      "jrb",
      "asoka",
      "fp"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-010",
    "serialNo": 10,
    "name": "WG FP Asoka",
    "category": "FP",
    "sellingPrice": 331,
    "aliases": [
      "fp",
      "wg",
      "asoka"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-011",
    "serialNo": 11,
    "name": "Kamadhenu FP Asoka",
    "category": "FP",
    "sellingPrice": 331,
    "aliases": [
      "kamadhenu",
      "fp",
      "asoka"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-012",
    "serialNo": 12,
    "name": "Lord FP Asoka (Brand)",
    "category": "FP",
    "sellingPrice": 363,
    "aliases": [
      "(brand)",
      "lord",
      "fp",
      "asoka"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-013",
    "serialNo": 13,
    "name": "WG Color Koti FP",
    "category": "FP",
    "sellingPrice": 529,
    "aliases": [
      "koti",
      "color",
      "fp",
      "wg"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-014",
    "serialNo": 14,
    "name": "Cat color koti FP (Brand)",
    "category": "FP",
    "sellingPrice": 728,
    "aliases": [
      "koti",
      "(brand)",
      "cat",
      "fp",
      "color"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-015",
    "serialNo": 15,
    "name": "VML DLX COLOR KOTI FP",
    "category": "FP",
    "sellingPrice": 892,
    "aliases": [
      "vml",
      "dlx",
      "koti",
      "fp",
      "color"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-016",
    "serialNo": 16,
    "name": "small kundalu(5pcs)",
    "category": "FP",
    "sellingPrice": 661,
    "aliases": [
      "small kundalu",
      "kundalu",
      "kunda",
      "5pcs",
      "pack",
      "gift",
      "small",
      "fp",
      "gd"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-017",
    "serialNo": 17,
    "name": "big kundalu(2pcs)",
    "category": "FP",
    "sellingPrice": 800,
    "aliases": [
      "big kundalu",
      "kundalu",
      "kunda",
      "2pcs",
      "pack",
      "gift",
      "fp",
      "gd",
      "big"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-018",
    "serialNo": 18,
    "name": "Naraout Big",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 81,
    "aliases": [
      "naraout",
      "big",
      "atom"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-019",
    "serialNo": 19,
    "name": "INDHU Mega Bullet Bomb",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 115,
    "aliases": [
      "mega",
      "bomb",
      "bullet",
      "indhu",
      "atom"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-020",
    "serialNo": 20,
    "name": "MU White Tiger Bomb",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 316,
    "aliases": [
      "bomb",
      "white",
      "tiger",
      "mu",
      "atom"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-021",
    "serialNo": 21,
    "name": "Cat Atom DLX Bomb",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 460,
    "aliases": [
      "dlx",
      "bomb",
      "cat",
      "atom"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-022",
    "serialNo": 22,
    "name": "AND Mighty Atom Bomb",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 747,
    "aliases": [
      "bomb",
      "mighty",
      "atom",
      "and"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-023",
    "serialNo": 23,
    "name": "Sethji Aandhi Tufan Atom Bomb",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 805,
    "aliases": [
      "aandhi",
      "tufan",
      "sethji",
      "atom",
      "bomb"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-024",
    "serialNo": 24,
    "name": "1/2 paper Bomb Multicolor (5 pcs) Atom",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 207,
    "aliases": [
      "pcs)",
      "atom",
      "multicolor",
      "bomb",
      "(5",
      "1/2",
      "paper"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-025",
    "serialNo": 25,
    "name": "Damo Smart Candle Fancy",
    "category": "Fancy",
    "sellingPrice": 121,
    "aliases": [
      "damo",
      "smart",
      "candle",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-026",
    "serialNo": 26,
    "name": "Darbar Angry Birds Fancy",
    "category": "Fancy",
    "sellingPrice": 221,
    "aliases": [
      "darbar",
      "birds",
      "angry",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-027",
    "serialNo": 27,
    "name": "SV Tim Tam Fancy",
    "category": "Fancy",
    "sellingPrice": 248,
    "aliases": [
      "tam",
      "sv",
      "tim",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-028",
    "serialNo": 28,
    "name": "DG GC Special",
    "category": "GC",
    "sellingPrice": 275,
    "aliases": [
      "dg",
      "gc",
      "spl",
      "special",
      "ground",
      "chakkar",
      "chakra",
      "dg gc",
      "dg gc spl"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-029",
    "serialNo": 29,
    "name": "Ayyan Photo Flash Fancy",
    "category": "Fancy",
    "sellingPrice": 304,
    "aliases": [
      "flash",
      "ayyan",
      "photo",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-030",
    "serialNo": 30,
    "name": "MU Ganga Jamuna Fancy",
    "category": "Fancy",
    "sellingPrice": 304,
    "aliases": [
      "jamuna",
      "ganga",
      "mu",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-031",
    "serialNo": 31,
    "name": "Vetri Helicopter Fancy",
    "category": "Fancy",
    "sellingPrice": 331,
    "aliases": [
      "helicopter",
      "vetri",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-032",
    "serialNo": 32,
    "name": "Lord Butterfly Fancy",
    "category": "Fancy",
    "sellingPrice": 386,
    "aliases": [
      "lord",
      "butterfly",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-033",
    "serialNo": 33,
    "name": "Ayyan Top Tucker Fancy",
    "category": "Fancy",
    "sellingPrice": 386,
    "aliases": [
      "fancy",
      "ayyan",
      "tucker",
      "top"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-034",
    "serialNo": 34,
    "name": "PKF King Of King Atom bomb (small)",
    "category": "Atom / Bullet / Naraout",
    "sellingPrice": 331,
    "aliases": [
      "pkf",
      "king",
      "atom",
      "bomb",
      "small",
      "bullet",
      "naraout",
      "sound",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-035",
    "serialNo": 35,
    "name": "Kisan C.C Butterfly Fancy",
    "category": "Fancy",
    "sellingPrice": 442,
    "aliases": [
      "butterfly",
      "kisan",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-036",
    "serialNo": 36,
    "name": "Ayyan Lemon Tree Fancy",
    "category": "Fancy",
    "sellingPrice": 469,
    "aliases": [
      "lemon",
      "tree",
      "ayyan",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-037",
    "serialNo": 37,
    "name": "Thai Drone Fancy",
    "category": "Fancy",
    "sellingPrice": 469,
    "aliases": [
      "drone",
      "fancy",
      "thai"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-038",
    "serialNo": 38,
    "name": "Ayyan Ninja GC Chakkar (2 pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 486,
    "aliases": [
      "ninja",
      "(2",
      "gc",
      "pcs)",
      "fancy",
      "ayyan",
      "chakkar"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-039",
    "serialNo": 39,
    "name": "Sky King Small Peacock Fancy",
    "category": "Fancy",
    "sellingPrice": 580,
    "aliases": [
      "peacock",
      "small",
      "king",
      "sky",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-040",
    "serialNo": 40,
    "name": "Cock Whistling Wheel GC Fancy",
    "category": "Fancy",
    "sellingPrice": 690,
    "aliases": [
      "gc",
      "whistling",
      "wheel",
      "fancy",
      "cock"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-041",
    "serialNo": 41,
    "name": "Cylinder Fancy",
    "category": "Fancy",
    "sellingPrice": 718,
    "aliases": [
      "cylinder",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-042",
    "serialNo": 42,
    "name": "Kisan Siren (5 pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 718,
    "aliases": [
      "pcs)",
      "(5",
      "fancy",
      "kisan",
      "siren"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-043",
    "serialNo": 43,
    "name": "Sky King Mini Tri Color Fountain Fancy",
    "category": "Fancy",
    "sellingPrice": 745,
    "aliases": [
      "fountain",
      "king",
      "sky",
      "tri",
      "fancy",
      "mini",
      "color"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-044",
    "serialNo": 44,
    "name": "Top Star Super Koti Fancy",
    "category": "Fancy",
    "sellingPrice": 773,
    "aliases": [
      "koti",
      "top",
      "star",
      "super",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-045",
    "serialNo": 45,
    "name": "AND Popo (5 pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 828,
    "aliases": [
      "pcs)",
      "(5",
      "fancy",
      "popo",
      "and"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-046",
    "serialNo": 46,
    "name": "Starwell Black Money (5 pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 883,
    "aliases": [
      "pcs)",
      "starwell",
      "(5",
      "fancy",
      "money",
      "black"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-047",
    "serialNo": 47,
    "name": "Race Car Fancy",
    "category": "Fancy",
    "sellingPrice": 966,
    "aliases": [
      "race",
      "car",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-048",
    "serialNo": 48,
    "name": "Damo Thunder Fancy",
    "category": "Fancy",
    "sellingPrice": 1214,
    "aliases": [
      "damo",
      "fancy",
      "thunder"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-049",
    "serialNo": 49,
    "name": "INF Sunflr wheel Fancy",
    "category": "Fancy",
    "sellingPrice": 1214,
    "aliases": [
      "sunflr",
      "wheel",
      "inf",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-050",
    "serialNo": 50,
    "name": "ARM Snow Crystal Fountain (5pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 1325,
    "aliases": [
      "fountain",
      "(5pcs)",
      "snow",
      "arm",
      "fancy",
      "crystal"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-051",
    "serialNo": 51,
    "name": "Kisan Jadugar (5 pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 1325,
    "aliases": [
      "jadugar",
      "pcs)",
      "(5",
      "fancy",
      "kisan"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-052",
    "serialNo": 52,
    "name": "JRB Bada Peacock Fancy",
    "category": "Fancy",
    "sellingPrice": 1312,
    "aliases": [
      "fancy",
      "jrb",
      "peacock",
      "bada"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-053",
    "serialNo": 53,
    "name": "Damo Holi Fruit (2 pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 1512,
    "aliases": [
      "(2",
      "pcs)",
      "fruit",
      "holi",
      "damo",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-054",
    "serialNo": 54,
    "name": "Starwell MotuPatlu Fancy",
    "category": "Fancy",
    "sellingPrice": 1380,
    "aliases": [
      "motupatlu",
      "starwell",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-055",
    "serialNo": 55,
    "name": "Cat Fun Zone (5pcs) Fancy",
    "category": "Fancy",
    "sellingPrice": 1601,
    "aliases": [
      "fun",
      "(5pcs)",
      "zone",
      "cat",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-056",
    "serialNo": 56,
    "name": "Ayyan Dancing Queen Fancy",
    "category": "Fancy",
    "sellingPrice": 1656,
    "aliases": [
      "queen",
      "ayyan",
      "dancing",
      "fancy"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-057",
    "serialNo": 57,
    "name": "AND Cocoemelon Fancy",
    "category": "Fancy",
    "sellingPrice": 1518,
    "aliases": [
      "cocoemelon",
      "fancy",
      "and"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-058",
    "serialNo": 58,
    "name": "CR Color Pinjore XXL Fancy",
    "category": "Fancy",
    "sellingPrice": 1794,
    "aliases": [
      "xxl",
      "pinjore",
      "fancy",
      "cr",
      "color"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-059",
    "serialNo": 59,
    "name": "R.G GC Big (10 pcs)",
    "category": "GC",
    "sellingPrice": 93,
    "aliases": [
      "(10",
      "big",
      "gc",
      "pcs)"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-060",
    "serialNo": 60,
    "name": "SV GC Big",
    "category": "GC",
    "sellingPrice": 277,
    "aliases": [
      "big",
      "sv",
      "gc"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-061",
    "serialNo": 61,
    "name": "MU GC Big (25 pcs)",
    "category": "GC",
    "sellingPrice": 277,
    "aliases": [
      "gc",
      "pcs)",
      "(25",
      "big",
      "mu"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-062",
    "serialNo": 62,
    "name": "WG Disco Wheel GC",
    "category": "GC",
    "sellingPrice": 331,
    "aliases": [
      "gc",
      "disco",
      "wg",
      "wheel"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-063",
    "serialNo": 63,
    "name": "Vel G.C SPL",
    "category": "GC",
    "sellingPrice": 291,
    "aliases": [
      "spl",
      "vel",
      "gc"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-064",
    "serialNo": 64,
    "name": "YRJ Wire Chakkar GC",
    "category": "GC",
    "sellingPrice": 397,
    "aliases": [
      "wire",
      "gc",
      "yrj",
      "chakkar"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-065",
    "serialNo": 65,
    "name": "DPM GC Dlx",
    "category": "GC",
    "sellingPrice": 489,
    "aliases": [
      "dpm",
      "dlx",
      "gc"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-066",
    "serialNo": 66,
    "name": "St. G.C Butterfly",
    "category": "GC",
    "sellingPrice": 462,
    "aliases": [
      "butterfly",
      "st",
      "gc"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-067",
    "serialNo": 67,
    "name": "CR Wire Chakkar SPL GC",
    "category": "GC",
    "sellingPrice": 476,
    "aliases": [
      "wire",
      "gc",
      "spl",
      "chakkar",
      "cr"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-068",
    "serialNo": 68,
    "name": "St Zami Chakkar Spl GC",
    "category": "GC",
    "sellingPrice": 476,
    "aliases": [
      "gc",
      "spl",
      "st",
      "zami",
      "chakkar"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-069",
    "serialNo": 69,
    "name": "V Star Spinner GC Super DLX",
    "category": "GC",
    "sellingPrice": 793,
    "aliases": [
      "spinner",
      "dlx",
      "gc",
      "star",
      "super"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-070",
    "serialNo": 70,
    "name": "Loose 4F T-Star Thread",
    "category": "T-Star / Thread",
    "sellingPrice": 14,
    "aliases": [
      "loose",
      "thread",
      "star",
      "4f",
      "t-star"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-071",
    "serialNo": 71,
    "name": "D.G 1½ T-Star Thread",
    "category": "T-Star / Thread",
    "sellingPrice": 92,
    "aliases": [
      "star",
      "1½",
      "thread",
      "t-star"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-072",
    "serialNo": 72,
    "name": "Vel 4f T-Star Thread",
    "category": "T-Star / Thread",
    "sellingPrice": 184,
    "aliases": [
      "star",
      "4f",
      "vel",
      "thread",
      "t-star"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-073",
    "serialNo": 73,
    "name": "MU 10\" Pencil",
    "category": "Pencil",
    "sellingPrice": 138,
    "aliases": [
      "pencil",
      "10",
      "mu"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-074",
    "serialNo": 74,
    "name": "Vel 15\" Pencil",
    "category": "Pencil",
    "sellingPrice": 253,
    "aliases": [
      "pencil",
      "vel",
      "15"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-075",
    "serialNo": 75,
    "name": "1.25 comet (small sky shot)",
    "category": "Comet / Shot",
    "sellingPrice": 67,
    "aliases": [
      "(small",
      "shot)",
      "25",
      "sky",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-076",
    "serialNo": 76,
    "name": "JRM 12 SHOT",
    "category": "Comet / Shot",
    "sellingPrice": 288,
    "aliases": [
      "jrm",
      "shot",
      "12",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-077",
    "serialNo": 77,
    "name": "NSV Tiger 3\" comet 1PC (Medium sky shot)",
    "category": "Comet / Shot",
    "sellingPrice": 402,
    "aliases": [
      "tiger",
      "shot)",
      "nsv",
      "(medium",
      "1pc",
      "sky",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-078",
    "serialNo": 78,
    "name": "JRB 4\" Comet (Big Sky shot)",
    "category": "Comet / Shot",
    "sellingPrice": 633,
    "aliases": [
      "jrb",
      "(big",
      "shot)",
      "sky",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-079",
    "serialNo": 79,
    "name": "St 18 Shot Roman Candle",
    "category": "Comet / Shot",
    "sellingPrice": 690,
    "aliases": [
      "roman",
      "18",
      "candle",
      "st",
      "shot",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-080",
    "serialNo": 80,
    "name": "NSV 30 SHOT",
    "category": "Comet / Shot",
    "sellingPrice": 633,
    "aliases": [
      "30",
      "shot",
      "nsv",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-081",
    "serialNo": 81,
    "name": "NSV 4\" (2pcs) Comet (Big sky shot)",
    "category": "Comet / Shot",
    "sellingPrice": 1380,
    "aliases": [
      "(big",
      "(2pcs)",
      "shot)",
      "nsv",
      "sky",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-082",
    "serialNo": 82,
    "name": "NSV 60 SHOT",
    "category": "Comet / Shot",
    "sellingPrice": 1552,
    "aliases": [
      "shot",
      "nsv",
      "60",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-083",
    "serialNo": 83,
    "name": "NSV Triple Street comet (Ultra Big sky shot)",
    "category": "Comet / Shot",
    "sellingPrice": 1955,
    "aliases": [
      "big",
      "shot)",
      "nsv",
      "sky",
      "triple",
      "comet",
      "street",
      "(ultra"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-084",
    "serialNo": 84,
    "name": "DPM 120 Shot",
    "category": "Comet / Shot",
    "sellingPrice": 3335,
    "aliases": [
      "dpm",
      "120",
      "shot",
      "comet"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-085",
    "serialNo": 85,
    "name": "Turkey 28 Wala",
    "category": "Wala",
    "sellingPrice": 23,
    "aliases": [
      "turkey",
      "28",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-086",
    "serialNo": 86,
    "name": "MU 200 Wala",
    "category": "Wala",
    "sellingPrice": 115,
    "aliases": [
      "200",
      "mu",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-087",
    "serialNo": 87,
    "name": "1K C Wala",
    "category": "Wala",
    "sellingPrice": 253,
    "aliases": [
      "1k",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-088",
    "serialNo": 88,
    "name": "MU 100 DX wala",
    "category": "Wala",
    "sellingPrice": 345,
    "aliases": [
      "100",
      "dx",
      "mu",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-089",
    "serialNo": 89,
    "name": "Goat 1K Wala (A)",
    "category": "Wala",
    "sellingPrice": 402,
    "aliases": [
      "(a)",
      "1k",
      "goat",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-090",
    "serialNo": 90,
    "name": "Lord 2K Wala",
    "category": "Wala",
    "sellingPrice": 552,
    "aliases": [
      "wala",
      "lord",
      "2k"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-091",
    "serialNo": 91,
    "name": "C 5000 WALA",
    "category": "Wala",
    "sellingPrice": 1438,
    "aliases": [
      "5000",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-092",
    "serialNo": 92,
    "name": "Goat 10K Wala",
    "category": "Wala",
    "sellingPrice": 4025,
    "aliases": [
      "goat",
      "10k",
      "wala"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-093",
    "serialNo": 93,
    "name": "GUN ROCKET",
    "category": "Rocket",
    "sellingPrice": 75,
    "aliases": [
      "gun",
      "rocket"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-094",
    "serialNo": 94,
    "name": "W.G Rocket Bomb",
    "category": "Rocket",
    "sellingPrice": 241,
    "aliases": [
      "rocket",
      "bomb"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-095",
    "serialNo": 95,
    "name": "Lord Lunik Rocket",
    "category": "Rocket",
    "sellingPrice": 379,
    "aliases": [
      "rocket",
      "lord",
      "lunik"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-096",
    "serialNo": 96,
    "name": "W.G Lunik Rocket",
    "category": "Rocket",
    "sellingPrice": 402,
    "aliases": [
      "rocket",
      "lunik"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-097",
    "serialNo": 97,
    "name": "VEL 3 Sound Rocket",
    "category": "Rocket",
    "sellingPrice": 518,
    "aliases": [
      "rocket",
      "vel",
      "sound"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-098",
    "serialNo": 98,
    "name": "DPM 30CM SADA pipe",
    "category": "Pipe",
    "sellingPrice": 57,
    "aliases": [
      "dpm",
      "sada",
      "30cm",
      "pipe"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-099",
    "serialNo": 99,
    "name": "DPM 30CM COLOR pipe",
    "category": "Pipe",
    "sellingPrice": 75,
    "aliases": [
      "dpm",
      "pipe",
      "30cm",
      "color"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-100",
    "serialNo": 100,
    "name": "DPM 15CM COLOR pipe",
    "category": "Pipe",
    "sellingPrice": 63,
    "aliases": [
      "dpm",
      "pipe",
      "15cm",
      "color"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-101",
    "serialNo": 101,
    "name": "RMS 50cm Sada Pipe",
    "category": "Pipe",
    "sellingPrice": 173,
    "aliases": [
      "rms",
      "pipe",
      "50cm",
      "sada"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-102",
    "serialNo": 102,
    "name": "RMS 50cm color Pipe",
    "category": "Pipe",
    "sellingPrice": 345,
    "aliases": [
      "color",
      "rms",
      "pipe",
      "50cm"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-103",
    "serialNo": 103,
    "name": "RMS 75cm Color Pipe",
    "category": "Pipe",
    "sellingPrice": 633,
    "aliases": [
      "rms",
      "75cm",
      "color",
      "pipe"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-104",
    "serialNo": 104,
    "name": "RMS 15cm Carnival 5 in 1 Pipes single color",
    "category": "Pipe",
    "sellingPrice": 138,
    "aliases": [
      "pipes",
      "15cm",
      "rms",
      "carnival",
      "single",
      "in",
      "color",
      "pipe"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-105",
    "serialNo": 105,
    "name": "Sarajini 2 Sound Bomb",
    "category": "Other / Unclassified",
    "sellingPrice": 75,
    "aliases": [
      "bomb",
      "sarajini",
      "sound",
      "other"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-106",
    "serialNo": 106,
    "name": "CAT 100 BIJILI Green",
    "category": "Other / Unclassified",
    "sellingPrice": 67,
    "aliases": [
      "green",
      "cat",
      "bijili",
      "100",
      "other"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-107",
    "serialNo": 107,
    "name": "POP POP",
    "category": "Other / Unclassified",
    "sellingPrice": 460,
    "aliases": [
      "pop",
      "other"
    ],
    "imageUrl": null
  }
];

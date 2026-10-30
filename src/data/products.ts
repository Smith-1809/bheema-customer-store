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
            "sellingPrice": 13.0,
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
    "name": "W.G 3\u00bd Lakshmi",
    "category": "Lakshmi / Bird / Jalli Kattu",
            "sellingPrice": 27.0,
        "aliases": [
      "lakshmi",
      "3\u00bd"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-003",
    "serialNo": 3,
    "name": "MU 4\" Lakshmi",
    "category": "Lakshmi / Bird / Jalli Kattu",
            "sellingPrice": 35.0,
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
            "sellingPrice": 55.0,
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
            "sellingPrice": 70.0,
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
    "name": "Mithra\u2019s 5\" Jalli Kattu",
    "category": "Lakshmi / Bird / Jalli Kattu",
            "sellingPrice": 120.0,
        "aliases": [
      "kattu",
      "mithra\u2019s",
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
            "sellingPrice": 185.0,
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
            "sellingPrice": 210.0,
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
            "sellingPrice": 250.0,
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
            "sellingPrice": 250.0,
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
            "sellingPrice": 250.0,
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
            "sellingPrice": 275.0,
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
            "sellingPrice": 400.0,
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
            "sellingPrice": 550.0,
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
            "sellingPrice": 675.0,
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
    "name": "GD GIFT PACK Small FP",
    "category": "FP",
            "sellingPrice": 500.0,
        "aliases": [
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
    "name": "GD GIFT PACK Big FP",
    "category": "FP",
            "sellingPrice": 1150.0,
        "aliases": [
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
            "sellingPrice": 70.0,
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
            "sellingPrice": 100.0,
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
            "sellingPrice": 275.0,
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
            "sellingPrice": 400.0,
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
            "sellingPrice": 650.0,
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
            "sellingPrice": 700.0,
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
            "sellingPrice": 180.0,
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
            "sellingPrice": 88.0,
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
            "sellingPrice": 160.0,
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
            "sellingPrice": 180.0,
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
    "sellingPrice": 208.0,
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
            "sellingPrice": 220.0,
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
            "sellingPrice": 220.0,
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
            "sellingPrice": 240.0,
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
            "sellingPrice": 280.0,
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
            "sellingPrice": 280.0,
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
    "name": "PKF King of King Fancy",
    "category": "Fancy",
            "sellingPrice": 288.0,
        "aliases": [
      "fancy",
      "of",
      "king",
      "pkf"
    ],
    "imageUrl": null
  },
  {
    "id": "PRD-035",
    "serialNo": 35,
    "name": "Kisan C.C Butterfly Fancy",
    "category": "Fancy",
            "sellingPrice": 320.0,
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
            "sellingPrice": 340.0,
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
            "sellingPrice": 340.0,
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
            "sellingPrice": 352.0,
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
            "sellingPrice": 420.0,
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
            "sellingPrice": 500.0,
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
            "sellingPrice": 520.0,
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
            "sellingPrice": 520.0,
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
            "sellingPrice": 540.0,
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
            "sellingPrice": 560.0,
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
            "sellingPrice": 600.0,
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
            "sellingPrice": 640.0,
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
            "sellingPrice": 700.0,
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
            "sellingPrice": 880.0,
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
            "sellingPrice": 880.0,
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
            "sellingPrice": 960.0,
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
            "sellingPrice": 960.0,
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
            "sellingPrice": 950.0,
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
            "sellingPrice": 1096.0,
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
            "sellingPrice": 1000.0,
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
            "sellingPrice": 1160.0,
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
            "sellingPrice": 1200.0,
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
            "sellingPrice": 1100.0,
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
            "sellingPrice": 1300.0,
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
            "sellingPrice": 70.0,
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
            "sellingPrice": 210.0,
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
            "sellingPrice": 210.0,
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
            "sellingPrice": 250.0,
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
            "sellingPrice": 220.0,
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
            "sellingPrice": 300.0,
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
            "sellingPrice": 370.0,
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
            "sellingPrice": 350.0,
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
            "sellingPrice": 360.0,
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
            "sellingPrice": 360.0,
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
            "sellingPrice": 600.0,
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
            "sellingPrice": 12.0,
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
    "name": "D.G 1\u00bd T-Star Thread",
    "category": "T-Star / Thread",
            "sellingPrice": 80.0,
        "aliases": [
      "star",
      "1\u00bd",
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
            "sellingPrice": 160.0,
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
            "sellingPrice": 120.0,
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
            "sellingPrice": 220.0,
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
            "sellingPrice": 58.0,
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
            "sellingPrice": 250.0,
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
            "sellingPrice": 350.0,
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
            "sellingPrice": 550.0,
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
            "sellingPrice": 600.0,
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
            "sellingPrice": 550.0,
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
            "sellingPrice": 1200.0,
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
            "sellingPrice": 1350.0,
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
            "sellingPrice": 1700.0,
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
            "sellingPrice": 2900.0,
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
            "sellingPrice": 20.0,
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
            "sellingPrice": 100.0,
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
            "sellingPrice": 220.0,
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
            "sellingPrice": 300.0,
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
            "sellingPrice": 350.0,
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
            "sellingPrice": 480.0,
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
            "sellingPrice": 1250.0,
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
            "sellingPrice": 3500.0,
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
            "sellingPrice": 65.0,
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
            "sellingPrice": 210.0,
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
            "sellingPrice": 330.0,
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
            "sellingPrice": 350.0,
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
            "sellingPrice": 450.0,
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
            "sellingPrice": 50.0,
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
            "sellingPrice": 65.0,
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
            "sellingPrice": 55.0,
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
            "sellingPrice": 150.0,
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
            "sellingPrice": 300.0,
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
            "sellingPrice": 550.0,
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
            "sellingPrice": 120.0,
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
            "sellingPrice": 65.0,
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
            "sellingPrice": 58.0,
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
            "sellingPrice": 400.0,
        "aliases": [
      "pop",
      "other"
    ],
    "imageUrl": null
  }
];

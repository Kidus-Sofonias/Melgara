// ============ MELGARA — REAL PRODUCT & COMPANY DATA ============
// Extracted from melgara.com (August 2026).
// Each ore carries an `am` variant for the Amharic language mode, plus
// `veinColor` / `patina` used by the photorealistic 3D ore renderer.

export const COMPANY = {
  name: "MELGARA",
  fullName: "Melgara Mining and Manufacturing PLC",
  founded: 2000,
  tagline: "Mined. Verified. Delivered.",
  taglineAlt: "From the Horn of Africa to the world's foundries.",
  promise: "We don't promise ore. We deliver the exact grade, on spec, on time.",
  since:
    "We hold ourselves up to the highest of standards, and have been part of this industry since 2000. We have an immense amount of knowledge from years of experience as a Manufacturing Company, and continue to expand our practices each and every day. We supply many local and global companies with a variety of innovative products, created with the greatest degree of precision and care.",
  founder: "Melat Taffesse",
  founderRole: "Cofounder & General Manager",
  email: ["info@melgara.com", "melat@melgara.com"],
  website: "www.melgara.com",
  wechat: "MELGARA",
  quote: "We don't just mine minerals — we build trust, one shipment at a time.",
  team: [
    {
      name: "Melat Taffesse",
      role: "Cofounder & General Manager",
      bio: "Leads Melgara's strategic vision and operations across East Africa. With deep expertise in mineral sourcing and international trade, Melat has built partnerships spanning 7 countries and 4+ languages.",
      highlight: true,
    },
    {
      name: "Operations Team",
      role: "Mining & Extraction",
      bio: "On-the-ground specialists managing extraction, sorting, and sampling across mining sites in Ethiopia, Sudan, Eritrea, Somalia, and Uganda.",
      icon: "⛏",
    },
    {
      name: "Quality Assurance",
      role: "Lab & Certification",
      bio: "Every shipment is verified against its chemical analysis — grades, percentages and compositions documented to the decimal.",
      icon: "🔬",
    },
    {
      name: "Logistics Hub",
      role: "Dubai, UAE",
      bio: "The international trading hub connecting East African extraction directly to industrial buyers in Europe, the Americas, and Asia.",
      icon: "🌍",
    },
    {
      name: "Trade & Sales",
      role: "Global Partnerships",
      bio: "Serving steelworks, foundries, cement plants, and refineries worldwide with precise specifications and timely delivery.",
      icon: "🤝",
    },
    {
      name: "Technical Advisory",
      role: "Specialists Trained Abroad",
      bio: "Specialists trained in Poland and abroad, bringing international standards and best practices to every operation.",
      icon: "🎓",
    },
  ],
  skype: "https://join.skype.com/invite/ObIV448OcL6Q",
  socials: {
    facebook: "https://www.facebook.com/melgara.mining",
    linkedin: "https://www.linkedin.com/in/melgara-mining-27169620a",
    twitter: "https://twitter.com/MELGARA",
  },
  hq: "Addis Ababa, Ethiopia",
  hub: "Dubai, UAE",
  countries: [
    { name: "Sudan", region: "Africa", note: "Mineral sourcing & operations" },
    { name: "Ethiopia", region: "Africa", note: "Headquarters · mining & manufacturing" },
    { name: "Eritrea", region: "Africa", note: "Mineral sourcing & operations" },
    { name: "Somalia", region: "Africa", note: "Mineral sourcing & operations" },
    { name: "Uganda", region: "Africa", note: "Mineral sourcing & operations" },
    { name: "Kenya", region: "Africa", note: "Regional trade & logistics" },
    { name: "Dubai", region: "Middle East", note: "International trading hub" },
  ],
  industries: [
    "Steelworks",
    "Foundries",
    "Cement plants",
    "Sugar refineries",
    "Enrichment plants",
    "Recycling plants",
    "Heating plants",
    "Coke plants",
    "Lime & production plants",
    "Mixing plants",
  ],
  languages: "4+",
  am: {
    taglineAlt: "ከአፍሪካ ቀንድ እስከ ዓለም ፋብሪካዎች።",
    promise: "ማዕድን አንቃቃም። የተረጋገጠውን ደረጃ፣ በዝርዝር፣ በጊዜ እናደርሳለን።",
    since:
      "ራሳችንን ከፍተኛ ደረጃ ላይ እናቆማለን፣ ከ2000 ጀምሮ የዚህ ኢንዱስትሪ አካል ሆነን ቆይተናል። እንደ አምራች ኩባንያ ከዓመታት ልምድ የተገኘ እጅግ ሰፊ እውቀት አለን፣ አሰራራችንንም በየቀኑ ማስፋት እንቀጥላለን። በትልቁ ትክክለኛነት እና ጥንቃቄ የተፈጠሩ የተለያዩ ፈጠራ ምርቶችን ለብዙ የአገር ውስጥ እና ዓለም አቀፍ ኩባንያዎች እናቀርባለን።",
  },
};

// Amharic variants of the company-level arrays.
export const COUNTRIES_AM = [
  { name: "ሱዳን", region: "አፍሪካ", note: "የማዕድን ምንጭ እና ስራዎች" },
  { name: "ኢትዮጵያ", region: "አፍሪካ", note: "ዋና መሥሪያ ቤት · ማዕድን እና ማምረቻ" },
  { name: "ኤርትራ", region: "አፍሪካ", note: "የማዕድን ምንጭ እና ስራዎች" },
  { name: "ሱማሌ", region: "አፍሪካ", note: "የማዕድን ምንጭ እና ስራዎች" },
  { name: "ኡጋንዳ", region: "አፍሪካ", note: "የማዕድን ምንጭ እና ስራዎች" },
  { name: "ኬንያ", region: "አፍሪካ", note: "የክልል ንግድ እና ሎጂስቲክስ" },
  { name: "ዱባይ", region: "መካከለኛው ምስራቅ", note: "ዓለም አቀፍ የንግድ ማዕከል" },
];

export const INDUSTRIES_AM = [
  "የብረት ፋብሪካዎች",
  "የብረት ቀማሾች",
  "የሲሚንቶ ፋብሪካዎች",
  "የስኳር ማጣሪያ ፋብሪካዎች",
  "የማበልጸጊያ ፋብሪካዎች",
  "የሪሳይክል ፋብሪካዎች",
  "የሙቀት ማመንጫ ፋብሪካዎች",
  "የኮክ ፋብሪካዎች",
  "የኖራ እና የምርት ፋብሪካዎች",
  "የቅልቅል ፋብሪካዎች",
];

export const ORES = [
  {
    slug: "copper",
    name: "Copper Ore",
    family: "Metallic",
    headline: "Oxide & Sulfide",
    grade: "10% / 21% Cu",
    blurb:
      "Copper ore of different types including oxide ore, sulfide ore and others — sourced, processed and exported with full chemical documentation.",
    heroTagline: "The red metal that powers the world's grids.",
    // Real specimen photo (Wikimedia Commons) used for the photoreal replica
    photo: "/ores/copper.jpg",
    photoCredit: "Chalcopyrite botroïdale — Wikimedia Commons (CC)",
    // 3D model path — place a .glb file here for photorealistic rendering
    // Falls back to procedural + photo if not found
    modelPath: "/models/ores/copper.glb",
    // 3D realism profile
    color: "#b96a3a",
    veinColor: "#f0a35c",
    patina: "#3d8d84",
    roughness: 0.3,
    metalness: 0.85,
    seed: 7,
    specPdf: null,
    varieties: [
      {
        name: "Copper Ore 10%",
        grade: "10% Cu",
        specPdf: "/specs/copper-10.pdf",
        analysis: [
          ["Cu", "10", "%"],
          ["Zn", "0.020", "%"],
          ["Pb", "0.120", "%"],
          ["Co", "0.002", "%"],
          ["Ni", "0.016", "%"],
          ["As", "0.034", "%"],
          ["Hg", "0.003", "%"],
          ["Cd", "0.006", "%"],
          ["F", "0.009", "%"],
        ],
      },
      {
        name: "Copper Ore 21%",
        grade: "21% Cu",
        specPdf: "/specs/copper-21.pdf",
        analysis: [
          ["Cu", "21", "%"],
          ["Zn", "0.020", "%"],
          ["Pb", "0.120", "%"],
          ["Co", "0.002", "%"],
          ["Ni", "0.016", "%"],
          ["As", "0.034", "%"],
          ["Hg", "0.003", "%"],
          ["Cd", "0.006", "%"],
          ["F", "0.009", "%"],
        ],
      },
    ],
    am: {
      name: "የመዳብ ማዕድን",
      headline: "ኦክሳይድ እና ሰልፋይድ",
      grade: "10% / 21% Cu",
      blurb:
        "የተለያዩ የመዳብ ማዕድን ዓይነቶች — ኦክሳይድ፣ ሰልፋይድ እና ሌሎች — ከሙሉ የኬሚካል ሰነዶች ጋር ተገኝተው፣ ተሰርተው እና ወደ ውጭ ይላካሉ።",
      heroTagline: "የዓለምን የኤሌክትሪክ መረቦች የሚያንቀሳቅሰው ቀይ ብረት።",
      varieties: [
        { name: "የመዳብ ማዕድን 10%", grade: "10% Cu" },
        { name: "የመዳብ ማዕድን 21%", grade: "21% Cu" },
      ],
    },
  },
  {
    slug: "manganese",
    name: "Manganese Ore",
    family: "Metallic",
    headline: "Two Supply Ranges",
    grade: "35–39% / 42–46%",
    blurb:
      "We supply two ranges of manganese ore — 35–39% and 42–46% — with detailed typical chemical analysis for every shipment.",
    heroTagline: "The backbone of steelmaking strength.",
    photo: "/ores/manganese.jpg",
    photoCredit: "Pyrolusite mineral macro — Wikimedia Commons (CC)",
    modelPath: "/models/ores/manganese.glb",
    color: "#3f3f44",
    veinColor: "#8f9096",
    patina: null,
    roughness: 0.95,
    metalness: 0.3,
    seed: 12,
    specPdf: null,
    varieties: [
      {
        name: "Manganese Ore 44%",
        grade: "Mn 37 avg · 35 min",
        specPdf: "/specs/manganese-44.pdf",
        analysis: [
          ["Mn", "37 (avg) / 35 min", "%"],
          ["SiO2", "10 max", "%"],
          ["Al2O3", "5 max", "%"],
          ["Fe", "4 max", "%"],
          ["P", "0.05 max", "%"],
          ["S", "0.01 max", "%"],
          ["BaO", "0.2 max", "%"],
          ["MgO", "<0.001", "%"],
          ["Na2O", "<0.01", "%"],
          ["K2O", "<0.01", "%"],
          ["P2O5", "<0.03", "%"],
          ["TiO2", "<0.1", "%"],
          ["H2O", "8 max", "%"],
          ["LOI", "11.03", "%"],
        ],
      },
      {
        name: "Manganese Ore 37%",
        grade: "Mn 44 avg · 42 min",
        specPdf: "/specs/manganese-37.pdf",
        analysis: [
          ["Mn", "44 (avg) / 42 min", "%"],
          ["SiO2", "10 max", "%"],
          ["Al2O3", "5 max", "%"],
          ["Fe", "4 max", "%"],
          ["P", "0.05 max", "%"],
          ["S", "0.01 max", "%"],
          ["BaO", "0.2 max", "%"],
          ["MgO", "<0.001", "%"],
          ["Na2O", "<0.01", "%"],
          ["K2O", "<0.01", "%"],
          ["P2O5", "<0.03", "%"],
          ["TiO2", "<0.1", "%"],
          ["H2O", "8 max", "%"],
          ["LOI", "11.03", "%"],
        ],
      },
    ],
    am: {
      name: "የማንጋኒዝ ማዕድን",
      headline: "ሁለት የአቅርቦት ክልሎች",
      grade: "35–39% / 42–46%",
      blurb:
        "ሁለት የማንጋኒዝ ማዕድን ክልሎችን — 35–39% እና 42–46% — ለእያንዳንዱ ጭነት ዝርዝር የተለመደ የኬሚካል ትንታኔ ይዘን እናቀርባለን።",
      heroTagline: "የብረት ማምረቻ ጥንካሬ ዋነኛ ምሰሶ።",
      varieties: [
        { name: "የማንጋኒዝ ማዕድን 44%", grade: "Mn 37 አማካይ · 35 ዝቅተኛ" },
        { name: "የማንጋኒዝ ማዕድን 37%", grade: "Mn 44 አማካይ · 42 ዝቅተኛ" },
      ],
    },
  },
  {
    slug: "chrome",
    name: "Chrome Ore",
    family: "Metallic",
    headline: "Different Grades",
    grade: "42–48% · avg 46%",
    blurb:
      "Chrome ore of different grades, averaging 46% — the essential input for ferrochrome and stainless steel production.",
    heroTagline: "The silver spine of stainless steel.",
    photo: "/ores/chrome.jpg",
    photoCredit: "Chromite prospect (Yukon) — Wikimedia Commons (CC)",
    modelPath: "/models/ores/chrome.glb",
    color: "#9aa0a6",
    veinColor: "#eef2f6",
    patina: null,
    roughness: 0.18,
    metalness: 0.95,
    seed: 4,
    specPdf: null,
    varieties: [
      {
        name: "Chrome Ore 42–48%",
        grade: "Average 46%",
        specPdf: null,
        analysis: [
          ["Cr2O3", "42–48 (avg 46)", "%"],
          ["Grade", "Various grades supplied", ""],
        ],
      },
    ],
    am: {
      name: "የክሮም ማዕድን",
      headline: "የተለያዩ ደረጃዎች",
      grade: "42–48% · አማካይ 46%",
      blurb:
        "የተለያዩ ደረጃዎች ያሉት የክሮም ማዕድን፣ በአማካይ 46% — ለፌሮክሮም እና ለአይዝጭ ብረት ምርት ወሳኝ ግብአት።",
      heroTagline: "የአይዝጭ ብረት ብርማ አጥንት።",
      varieties: [
        {
          name: "የክሮም ማዕድን 42–48%",
          grade: "አማካይ 46%",
          analysis: [
            ["Cr2O3", "42–48 (አማካይ 46)", "%"],
            ["ደረጃ", "የተለያዩ ደረጃዎች ይቀርባሉ", ""],
          ],
        },
      ],
    },
  },
  {
    slug: "iron-metals",
    name: "Iron Ore & Other Ferrous",
    family: "Metallic",
    headline: "High-Grade East African",
    grade: "71% / 80% Fe",
    blurb:
      "MMM-IRO71 and MMM-IRO80 are high-grade iron ores derived from East African land — extracted, sorted, packed and supplied with iron content above 70%.",
    heroTagline: "East African iron, refined for the world.",
    photo: "/ores/iron.jpg",
    photoCredit: "Hematite (Cavradi Gorge, Switzerland) — Wikimedia Commons (CC)",
    modelPath: "/models/ores/iron.glb",
    color: "#7a4e2e",
    veinColor: "#b36a3c",
    patina: "#3a2a1c",
    roughness: 0.72,
    metalness: 0.55,
    seed: 9,
    specPdf: null,
    varieties: [
      {
        name: "Iron Ore 71% (MMM-IRO71)",
        grade: "Fe > 70%",
        specPdf: null,
        analysis: [
          ["Fe", "> 70 (71)", "%"],
          ["Origin", "East African land", ""],
          ["Mining site", "Africa", ""],
        ],
      },
      {
        name: "Iron Ore 80% (MMM-IRO80)",
        grade: "Fe > 80%",
        specPdf: null,
        analysis: [
          ["Fe", "> 80", "%"],
          ["Origin", "East African land", ""],
          ["Extraction", "Extracted · Sorted · Packed", ""],
        ],
      },
    ],
    am: {
      name: "የብረት ማዕድን እና ሌሎች ብረታ ብረቶች",
      headline: "ከፍተኛ ደረጃ የምስራቅ አፍሪካ",
      grade: "71% / 80% Fe",
      blurb:
        "MMM-IRO71 እና MMM-IRO80 ከምስራቅ አፍሪካ መሬት የሚገኙ ከፍተኛ ደረጃ የብረት ማዕድናት ናቸው — ከ70% በላይ የብረት ይዘት ይዘው ይወጣሉ፣ ይደረደራሉ፣ ይጠቃለላሉ እና ይቀርባሉ።",
      heroTagline: "የምስራቅ አፍሪካ ብረት፣ ለዓለም የተጣራ።",
      varieties: [
        {
          name: "የብረት ማዕድን 71% (MMM-IRO71)",
          grade: "Fe > 70%",
          analysis: [
            ["Fe", "> 70 (71)", "%"],
            ["መነሻ", "የምስራቅ አፍሪካ መሬት", ""],
            ["የማዕድን ቦታ", "አፍሪካ", ""],
          ],
        },
        {
          name: "የብረት ማዕድን 80% (MMM-IRO80)",
          grade: "Fe > 80%",
          analysis: [
            ["Fe", "> 80", "%"],
            ["መነሻ", "የምስራቅ አፍሪካ መሬት", ""],
            ["አመራረት", "ተወጥቷል · ተደርድሯል · ተጠቅልሏል", ""],
          ],
        },
      ],
    },
  },
  {
    slug: "non-metallic",
    name: "Non-Metallic Mineral Deposits",
    family: "Non-Metallic",
    headline: "A Wide Range of Minerals",
    grade: "9 minerals",
    blurb:
      "A wide range of non-metallic minerals including Mica (Muscovite), Talc, Dolomite, High Purity Quartz, Tantalite, Graphite, Bentonite, Sulfur — plus lead and nickel.",
    heroTagline: "The quiet essentials of modern industry.",
    photo: "/ores/nonmetallic.jpg",
    photoCredit: "Quartz, Tibet — Wikimedia Commons (CC)",
    modelPath: "/models/ores/nonmetallic.glb",
    color: "#b9c0c7",
    veinColor: "#f2f6f9",
    patina: "#8d979e",
    roughness: 0.5,
    metalness: 0.2,
    seed: 16,
    specPdf: null,
    minerals: [
      "Tantalite",
      "Graphite",
      "Mica (Muscovite)",
      "Talc",
      "Bentonite",
      "Lead",
      "Nickel",
      "Sulfur",
      "High Purity Quartz",
      "Dolomite",
    ],
    varieties: [
      {
        name: "Non-Metallic Deposits",
        grade: "Bulk supply",
        specPdf: null,
        analysis: [
          ["Tantalite", "Available", ""],
          ["Graphite", "Available", ""],
          ["Mica (Muscovite)", "Available", ""],
          ["Talc", "Available", ""],
          ["Bentonite", "Available", ""],
          ["Lead", "Available", ""],
          ["Nickel", "Available", ""],
          ["Sulfur", "Available", ""],
          ["Quartz", "Available", ""],
          ["Dolomite", "Available", ""],
        ],
      },
    ],
    am: {
      name: "ብረት-አልባ የማዕድን ክምችቶች",
      headline: "ሰፊ የማዕድን ዓይነቶች",
      grade: "9 ማዕድናት",
      blurb:
        "ሰፊ የብረት-አልባ ማዕድናት — ማይካ (ሙስኮቫይት)፣ ታልክ፣ ዶሎማይት፣ ከፍተኛ ንጽህና ኳርትዝ፣ ታንታሊት፣ ግራፋይት፣ ቤንቶናይት፣ ሰልፈር — እንዲሁም እርሳስ እና ኒኬል።",
      heroTagline: "የዘመናዊ ኢንዱስትሪ ፀጥተኛ መሠረቶች።",
      minerals: [
        "ታንታሊት",
        "ግራፋይት",
        "ማይካ (ሙስኮቫይት)",
        "ታልክ",
        "ቤንቶናይት",
        "እርሳስ",
        "ኒኬል",
        "ሰልፈር",
        "ከፍተኛ ንጽህና ኳርትዝ",
        "ዶሎማይት",
      ],
      varieties: [
        {
          name: "ብረት-አልባ ክምችቶች",
          grade: "የጅምላ አቅርቦት",
          analysis: [
            ["ታንታሊት", "ይገኛል", ""],
            ["ግራፋይት", "ይገኛል", ""],
            ["ማይካ (ሙስኮቫይት)", "ይገኛል", ""],
            ["ታልክ", "ይገኛል", ""],
            ["ቤንቶናይት", "ይገኛል", ""],
            ["እርሳስ", "ይገኛል", ""],
            ["ኒኬል", "ይገኛል", ""],
            ["ሰልፈር", "ይገኛል", ""],
            ["ኳርትዝ", "ይገኛል", ""],
            ["ዶሎማይት", "ይገኛል", ""],
          ],
        },
      ],
    },
  },
];

export const STATS = [
  { value: 25, suffix: "+", label: "Years in the industry" },
  { value: 7, suffix: "", label: "Countries & hubs" },
  { value: 12, suffix: "+", label: "Minerals & ores" },
  { value: 4, suffix: "+", label: "Languages spoken" },
];

export const STATS_AM = [
  { value: 25, suffix: "+", label: "ዓመታት በኢንዱስትሪው" },
  { value: 7, suffix: "", label: "አገራት እና ማዕከላት" },
  { value: 12, suffix: "+", label: "ማዕድናት" },
  { value: 4, suffix: "+", label: "የሚነገሩ ቋንቋዎች" },
];

export const TIMELINE = [
  {
    year: "2000",
    title: "The foundation",
    text: "Melgara enters the mining and raw-materials industry, building on a deep base of manufacturing experience.",
  },
  {
    year: "2000s",
    title: "East African roots",
    text: "Established operations across Ethiopia and the Horn of Africa — Sudan, Eritrea, Somalia, Uganda and Kenya — securing mineral sourcing at the source.",
  },
  {
    year: "2010s",
    title: "Expanding the offer",
    text: "Built a diversified portfolio spanning copper, manganese, chrome, iron, and a full range of non-metallic minerals, with land, sea, rail and air logistics.",
  },
  {
    year: "Today",
    title: "The Dubai bridge",
    text: "A trading hub in Dubai connects East African extraction directly to industrial buyers in Europe, the Americas and Asia — in 4+ languages.",
  },
];

export const TIMELINE_AM = [
  {
    year: "2000",
    title: "መሠረቱ",
    text: "ሜልጋራ በሰፊ የማምረት ልምድ መሠረት ላይ በመገንባት ወደ ማዕድን እና ጥሬ እቃ ኢንዱስትሪ ገባ።",
  },
  {
    year: "2000ዎቹ",
    title: "የምስራቅ አፍሪካ ሥሮች",
    text: "በኢትዮጵያ እና በአፍሪካ ቀንድ — ሱዳን፣ ኤርትራ፣ ሱማሌ፣ ኡጋንዳ እና ኬንያ — ስራዎችን አቋቋመ፣ የማዕድን ምንጭንም ከመነሻው አስተማምኗል።",
  },
  {
    year: "2010ዎቹ",
    title: "አቅርቦቱን ማስፋት",
    text: "መዳብን፣ ማንጋኒዝን፣ ክሮምን፣ ብረትን እና ሙሉ ብረት-አልባ ማዕድናትን የሚሸፍን የተለያየ ፖርትፎሊዮ ገነባ፣ በመሬት፣ በባህር፣ በባቡር እና በአየር ሎጂስቲክስ።",
  },
  {
    year: "ዛሬ",
    title: "የዱባይ ድልድይ",
    text: "በዱባይ ያለው የንግድ ማዕከል የምስራቅ አፍሪካን ምርት በቀጥታ ከአውሮፓ፣ አሜሪካ እና እስያ የኢንዱስትሪ ገዢዎች ጋር ያገናኛል — ከ4 በላይ ቋንቋዎች።",
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Sampling",
    text: "Ore is extracted, sorted and sampled at the mining site under strict supervision.",
  },
  {
    step: "02",
    title: "Assay",
    text: "Every batch is verified against its typical chemical analysis — grade documented, not guessed.",
  },
  {
    step: "03",
    title: "Packing & certification",
    text: "Material is packed with full export documentation and specification sheets.",
  },
  {
    step: "04",
    title: "Delivery",
    text: "Multi-modal logistics — land, sea, rail or air — deliver on spec, on time, worldwide.",
  },
];

export const PROCESS_AM = [
  {
    step: "01",
    title: "ናሙና",
    text: "ማዕድን በማዕድን ቁፋሮው ቦታ በጥብቅ ክትትል ይወጣል፣ ይደረደራል እና ናሙና ይወሰድበታል።",
  },
  {
    step: "02",
    title: "ምርመራ",
    text: "እያንዳንዱ ቡድን በተለመደው የኬሚካል ትንታኔ ይረጋገጣል — ደረጃ ይሰነዳል፣ በግምት አይባልም።",
  },
  {
    step: "03",
    title: "ማሸግ እና የምስክር ወረቀት",
    text: "ዕቃው ከሙሉ የኤክስፖርት ሰነዶች እና የዝርዝር ሰነዶች ጋር ይጠቃለላል።",
  },
  {
    step: "04",
    title: "አቅርቦት",
    text: "ባለብዙ ዘዴ ሎጂስቲክስ — መሬት፣ ባህር፣ ባቡር ወይም አየር — በዝርዝር፣ በጊዜ፣ በዓለም አቀፍ ደረጃ ያደርሳል።",
  },
];

export const VALUES = [
  {
    icon: "⛏",
    title: "Rigor",
    text: "Every claim is a measured claim. Grades, percentages and analyses are documented to the decimal.",
  },
  {
    icon: "🪞",
    title: "Transparency",
    text: "Spec sheets, chemical analyses and documentation are published for every product we ship.",
  },
  {
    icon: "🤝",
    title: "Partnership",
    text: "We serve the companies behind the companies — steelworks, foundries and refineries worldwide.",
  },
  {
    icon: "🌍",
    title: "Global standard",
    text: "Specialists trained in Poland and abroad, fluent in 4+ languages, operating to international standards.",
  },
];

export const VALUES_AM = [
  {
    icon: "⛏",
    title: "ጥብቅነት",
    text: "እያንዳንዱ ጥያቄ የተለካ ጥያቄ ነው። ደረጃዎች፣ መቶኛዎች እና ትንታኔዎች እስከ አስርዮሽ ይመዘገባሉ።",
  },
  {
    icon: "🪞",
    title: "ግልጽነት",
    text: "የዝርዝር ሰነዶች፣ የኬሚካል ትንታኔዎች እና ሰነዶች ለምንልከው እያንዳንዱ ምርት ይታተማሉ።",
  },
  {
    icon: "🤝",
    title: "አጋርነት",
    text: "ከኩባንያዎች ጀርባ ያሉትን ኩባንያዎች እናገለግላለን — የብረት ፋብሪካዎች፣ የብረት ቀማሾች እና ማጣሪያዎች በዓለም አቀፍ ደረጃ።",
  },
  {
    icon: "🌍",
    title: "ዓለም አቀፍ መስፈርት",
    text: "በፖላንድ እና በውጭ አገር የሰለጠኑ ባለሙያዎች፣ ከ4 በላይ ቋንቋዎችን የሚናገሩ፣ በዓለም አቀፍ መስፈርት የሚሰሩ።",
  },
];

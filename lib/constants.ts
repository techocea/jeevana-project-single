import { LKRegionMap, StepConfig } from "@/types";
import {
  FileText,
  Send,
  MessageCircle,
  FingerprintPattern,
  Brush,
  ShieldCheck,
  Headset,
  Sparkles,
  CreditCard,
  Flag,
  Ban,
  Check,
  RefreshCw,
} from "lucide-react";

export const NAVLINKS = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Success Stories",
    href: "/success-stories",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Contact",
    href: "/contact-us",
  },
];

export const DASHBOARD_SIDEBAR = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/control-panel",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Approval Queues",
          url: "/control-panel/approval-queues",
        },
        {
          title: "Create Advertisement",
          url: "/control-panel/create-advertisement",
        },
      ],
    },
    {
      title: "Business & Finance",
      items: [
        {
          title: "Transactions",
          url: "/control-panel/transactions",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "User Management",
          url: "/control-panel/user-management",
        },
        {
          title: "Staff Management",
          url: "/control-panel/staff-management",
        },
        {
          title: "System Settings",
          url: "/control-panel/system-settings",
        },
      ],
    },
  ],
};

export const SIGN_UP_FEATURES = [
  {
    title: "sign up",
    description: "Create your editorial profile with detailed preferences.",
    icon: FileText,
  },
  {
    title: "connect",
    description:
      "Browse and send expressions of interest to verified profiles.",
    icon: Send,
  },
  {
    title: "interact",
    description: "Engage in secure, moderated conversations with families.",
    icon: MessageCircle,
  },
];

export const SERVICE_PROMISES = [
  {
    id: 1,
    title: "Bespoke Verification",
    description:
      "Every member is manually vetted for background, professional integrity, and family values.",
    icon: FingerprintPattern,
  },
  {
    id: 2,
    title: "Artisanal Matching",
    description:
      "We pair you based on intellectual synergy, lifestyle aesthetics, and long-term vision.",
    icon: Brush,
  },
  {
    id: 3,
    title: "Absolute Discretion",
    description:
      "Your privacy is our highest priority. Only curated matches see what we allow them to see.",
    icon: ShieldCheck,
  },
];

export const PRICING_FEATURES = [
  {
    id: 1,
    title: "data privacy",
    description: "Bank-grade protection",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "24/7 Support",
    description: "Personal support for every inquiry",
    icon: Headset,
  },
];

export const ONBOARDING_HIGHLIGHTS = [
  {
    id: 1,
    title: "Privacy Friendly",
    description:
      "We protect your profile data with strict privacy controls and secure onboarding checks.",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Genuine Profiles",
    description:
      "Every account is reviewed so you connect only with genuine members and verified listings.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Live Support",
    description:
      "Our support team is available to help you through registration, profile setup, and membership questions.",
    icon: Headset,
  },
  {
    id: 4,
    title: "Paid Accounts",
    description:
      "Premium membership gives you priority access to curated matches and elite visibility.",
    icon: CreditCard,
  },
];

export const RELIGIONS_AND_CASTES: Record<string, string[]> = {
  Buddhism: ["Govi", "Karava", "Durava", "Salagama", "Other"],
  Hinduism: ["Brahmin", "Vellalar", "Chettiar", "Arunthathiyar", "Other"],
  Christianity: ["Catholic", "Anglican", "Methodist", "Pentecostal", "Other"],
  Islam: ["Sunni", "Shia", "Moor", "Malay", "Other"],
};

export const MOTHER_TONGUES = [
  "Sinhala",
  "Tamil",
  "English",
  "Arabic",
  "Malayalam",
];

export const COMMUNITIES = [
  {
    label: "Catholic",
    icon: "/icons/catholic-icon.svg",
    adLength: 30,
  },
  {
    label: "Buddhist",
    icon: "/icons/buddhist-icon.svg",
    adLength: 30,
  },
  {
    label: "Christian",
    icon: "/icons/christian-icon.svg",
    adLength: 30,
  },
  {
    label: "Tamil",
    icon: "/icons/tamil-icon.svg",
    adLength: 45,
  },
];

export const FAQS = [
  {
    id: 1,
    question: "How do I create an account?",
    answer:
      "Click the Sign Up button on the homepage, fill in your details, verify your email, and complete your profile to get started.",
  },
  {
    id: 2,
    question: "Is my personal information secure?",
    answer:
      "We use industry-standard encryption and strict access controls to protect your data. Review our Privacy Policy for full details.",
  },
  {
    id: 3,
    question: "How can I report inappropriate content or users?",
    answer:
      "Use the Report button on the user's profile or the chat message, or contact support with details so we can investigate promptly.",
  },
  {
    id: 4,
    question: "Can I delete my account?",
    answer:
      "Yes. Go to Account Settings > Delete Account. Deleting will remove your profile and data according to our retention policy.",
  },
];

export const RESOURCE_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Pricing", href: "/pricing" },
  { label: "Help", href: "/help" },
];

export const LEARN_MORE_LINKS = [
  { label: "Monthly Magazine", href: "/monthly-magazine" },
  { label: "Blog", href: "/blog" },
];

export const PRICING_PACKAGES = [
  {
    id: 1,
    name: "Classical",
    description: "Essential listing for thoughtful",
    price: "LKR 1,999",
    inclusions: [
      "Send unlimited interests",
      "View up to 50 verified contacts",
      "Standard profile tagging",
      "Featured profile listing",
    ],
  },
  {
    id: 2,
    name: "Heritage",
    description: "Enhanced visibility with curated introductions.",
    price: "LKR 4,499",
    inclusions: [
      "Priority in search results",
      "View unlimited verified contacts",
      "Profile boost twice monthly",
      "Verified badge on profile",
    ],
  },
  {
    id: 3,
    name: "Elite",
    description: "Full concierge service for selective families.",
    price: "LKR 9,999",
    inclusions: [
      "Dedicated matchmaker",
      "Bespoke intro sequences",
      "Background verification service",
      "Exclusive Elite events access",
    ],
  },
];

export const ONBOARDING_STEPS: StepConfig[] = [
  { id: 1, title: "the essentials", tagline: "the beginning" },
  { id: 2, title: "roots & heritage", tagline: "identity & roots" },
  { id: 3, title: "aspirations & achievements", tagline: "the journey" },
  { id: 4, title: "location & residency", tagline: "where you call home" },
  {
    id: 5,
    title: "Personal & Physical Details",
    tagline: "complete your profile",
  },
  {
    id: 6,
    title: "Hobbies & Interests",
    tagline: "tell us what you love",
  },
];

export const PERSONAL_DROPDOWNS = {
  education_levels: [
    "Less than High School",
    "High School Graduate / GED",
    "Some College / Associate Degree",
    "Bachelor's Degree",
    "Graduate / Professional Degree",
  ],
  annual_income_ranges: [
    "Under LKR 600,000",
    "LKR 600,000 to LKR 1,199,999",
    "LKR 1,200,000 to LKR 2,399,999",
    "LKR 2,400,000 to LKR 4,799,999",
    "LKR 4,800,000 and over",
  ],
  hobbies: [
    { label: "Traveling", icon: "✈️" },
    { label: "Cooking", icon: "🍳" },
    { label: "Reading", icon: "📚" },
    { label: "Fitness", icon: "🏋️‍♂️" },
    { label: "Music", icon: "🎵" },
    { label: "Painting", icon: "🎨" },
    { label: "Gaming", icon: "🎮" },
    { label: "Photography", icon: "📸" },
  ],
};

export const LK_DATA: LKRegionMap = {
  Colombo: [
    "Colombo 1-15",
    "Dehiwala",
    "Mount Lavinia",
    "Nugegoda",
    "Maharagama",
    "Kottawa",
    "Malabe",
    "Battaramulla",
    "Kaduwela",
    "Avissawella",
    "Homagama",
    "Kolonnawa",
  ],
  Gampaha: [
    "Negombo",
    "Gampaha Town",
    "Wattala",
    "Ja-Ela",
    "Kelaniya",
    "Ragama",
    "Kiribathgoda",
    "Kadawatha",
    "Minuwangoda",
    "Nittambuwa",
    "Mirigama",
    "Veyangoda",
  ],
  Kalutara: [
    "Kalutara Town",
    "Panadura",
    "Horana",
    "Matugama",
    "Beruwala",
    "Aluthgama",
    "Ingiriya",
  ],
  Kandy: [
    "Kandy City",
    "Peradeniya",
    "Katugastota",
    "Gampola",
    "Nawalapitiya",
    "Kundasale",
    "Gelioya",
  ],
  Matale: ["Matale Town", "Dambulla", "Sigiriya", "Ukuwela", "Rattota"],
  "Nuwara Eliya": [
    "Nuwara Eliya Town",
    "Hatton",
    "Talawakele",
    "Ginigathena",
    "Walapane",
  ],
  Galle: [
    "Galle Fort",
    "Hikkaduwa",
    "Ambalangoda",
    "Karapitiya",
    "Elpitiya",
    "Ahangama",
    "Baddegama",
  ],
  Matara: [
    "Matara Town",
    "Weligama",
    "Akuressa",
    "Dikwella",
    "Hakmana",
    "Deniyaya",
  ],
  Hambantota: [
    "Hambantota",
    "Tangalle",
    "Beliatta",
    "Ambalantota",
    "Tissamaharama",
  ],
  Jaffna: [
    "Jaffna Town",
    "Chavakachcheri",
    "Point Pedro",
    "Nallur",
    "Karainagar",
    "Kayts",
  ],
  Kilinochchi: ["Kilinochchi Town", "Poonakary", "Karachchi", "Pallai"],
  Mannar: ["Mannar Town", "Murunkan", "Madhu"],
  Vavuniya: ["Vavuniya Town", "Cheddikulam", "Nedunkeni"],
  Mullaitivu: ["Mullaitivu Town", "Puthukkudiyiruppu", "Oddusuddan"],
  Batticaloa: [
    "Batticaloa Town",
    "Kattankudy",
    "Eravur",
    "Kalkudah",
    "Valachchenai",
  ],
  Ampara: [
    "Ampara Town",
    "Kalmunai",
    "Sainthamaruthu",
    "Akkaraipattu",
    "Sammanthurai",
  ],
  Trincomalee: ["Trincomalee Town", "Kinniya", "Mutur", "Kantale"],
  Kurunegala: [
    "Kurunegala Town",
    "Kuliyapitiya",
    "Narammala",
    "Wariyapola",
    "Pannala",
    "Ibbagamuwa",
  ],
  Puttalam: [
    "Puttalam Town",
    "Chilaw",
    "Marawila",
    "Wennappuwa",
    "Anamaduwa",
    "Dankotuwa",
  ],
  Anuradhapura: [
    "Anuradhapura Town",
    "Mihintale",
    "Tambuttegama",
    "Kekirawa",
    "Medawachchiya",
  ],
  Polonnaruwa: [
    "Polonnaruwa Town",
    "Hingurakgoda",
    "Kaduruwela",
    "Medirigiriya",
  ],
  Badulla: [
    "Badulla Town",
    "Bandarawela",
    "Hali-Ela",
    "Diyatalawa",
    "Ella",
    "Mahiyanganaya",
    "Welimada",
  ],
  Moneragala: [
    "Moneragala Town",
    "Wellawaya",
    "Kataragama",
    "Bibile",
    "Buttala",
  ],
  Ratnapura: [
    "Ratnapura Town",
    "Balangoda",
    "Embilipitiya",
    "Pelmadulla",
    "Kuruwita",
  ],
  Kegalle: [
    "Kegalle Town",
    "Mawanella",
    "Rambukkana",
    "Dehiowita",
    "Ruwanwella",
    "Warakapola",
  ],
};

export const GROUPS_PROFESSIONS = [
  {
    category: "ADMINISTRATION",
    roles: [
      "Manager",
      "Supervisor",
      "Officer",
      "Administrative Professional",
      "Executive",
      "Clerk",
      "Human Resources Professional",
      "Secretary / Front Office",
    ],
  },
  {
    category: "AGRICULTURE",
    roles: ["Agriculture & Farming Professional", "Horticulturist"],
  },
  {
    category: "AIRLINE",
    roles: ["Pilot", "Air Hostess / Flight Attendant", "Airline Professional"],
  },
  {
    category: "ARCHITECTURE & DESIGN",
    roles: ["Architect", "Interior Designer"],
  },
  {
    category: "BANKING & FINANCE",
    roles: [
      "Accountant",
      "Financial Analyst",
      "Investment Banker",
      "Auditor",
      "Tax Consultant",
    ],
  },
  {
    category: "TECHNOLOGY & SOFTWARE",
    roles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Data Scientist",
      "UI/UX Designer",
      "Product Manager",
    ],
  },
];

export const STATUS_ACTIONS = {
  active: [
    {
      icon: Flag,
      color: "text-amber-500 border-amber-500 hover:bg-amber-300",
      action: "onUserFlag",
      label: "Flag Account",
    },
    {
      icon: Ban,
      color: "text-red-500 border-red-200 hover:bg-red-200",
      action: "onUserSuspend",
      label: "Suspend Account",
    },
  ],
  flagged: [
    {
      icon: RefreshCw,
      color: "text-emerald-500 border-emerald-200 hover:bg-emerald-50",
      action: "onUserReactivate",
      label: "Reactivate",
    },
  ],
} as const;

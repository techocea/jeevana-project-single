import {AppRole, LKRegionMap, StepConfig} from "@/types";
import {
    FileText,
    Send,
    MessageCircle,
    FingerprintPattern,
    Brush,
    ShieldCheck,
    Headset,
    FilePen,
    BadgeCheck,
    BarChart3,
    FileSearch, Settings, Users, Search, Mail, Home, User, CreditCard
} from "lucide-react";

import {MemberNavItem} from "@/components/layout/user-sidebar";

export interface NavSubItem {
    title: string;
    url: string;
    roles?: AppRole[];
}

export interface NavMainGroup {
    title: string;
    roles?: AppRole[];
    items?: NavSubItem[];
}

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

export const ADMIN_DASHBOARD_SIDEBAR: { navMain: NavMainGroup[] } = {
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
            roles: ["admin"],
            items: [
                {
                    title: "Transactions",
                    url: "/control-panel/transactions",
                    roles: ["admin"]
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
                // {
                //   title: "Staff Management",
                //   url: "/control-panel/staff-management",
                // },
                {
                    title: "System Settings",
                    url: "/control-panel/system-settings",
                    roles: ["admin"]
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

export const RELIGIONS_AND_CASTES: Record<string, string[]> = {
    Buddhism: ["Govi", "Karava", "Durava", "Salagama", "Other"],
    Hinduism: ["Brahmin", "Vellalar", "Chettiar", "Arunthathiyar", "Other"],
    Christianity: ["Catholic", "Anglican", "Methodist", "Pentecostal", "Other"],
    Islam: ["Sunni", "Shia", "Moor", "Malay", "Other"],
};

export const MARITAL_STATUSES = [
    {
        label: "Single",
        value: "single",
    },
    {
        label: "Divorced",
        value: "divorced",
    },
    {
        label: "Widowed",
        value: "widowed",
    },
];

export const COMPLEXION_TYPES = [
    {
        label: "Very Fair",
        value: "very_fair",
    },
    {
        label: "Fair",
        value: "fair",
    },
    {
        label: "Medium",
        value: "medium",
    },
    {
        label: "Brown",
        value: "brown",
    },
    {
        label: "Dark Brown",
        value: "dark_brown",
    },
    {
        label: "Black",
        value: "black",
    },
    {
        label: "Not Specified",
        value: "not_specified",
    }
];

export const BODY_TYPES = [
    {
        label: "Slim",
        value: "slim",
    },
    {
        label: "Athletic",
        value: "athletic",
    },
    {
        label: "Average",
        value: "average",
    },
    {
        label: "Small",
        value: "small",
    },
    {
        label: "Not Specified",
        value: "not_specified",
    }
];

export const BLOOD_GROUPS = [
    {
        label: "A+",
        value: "A+",
    },
    {
        label: "A-",
        value: "A-",
    },
    {
        label: "B+",
        value: "B+",
    },
    {
        label: "B-",
        value: "B-",
    },
    {
        label: "AB+",
        value: "AB+",
    },
    {
        label: "O+",
        value: "O+",
    },
    {
        label: "O-",
        value: "O-",
    },
    {
        label: "Not Specified",
        value: "not_specified",
    }
];

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
        href: "/search?religion=catholicism",
        adLength: 30,
    },
    {
        label: "Buddhist",
        icon: "/icons/buddhist-icon.svg",
        href: "/search?religion=buddhism",
        adLength: 30,
    },
    {
        label: "Muslim",
        icon: "/icons/christian-icon.svg",
        href: "/search?religion=islam",
        adLength: 30,
    },
    {
        label: "Tamil",
        icon: "/icons/tamil-icon.svg",
        href: "/search?religion=hinduism",
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
    {label: "Privacy Policy", href: "/privacy-policy"},
    {label: "Terms of Service", href: "/terms-of-service"},
    {label: "Pricing", href: "/pricing"},
    {label: "Help", href: "/help"},
];

export const LEARN_MORE_LINKS = [
    {label: "Monthly Magazine", href: "/monthly-magazine"},
    {label: "Blog", href: "/blog"},
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
];

export const NAV_ITEMS: MemberNavItem[] = [
    {
        id: 1,
        label: "Overview",
        href: "/my-dashboard",
        iconName: "home",
    },
    {
        id: 2,
        label: "My Profile",
        href: "/my-dashboard/my-profile",
        iconName: "user",
    },
    {
        id: 3,
        label: "Best Proposals",
        href: "/my-dashboard/best-proposals",
        iconName: "search",
    },
    {
        id: 4,
        label: "Invitations",
        href: "/my-dashboard/invitations",
        iconName: "mail",
    },
    {
        id: 5,
        label: "Verify Account",
        href: "/my-dashboard/verify",
        iconName: "shield-check",
    },
    {
        id: 6,
        label: "Membership & Billing",
        href: "/my-dashboard/membership",
        iconName: "credit-card",
    },
    {
        id: 7,
        label: "Settings",
        href: "/my-dashboard/settings",
        iconName: "settings",
    },
];

export const ADMIN_NAV_ITEMS: MemberNavItem[] = [
    {
        id: 1,
        label: "Operations Overview",
        href: "/control-panel",
        iconName: "bar-chart",
    },
    {
        id: 2,
        label: "Profile Reviews",
        href: "/control-panel/reviews",
        iconName: "file-search",
    },
    {
        id: 3,
        label: "Profile Changes",
        href: "/control-panel/changes",
        iconName: "file-pen",
    },
    {
        id: 4,
        label: "NIC Verification Queue",
        href: "/control-panel/verification",
        iconName: "badge-check",
    },
    {
        id: 5,
        label: "Member Directory",
        href: "/control-panel/members",
        iconName: "users",
    },
    // {
    //     id: 6,
    //     label: "Invitation Surveillance",
    //     href: "/control-panel/invitations",
    //     iconName: "mail",
    // },
    {
        id: 7,
        label: "Business Revenue & Analytics",
        href: "/control-panel/revenue",
        iconName: "credit-card",
    },
];

export const ONBOARDING_STEPS: StepConfig[] = [
    {id: 1, title: 'Basic Details', subtitle: 'Demographics & Lineage'},
    {id: 2, title: 'Family Background', subtitle: 'Household & Heritage'},
    {id: 3, title: 'Education & Career', subtitle: 'Qualifications & Profession'},
    {id: 4, title: 'About Me & Photo', subtitle: 'Bio & Modest Portrait'},
    {id: 5, title: 'Partner Preferences', subtitle: 'Desired Qualities'},
    {id: 6, title: 'Review Details', subtitle: 'Final Verification'},
];

export const PERSONAL_DROPDOWNS = {
    education_levels: [
        "Less than High School",
        "High School Graduate / GED",
        "Some College / Associate Degree",
        "Bachelor's Degree",
        "Graduate / Professional Degree",
    ],
    employed_in: ["Government Sector", "Private Corporate", "Self-Employed / Business", "Academic / Research", "NGO / International Agency"],
    annual_income_ranges: [
        "Under LKR 600,000",
        "LKR 600,000 to LKR 1,199,999",
        "LKR 1,200,000 to LKR 2,399,999",
        "LKR 2,400,000 to LKR 4,799,999",
        "LKR 4,800,000 and over",
    ],
    hobbies: [
        {label: "Traveling", icon: "✈️"},
        {label: "Cooking", icon: "🍳"},
        {label: "Reading", icon: "📚"},
        {label: "Fitness", icon: "🏋️‍♂️"},
        {label: "Music", icon: "🎵"},
        {label: "Painting", icon: "🎨"},
        {label: "Gaming", icon: "🎮"},
        {label: "Photography", icon: "📸"},
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

// ─── Demo Profiles ────────────────────────────────────────────────────────────
// MAIN_DEMO_PROFILE  –  the account used for quick walkthroughs / screenshots.
// Raw credentials are intentionally stored here (dev/demo only, never production).
export const MAIN_DEMO_PROFILE = {
    // Auth credentials
    email: "demo.kasun@jeevana.lk",
    password: "Demo@123456",

    // Profile
    createdBy: "self",
    fullName: "Kasun Rajapaksha",
    contact: "+94771234567",
    gender: "male",
    dob: "1995-04-10",
    religion: "Buddhism",
    caste: "Govi",
    motherTongue: "Sinhala",
    maritalStatus: "single",

    // Physical
    height: "175",
    weight: "72",
    complexion: "medium",
    bodyType: "athletic",
    bloodGroup: "B+",
    smoking: "never",
    drinking: "never",
    foodPreferences: "non-vegetarian",
    isDifferentlyAbled: false,

    // Education & Career
    educationLevel: "Bachelor's Degree",
    educationDescription: "BSc (Hons) Software Engineering – University of Moratuwa",
    profession: "Software Engineer",
    employedIn: "Private Corporate",
    annualIncomeRange: "LKR 2,400,000 to LKR 4,799,999",

    // Location
    country: "Sri Lanka",
    state: "Colombo",
    city: "Nugegoda",
    residencyStatus: "CITIZEN",

    // About
    narrative:
        "A detail-oriented software engineer who enjoys clean code, trail running, and weekend drives to the hill country. Family-oriented with strong Buddhist values.",
    hobbies: ["Fitness", "Traveling", "Reading", "Photography"],
    profilePic: "/images/demo-profile-pic.png",
    photoVisible: true,
    status: "approved",

    // Partner preferences
    partnerPreferences: {
        preferredMinAge: 23,
        preferredMaxAge: 30,
        preferredReligions: ["Buddhism", "Christianity"],
        preferredCastes: [],
        preferredMaritalStatuses: "single",
        preferredEducationLevels: ["Bachelor's Degree", "Graduate / Professional Degree"],
        preferredProfessions: [
            "Software Engineer",
            "Financial Analyst",
            "Data Scientist",
            "Doctor",
            "UI/UX Designer",
            "Accountant",
        ],
        preferredAnnualIncomeRanges: [
            "LKR 1,200,000 to LKR 2,399,999",
            "LKR 2,400,000 to LKR 4,799,999",
        ],
        preferredResidencyStatuses: ["CITIZEN", "PR_VISA"],
    },
};

// SAMPLE_PROFILES  –  6 female profiles that satisfy MAIN_DEMO_PROFILE's
// partner preferences (age 23-30, Buddhist/Christian, degree+, matching
// profession & income bracket, single, Sri Lankan citizen / PR).
export const sampleProfiles = [
    {
        // ── Match 1 ──────────────────────────────────────────────────────────
        email: "dilini.perera@jeevana.lk",
        createdBy: "self",
        fullName: "Dilini Perera",
        contact: "+94778901234",
        gender: "female",
        dob: "2000-08-14", // age 26 ✓
        religion: "Buddhism", // ✓
        caste: "Govi",
        motherTongue: "Sinhala",
        maritalStatus: "single", // ✓

        height: "165",
        weight: "55",
        complexion: "fair",
        bodyType: "slim",
        bloodGroup: "A+",
        smoking: "never",
        drinking: "never",
        foodPreferences: "vegetarian",
        isDifferentlyAbled: false,

        educationLevel: "Bachelor's Degree", // ✓
        educationDescription: "BSc (Hons) Information Technology – UCSC",
        profession: "UI/UX Designer", // ✓
        employedIn: "Private Corporate",
        annualIncomeRange: "LKR 1,200,000 to LKR 2,399,999", // ✓

        country: "Sri Lanka",
        state: "Colombo",
        city: "Colombo",
        residencyStatus: "CITIZEN", // ✓

        narrative:
            "Design enthusiast who believes great experiences start with empathy. Art galleries, coffee tasting, and beach getaways keep me inspired.",
        hobbies: ["Painting", "Traveling", "Fitness"],
        profilePic:
            "https://njmjwpwawggmyqvjdbwu.supabase.co/storage/v1/object/public/profile_images/avatars/dilini.png",
        photoVisible: true,
        status: "approved",
    },
    {
        // ── Match 2 ──────────────────────────────────────────────────────────
        email: "kavindi.silva@jeevana.lk",
        createdBy: "self",
        fullName: "Kavindi Silva",
        contact: "+94712345678",
        gender: "female",
        dob: "1999-11-03", // age 27 ✓
        religion: "Christianity", // ✓
        caste: "Catholic",
        motherTongue: "English",
        maritalStatus: "single", // ✓

        height: "168",
        weight: "58",
        complexion: "fair",
        bodyType: "slim",
        bloodGroup: "O+",
        smoking: "never",
        drinking: "never",
        foodPreferences: "non-vegetarian",
        isDifferentlyAbled: false,

        educationLevel: "Graduate / Professional Degree", // ✓
        educationDescription: "Master's in Data Analytics – University of Colombo",
        profession: "Data Scientist", // ✓
        employedIn: "Private Corporate",
        annualIncomeRange: "LKR 2,400,000 to LKR 4,799,999", // ✓

        country: "Sri Lanka",
        state: "Gampaha",
        city: "Negombo",
        residencyStatus: "CITIZEN", // ✓

        narrative:
            "Passionate about numbers and machine learning. Looking for an intelligent, grounded partner who values honest conversation and lifelong learning.",
        hobbies: ["Reading", "Music", "Fitness"],
        profilePic:
            "https://njmjwpwawggmyqvjdbwu.supabase.co/storage/v1/object/public/profile_images/avatars/kavindi.png",
        photoVisible: true,
        status: "approved",
    },
    {
        // ── Match 3 ──────────────────────────────────────────────────────────
        email: "shenali.jayasinghe@jeevana.lk",
        createdBy: "self",
        fullName: "Shenali Jayasinghe",
        contact: "+94709876543",
        gender: "female",
        dob: "2001-05-20", // age 25 ✓
        religion: "Buddhism", // ✓
        caste: "Govi",
        motherTongue: "Sinhala",
        maritalStatus: "single", // ✓

        height: "162",
        weight: "52",
        complexion: "medium",
        bodyType: "slim",
        bloodGroup: "B+",
        smoking: "never",
        drinking: "never",
        foodPreferences: "non-vegetarian",
        isDifferentlyAbled: false,

        educationLevel: "Bachelor's Degree", // ✓
        educationDescription: "BSc (Hons) Software Engineering – University of Kelaniya",
        profession: "Software Engineer", // ✓
        employedIn: "Private Corporate",
        annualIncomeRange: "LKR 1,200,000 to LKR 2,399,999", // ✓

        country: "Sri Lanka",
        state: "Colombo",
        city: "Dehiwala",
        residencyStatus: "CITIZEN", // ✓

        narrative:
            "Full-stack developer by day, casual gamer by night. Big fan of open-source software and exploring hidden cafés around Colombo.",
        hobbies: ["Gaming", "Photography", "Traveling"],
        profilePic:
            "https://njmjwpwawggmyqvjdbwu.supabase.co/storage/v1/object/public/profile_images/avatars/shenali.png",
        photoVisible: true,
        status: "approved",
    },
    {
        // ── Match 4 ──────────────────────────────────────────────────────────
        email: "tharushi.wickramasinghe@jeevana.lk",
        createdBy: "self",
        fullName: "Tharushi Wickramasinghe",
        contact: "+94765432109",
        gender: "female",
        dob: "1998-09-18", // age 28 ✓
        religion: "Buddhism", // ✓
        caste: "Karava",
        motherTongue: "Sinhala",
        maritalStatus: "single", // ✓

        height: "160",
        weight: "50",
        complexion: "fair",
        bodyType: "slim",
        bloodGroup: "A-",
        smoking: "never",
        drinking: "never",
        foodPreferences: "vegetarian",
        isDifferentlyAbled: false,

        educationLevel: "Bachelor's Degree", // ✓
        educationDescription: "BBA – University of Sri Jayewardenepura",
        profession: "Financial Analyst", // ✓
        employedIn: "Private Corporate",
        annualIncomeRange: "LKR 1,200,000 to LKR 2,399,999", // ✓

        country: "Sri Lanka",
        state: "Kandy",
        city: "Kandy City",
        residencyStatus: "CITIZEN", // ✓

        narrative:
            "Numbers enthusiast and outdoor photography lover. Believe in building a home where respect and laughter go hand in hand.",
        hobbies: ["Photography", "Traveling", "Cooking"],
        profilePic:
            "https://njmjwpwawggmyqvjdbwu.supabase.co/storage/v1/object/public/profile_images/avatars/tharushi.png",
        photoVisible: true,
        status: "approved",
    },
    {
        // ── Match 5 ──────────────────────────────────────────────────────────
        email: "amaya.fernando@jeevana.lk",
        createdBy: "self",
        fullName: "Amaya Fernando",
        contact: "+94756789012",
        gender: "female",
        dob: "1997-03-25", // age 29 ✓
        religion: "Christianity", // ✓
        caste: "Anglican",
        motherTongue: "Sinhala",
        maritalStatus: "single", // ✓

        height: "167",
        weight: "57",
        complexion: "fair",
        bodyType: "average",
        bloodGroup: "O-",
        smoking: "never",
        drinking: "never",
        foodPreferences: "non-vegetarian",
        isDifferentlyAbled: false,

        educationLevel: "Graduate / Professional Degree", // ✓
        educationDescription: "MBBS – University of Colombo, Faculty of Medicine",
        profession: "Doctor", // ✓
        employedIn: "Government Sector",
        annualIncomeRange: "LKR 2,400,000 to LKR 4,799,999", // ✓

        country: "Sri Lanka",
        state: "Colombo",
        city: "Battaramulla",
        residencyStatus: "CITIZEN", // ✓

        narrative:
            "Medical officer passionate about community health. Finds balance through hiking, classical music, and volunteering at rural health clinics.",
        hobbies: ["Fitness", "Music", "Reading"],
        profilePic:
            "https://njmjwpwawggmyqvjdbwu.supabase.co/storage/v1/object/public/profile_images/avatars/amaya.png",
        photoVisible: true,
        status: "approved",
    },
    {
        // ── Match 6 ──────────────────────────────────────────────────────────
        email: "nethmi.dissanayake@jeevana.lk",
        createdBy: "self",
        fullName: "Nethmi Dissanayake",
        contact: "+94741122334",
        gender: "female",
        dob: "2002-07-08", // age 24 ✓ (minimum edge)
        religion: "Buddhism", // ✓
        caste: "Govi",
        motherTongue: "Sinhala",
        maritalStatus: "single", // ✓

        height: "163",
        weight: "53",
        complexion: "medium",
        bodyType: "slim",
        bloodGroup: "AB+",
        smoking: "never",
        drinking: "never",
        foodPreferences: "vegetarian",
        isDifferentlyAbled: false,

        educationLevel: "Bachelor's Degree", // ✓
        educationDescription: "BSc (Hons) Accounting & Finance – University of Sri Jayewardenepura",
        profession: "Accountant", // ✓
        employedIn: "Private Corporate",
        annualIncomeRange: "LKR 1,200,000 to LKR 2,399,999", // ✓

        country: "Sri Lanka",
        state: "Colombo",
        city: "Maharagama",
        residencyStatus: "CITIZEN", // ✓

        narrative:
            "Detail-oriented accountant who loves precision at work and spontaneity on weekends. Enjoys cooking, reading financial thrillers, and long drives.",
        hobbies: ["Cooking", "Reading", "Traveling"],
        profilePic:
            "https://njmjwpwawggmyqvjdbwu.supabase.co/storage/v1/object/public/profile_images/avatars/nethmi.png",
        photoVisible: true,
        status: "approved",
    },
];

export const sampleProposals = [
    {
        id: 'JV-71042',
        displayName: 'Kasun P.',
        age: 30,
        height: "5' 10\"",
        location: 'Nugegoda, Western Province',
        education: 'MSc in Computer Science (UCSC), BSc Eng (Moratuwa)',
        occupation: 'Lead Solutions Architect at Global FinTech',
        religion: 'Buddhist',
        maritalStatus: 'Never Married',
        photoUrl: '/images/profile-1.png',
        photoVisible: true,
        phoneVerified: true,
        nicVerified: true,
        summary: 'Solutions architect with a passion for innovation, nature photography, and traditional arts.',
        aboutMe: 'Brought up in a respectable Buddhist family with strong educational foundations. Father is a chartered civil engineer, mother is a homemaker. Enjoys road trips, playing cricket, and community service.',
        diet: 'Non-Vegetarian',
        partnerPreferences: {
            ageRange: '26 - 31 years',
            education: 'Bachelor or Postgraduate Degree',
            location: 'Colombo, Gampaha or Overseas',
            profession: 'Doctor, Engineer, Banker, or Corporate Professional',
        },
        registeredDate: '2026-10-12',
    },
    {
        id: 'JV-63914',
        displayName: 'Priyanka F.',
        age: 27,
        height: "5' 5\"",
        location: 'Kandy, Central Province',
        education: 'CFA Charterholder, BSc in Economics (LSE Online / Colombo)',
        occupation: 'Senior Equity Research Analyst',
        religion: 'Christian (Catholic)',
        maritalStatus: 'Never Married',
        photoUrl: '/images/profile-1.png',
        photoVisible: true,
        phoneVerified: true,
        nicVerified: true,
        summary: 'Chartered financial analyst from Kandy, values faith, close-knit family bonds, and classical piano.',
        aboutMe: 'A balanced individual who enjoys quiet weekends, reading historical fiction, and volunteering at youth education centres. Respectable family background from Kandy.',
        diet: 'Non-Vegetarian',
        partnerPreferences: {
            ageRange: '28 - 33 years',
            education: 'Professional Qualification / Degree',
            location: 'Kandy, Colombo or UK/Australia',
            profession: 'Finance, Medicine, Law, or Management',
        },
        registeredDate: '2026-10-15',
    },
    {
        id: 'JV-88231',
        displayName: 'Dilshan W.',
        age: 32,
        height: "6' 0\"",
        location: 'Mount Lavinia, Colombo',
        education: 'BSc Civil Engineering (Hons), Moratuwa',
        occupation: 'Senior Project Manager, Marine Engineering',
        religion: 'Buddhist',
        maritalStatus: 'Never Married',
        photoUrl: '/src/assets/images/profile_dilshan_1793045050200.jpg',
        photoVisible: true,
        phoneVerified: true,
        nicVerified: true,
        summary: 'Senior civil engineer passionate about coastal sustainability, badminton, and acoustic guitar.',
        aboutMe: 'Raised in a warm, traditional family. Looking for an educated partner who appreciates simple life pleasures, mutual respect, and cheerful conversation.',
        diet: 'Vegetarian',
        partnerPreferences: {
            ageRange: '26 - 31 years',
            education: 'Degree Holder',
            location: 'Western Province / Southern Province',
            profession: 'Professional or Academic background',
        },
        registeredDate: '2026-10-20',
    },
    {
        id: 'JV-92147',
        displayName: 'Dr. Thivanka S.',
        age: 31,
        height: "5' 9\"",
        location: 'Kurunegala / Colombo',
        education: 'MBBS, MD Anaesthesiology trainee',
        occupation: 'Medical Doctor, Teaching Hospital Kurunegala',
        religion: 'Buddhist',
        maritalStatus: 'Never Married',
        photoUrl: '', // Photo hidden / privacy mode
        photoVisible: false,
        phoneVerified: true,
        nicVerified: true,
        summary: 'Dedicated doctor from a respected medical family. Photo kept confidential per family request.',
        aboutMe: 'Values simplicity, patient care, and Buddhist mindfulness principles. Both parents are retired educators. Looking for a cultured, kind-hearted companion.',
        diet: 'Non-Vegetarian',
        partnerPreferences: {
            ageRange: '25 - 30 years',
            education: 'Medicine, Dentistry, or Postgraduate Degree',
            location: 'North Western / Western / Central',
            profession: 'Doctor, Lecturer, or Executive',
        },
        registeredDate: '2026-10-22',
    },
    {
        id: 'JV-79822',
        displayName: 'Ravi S.',
        age: 29,
        height: "5' 8\"",
        location: 'Jaffna / Colombo',
        education: 'BSc Accounting & Finance, ACCA Member',
        occupation: 'Tax & Assurance Manager, Big 4 Colombo',
        religion: 'Hindu',
        maritalStatus: 'Never Married',
        photoUrl: '',
        photoVisible: false,
        phoneVerified: true,
        nicVerified: false,
        summary: 'Chartered accountant with strong family values and analytical discipline.',
        aboutMe: 'Grew up in Jaffna and Colombo. Enjoys South Indian classical music, tennis, and culinary exploration. Seeking a partner with mutual understanding and warmth.',
        diet: 'Vegetarian',
        partnerPreferences: {
            ageRange: '24 - 29 years',
            education: 'Degree / Professional qualification',
            location: 'Colombo or Northern Province',
            profession: 'Banking, Accounting, or IT',
        },
        registeredDate: '2026-10-24',
    },
    {
        id: 'JV-83419',
        displayName: 'Ashan K.',
        age: 33,
        height: "5' 11\"",
        location: 'Melbourne, Australia (Expat)',
        education: 'Master of Data Science (Monash), BEng (Peradeniya)',
        occupation: 'Principal Data Scientist, Australian Banking Group',
        religion: 'Buddhist',
        maritalStatus: 'Never Married',
        photoUrl: '/src/assets/images/profile_kasun_1793045049586.jpg', // Reusing placeholder
        photoVisible: true,
        phoneVerified: true,
        nicVerified: true,
        summary: 'Australian PR holder visiting Sri Lanka twice a year. Looking for an open-minded partner willing to settle in Melbourne.',
        aboutMe: 'Educated at Peradeniya University, currently living in Hawthorn, Melbourne. Enjoys trail running, specialty coffee brewing, and reading books on philosophy.',
        diet: 'Non-Vegetarian',
        partnerPreferences: {
            ageRange: '27 - 32 years',
            education: 'Bachelor or Masters Degree',
            location: 'Sri Lanka or Australia',
            profession: 'Open to any professional career',
        },
        registeredDate: '2026-10-08',
    },
];

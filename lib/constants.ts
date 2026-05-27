import { StepConfig } from "@/types";
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
} from "lucide-react";

export const STEP_STRING_TO_NUMBER: Record<string, number> = {
  START: 1,
  RELIGION: 2,
  ACHIEVEMENTS: 3,
  LOCATION: 4,
  PERSONAL: 5,
  HOBBIES: 6,
  COMPLETED: 6,
};

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

export const PROFILES = [
  {
    fullName: "Arjun Perera",
    email: "arjun.perera@example.com",
    contact: "+94 77 123 4567",
    image: "/images/profile-1.png",
    isVerified: true,
    gender: "Male",
    dob: "1992-03-14",
    age: 34,
    religion: "Buddhism",
    caste: "Goyigama",
    motherTongue: "Sinhala",
    educationLevel: "Bachelor's Degree",
    profession: "Software Engineer",
    annualIncomeRange: "LKR 1,500,000 - 2,500,000",
    country: "Sri Lanka",
    state: "Western Province",
    city: "Colombo",
    height: 175,
    weight: 72,
    narrative:
      "Looking for a partner who values family, education, and a balanced lifestyle.",
  },
  {
    fullName: "Nadeesha Fernando",
    email: "nadeesha.fernando@example.com",
    contact: "+94 71 234 5678",
    image: "/images/profile-1.png",
    isVerified: false,
    gender: "Female",
    dob: "1995-08-22",
    age: 30,
    religion: "Christianity",
    caste: "Salagama",
    motherTongue: "Sinhala",
    educationLevel: "Master's Degree",
    profession: "Marketing Manager",
    annualIncomeRange: "LKR 1,000,000 - 1,500,000",
    country: "Sri Lanka",
    state: "Western Province",
    city: "Negombo",
    height: 162,
    weight: 58,
    narrative:
      "An ambitious and caring person seeking a supportive and kind life partner.",
  },
  {
    fullName: "Rohan Wijesinghe",
    email: "rohan.wijesinghe@example.com",
    contact: "+94 76 345 6789",
    image: "/images/profile-1.png",
    isVerified: true,
    gender: "Male",
    dob: "1989-11-05",
    age: 36,
    religion: "Hinduism",
    caste: "Brahmin",
    motherTongue: "Tamil",
    educationLevel: "Professional Degree",
    profession: "Civil Engineer",
    annualIncomeRange: "LKR 2,500,000 - 3,500,000",
    country: "Sri Lanka",
    state: "Northern Province",
    city: "Jaffna",
    height: 180,
    weight: 78,
    narrative:
      "A stable professional looking for a partner who shares traditional values and modern goals.",
  },
  {
    fullName: "Priya Nandasena",
    email: "priya.nandasena@example.com",
    contact: "+94 70 456 7890",
    image: "/images/profile-1.png",
    isVerified: false,
    gender: "Female",
    dob: "1998-01-30",
    age: 28,
    religion: "Buddhism",
    caste: "Karawa",
    motherTongue: "Sinhala",
    educationLevel: "Bachelor's Degree",
    profession: "Graphic Designer",
    annualIncomeRange: "LKR 800,000 - 1,200,000",
    country: "Sri Lanka",
    state: "Southern Province",
    city: "Galle",
    height: 168,
    weight: 60,
    narrative:
      "Creative, family-oriented, and ready to build a joyful future with the right person.",
  },
  {
    fullName: "Suresh Kumar",
    email: "suresh.kumar@example.com",
    contact: "+94 72 567 8901",
    image: "/images/profile-1.png",
    isVerified: true,
    gender: "Male",
    dob: "1994-06-18",
    age: 31,
    religion: "Hinduism",
    caste: "Vellalar",
    motherTongue: "Tamil",
    educationLevel: "Master's Degree",
    profession: "University Lecturer",
    annualIncomeRange: "LKR 1,500,000 - 2,000,000",
    country: "Sri Lanka",
    state: "Central Province",
    city: "Kandy",
    height: 173,
    weight: 70,
    narrative:
      "Enjoys teaching and culture, seeking a partner with shared values and a warm heart.",
  },
  {
    fullName: "Himali Silva",
    email: "himali.silva@example.com",
    contact: "+94 78 678 9012",
    image: "/images/profile-1.png",
    isVerified: true,
    gender: "Female",
    dob: "1991-04-11",
    age: 35,
    religion: "Buddhism",
    caste: "Durawa",
    motherTongue: "Sinhala",
    educationLevel: "Diploma",
    profession: "Interior Decorator",
    annualIncomeRange: "LKR 700,000 - 1,000,000",
    country: "Sri Lanka",
    state: "Uva Province",
    city: "Badulla",
    height: 165,
    weight: 55,
    narrative:
      "Passionate about design and family, looking for a caring partner to share life's moments.",
  },
  {
    fullName: "Manoj Perera",
    email: "manoj.perera@example.com",
    contact: "+94 75 789 0123",
    image: "/images/profile-1.png",
    isVerified: true,
    gender: "Male",
    dob: "1990-09-02",
    age: 35,
    religion: "Christianity",
    caste: "Karava",
    motherTongue: "Sinhala",
    educationLevel: "Master's Degree",
    profession: "Bank Manager",
    annualIncomeRange: "LKR 2,000,000 - 2,800,000",
    country: "Sri Lanka",
    state: "Western Province",
    city: "Colombo",
    height: 177,
    weight: 75,
    narrative:
      "Confident and dependable, seeking a partner who values commitment and family.",
  },
  {
    fullName: "Anjali Ratnayake",
    email: "anjali.ratnayake@example.com",
    contact: "+94 74 890 1234",
    image: "/images/profile-1.png",
    isVerified: false,
    gender: "Female",
    dob: "1993-12-29",
    age: 32,
    religion: "Buddhism",
    caste: "Goyigama",
    motherTongue: "Sinhala",
    educationLevel: "Bachelor's Degree",
    profession: "Public Relations Specialist",
    annualIncomeRange: "LKR 1,200,000 - 1,700,000",
    country: "Sri Lanka",
    state: "Western Province",
    city: "Sri Jayawardenepura Kotte",
    height: 160,
    weight: 56,
    narrative:
      "Friendly and sociable, looking for a partner who appreciates both tradition and ambition.",
  },
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

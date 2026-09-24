export interface PricingPackage {
    id: number;
    name: string;
    description: string;
    price: string; // display string, e.g. "LKR 1,999" — used by the UI only
    amountCents: number; // the real charge amount, server-side source of truth
    durationDays: number; // how long one successful payment grants access for
    inclusions: string[];
}


export const PRICING_PACKAGES: PricingPackage[] = [
    {
        id: 1,
        name: "Classical",
        description: "Essential listing for thoughtful",
        price: "LKR 1,999",
        amountCents: 199900, // LKR 1,999.00
        durationDays: 30,
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
        amountCents: 449900, // LKR 4,499.00
        durationDays: 30,
        inclusions: [
            "Priority in search results",
            "View unlimited verified contacts",
            "Profile boost twice monthly",
            "Verified badge on profile",
        ],
    },
];

export function getPackageById(packageId: number): PricingPackage | null {
    return PRICING_PACKAGES.find((pkg) => pkg.id === packageId) ?? null;
}
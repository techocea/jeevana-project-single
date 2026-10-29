import { describe, it, expect } from "vitest";
import { PRICING_PACKAGES, getPackageById } from "@/lib/pricing-packages";

describe("PRICING_PACKAGES constant", () => {
  it("contains exactly 2 packages", () => {
    expect(PRICING_PACKAGES).toHaveLength(2);
  });

  it("all packages have positive amountCents", () => {
    PRICING_PACKAGES.forEach((pkg) => {
      expect(pkg.amountCents).toBeGreaterThan(0);
    });
  });

  it("all packages have a positive durationDays", () => {
    PRICING_PACKAGES.forEach((pkg) => {
      expect(pkg.durationDays).toBeGreaterThan(0);
    });
  });

  it("all packages have at least one inclusion", () => {
    PRICING_PACKAGES.forEach((pkg) => {
      expect(pkg.inclusions.length).toBeGreaterThan(0);
    });
  });

  it("package IDs are unique", () => {
    const ids = PRICING_PACKAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Classical package has correct amount (LKR 1,999 = 199900 cents)", () => {
    const classical = PRICING_PACKAGES.find((p) => p.name === "Classical");
    expect(classical?.amountCents).toBe(199900);
    expect(classical?.id).toBe(1);
  });

  it("Heritage package has correct amount (LKR 4,499 = 449900 cents)", () => {
    const heritage = PRICING_PACKAGES.find((p) => p.name === "Heritage");
    expect(heritage?.amountCents).toBe(449900);
    expect(heritage?.id).toBe(2);
  });
});

describe("getPackageById", () => {
  it("returns the Classical package for id 1", () => {
    const pkg = getPackageById(1);
    expect(pkg).not.toBeNull();
    expect(pkg?.name).toBe("Classical");
    expect(pkg?.amountCents).toBe(199900);
  });

  it("returns the Heritage package for id 2", () => {
    const pkg = getPackageById(2);
    expect(pkg).not.toBeNull();
    expect(pkg?.name).toBe("Heritage");
  });

  it("returns null for an unknown id", () => {
    expect(getPackageById(0)).toBeNull();
    expect(getPackageById(999)).toBeNull();
    expect(getPackageById(-1)).toBeNull();
  });

  it("the returned object is a reference into PRICING_PACKAGES", () => {
    expect(getPackageById(1)).toBe(PRICING_PACKAGES[0]);
  });
});

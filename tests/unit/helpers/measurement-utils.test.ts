import { describe, it, expect } from "vitest";
import {
  generateHeightOptions,
  convertCmToFeetInches,
  generateWeightOptions,
} from "@/helpers/measurement-utils";

describe("generateHeightOptions", () => {
  it("generates 37 options (48–84 inclusive)", () => {
    expect(generateHeightOptions()).toHaveLength(37);
  });

  it("first entry is 4'0\" stored as 121.9 cm", () => {
    const first = generateHeightOptions()[0];
    expect(first.label).toBe(`4' 0"`);
    expect(first.value).toBe("121.9");
  });

  it("last entry is 7'0\" stored as 213.4 cm", () => {
    const last = generateHeightOptions().at(-1)!;
    expect(last.label).toBe(`7' 0"`);
    expect(last.value).toBe("213.4");
  });

  it("every option has a non-empty label and numeric value string", () => {
    generateHeightOptions().forEach(({ label, value }) => {
      expect(label).toBeTruthy();
      expect(Number.isNaN(parseFloat(value))).toBe(false);
    });
  });
});

describe("convertCmToFeetInches", () => {
  it("converts 152.4 cm → 5'0\"", () => {
    expect(convertCmToFeetInches("152.4").formatted).toBe(`5' 0"`);
  });

  it("converts 180 cm → 5'11\"", () => {
    // 180 cm / 2.54 ≈ 70.87 in → 70 in → 5'10"
    // round(70.87)=71 → 5'11"
    expect(convertCmToFeetInches(180).formatted).toBe(`5' 11"`);
  });

  it("handles null gracefully → 0'0\"", () => {
    expect(convertCmToFeetInches(null).formatted).toBe(`0' 0"`);
  });

  it("handles non-numeric string gracefully → 0'0\"", () => {
    expect(convertCmToFeetInches("bad").formatted).toBe(`0' 0"`);
  });

  it("returns correct feet and inches fields separately", () => {
    const result = convertCmToFeetInches("152.4");
    expect(result.feet).toBe(5);
    expect(result.inches).toBe(0);
  });

  it("handles edge case where inches rounds to 12 → promotes feet", () => {
    // Any value where totalInches rounds such that inches % 12 === 12
    // We'll verify formatted never shows 'N feet 12 inches'
    generateHeightOptions().forEach(({ value }) => {
      const result = convertCmToFeetInches(value);
      expect(result.inches).toBeLessThan(12);
    });
  });
});

describe("generateWeightOptions", () => {
  it("generates 141 options (40–180 kg inclusive)", () => {
    expect(generateWeightOptions()).toHaveLength(141);
  });

  it("first entry is 40 kg", () => {
    const first = generateWeightOptions()[0];
    expect(first.value).toBe("40");
    expect(first.label).toBe("40 kg");
  });

  it("last entry is 180 kg", () => {
    const last = generateWeightOptions().at(-1)!;
    expect(last.value).toBe("180");
  });
});

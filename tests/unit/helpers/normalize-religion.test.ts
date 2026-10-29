import { describe, it, expect } from "vitest";
import {
  URL_TO_DB_RELIGION,
  DB_TO_URL_RELIGION,
} from "@/helpers/normalize-religion";

describe("URL_TO_DB_RELIGION", () => {
  it("maps all four supported religion slugs to DB labels", () => {
    expect(URL_TO_DB_RELIGION["buddhism"]).toBe("Buddhism");
    expect(URL_TO_DB_RELIGION["christianity"]).toBe("Christianity");
    expect(URL_TO_DB_RELIGION["hinduism"]).toBe("Hinduism");
    expect(URL_TO_DB_RELIGION["islam"]).toBe("Islam");
  });
});

describe("DB_TO_URL_RELIGION", () => {
  it("maps all four DB labels back to URL slugs", () => {
    expect(DB_TO_URL_RELIGION["Buddhism"]).toBe("buddhism");
    expect(DB_TO_URL_RELIGION["Christianity"]).toBe("christianity");
    expect(DB_TO_URL_RELIGION["Hinduism"]).toBe("hinduism");
    expect(DB_TO_URL_RELIGION["Islam"]).toBe("islam");
  });
});

describe("round-trip consistency", () => {
  it("every URL slug → DB label → URL slug is identity", () => {
    for (const [slug, label] of Object.entries(URL_TO_DB_RELIGION)) {
      expect(DB_TO_URL_RELIGION[label]).toBe(slug);
    }
  });

  it("every DB label → URL slug → DB label is identity", () => {
    for (const [label, slug] of Object.entries(DB_TO_URL_RELIGION)) {
      expect(URL_TO_DB_RELIGION[slug]).toBe(label);
    }
  });

  it("both maps have the same number of entries", () => {
    expect(Object.keys(URL_TO_DB_RELIGION).length).toBe(
      Object.keys(DB_TO_URL_RELIGION).length
    );
  });
});

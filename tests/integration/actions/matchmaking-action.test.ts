import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Provide a more precise db mock for this test file ─────────────────────────
const mockFindFirst = vi.fn();
const mockFindMany = vi.fn();
const mockInsert = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      profiles: { findFirst: mockFindFirst, findMany: mockFindMany },
      partnerPreferences: { findFirst: mockFindFirst },
    },
    insert: mockInsert,
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// ── Reusable fixtures ─────────────────────────────────────────────────────────
const myProfile = {
  id: "profile-me",
  userId: "user-me",
  gender: "male",
  status: "approved",
  age: 30,
};

const mockPrefs = {
  preferredMinAge: 25,
  preferredMaxAge: 35,
  preferredMaritalStatus: "never_married",
  preferredEducationLevels: ["Bachelor"],
  preferredProfessions: ["Software Engineer"],
  preferredAnnualIncomeRanges: ["LKR 1M–2M"],
};

const candidateA = {
  id: "profile-a",
  userId: "user-a",
  gender: "female",
  status: "approved",
  age: 28,
  maritalStatus: "never_married",
  educationLevel: "Bachelor",
  profession: "Software Engineer",
  annualIncomeRange: "LKR 1M–2M",
};

const candidateB = {
  id: "profile-b",
  userId: "user-b",
  gender: "female",
  status: "approved",
  age: 30,
  maritalStatus: "never_married",
  educationLevel: "Bachelor",
  profession: "Doctor",                // does NOT match prefs.preferredProfessions
  annualIncomeRange: "LKR 2M–4M",      // does NOT match prefs
};

describe("calculateUserMatchesAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: findFirst called for both profile and prefs
    mockFindFirst
      .mockResolvedValueOnce(myProfile)   // profiles.findFirst (own profile)
      .mockResolvedValueOnce(mockPrefs);  // partnerPreferences.findFirst

    mockFindMany.mockResolvedValue([candidateA, candidateB]);

    // Insert mock — capture values passed in
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    });
  });

  it("returns success:true and count equal to number of candidates", async () => {
    const { calculateUserMatchesAction } = await import(
      "@/app/actions/matchmaking-action"
    );
    const result = await calculateUserMatchesAction("user-me");
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
  });

  it("returns error when own profile is missing", async () => {
    mockFindFirst.mockReset();
    mockFindFirst.mockResolvedValueOnce(undefined); // no profile
    const { calculateUserMatchesAction } = await import(
      "@/app/actions/matchmaking-action"
    );
    const result = await calculateUserMatchesAction("user-me");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Profile or Preferences missing");
  });

  it("returns error when partner preferences are missing", async () => {
    mockFindFirst.mockReset();
    mockFindFirst
      .mockResolvedValueOnce(myProfile) // profile found
      .mockResolvedValueOnce(undefined); // prefs missing
    const { calculateUserMatchesAction } = await import(
      "@/app/actions/matchmaking-action"
    );
    const result = await calculateUserMatchesAction("user-me");
    expect(result.success).toBe(false);
  });

  it("targets opposite gender — male user gets female candidates", async () => {
    const { calculateUserMatchesAction } = await import(
      "@/app/actions/matchmaking-action"
    );
    await calculateUserMatchesAction("user-me");
    // candidateA and candidateB are both female — count should be 2
    expect(mockInsert).toHaveBeenCalledTimes(2);
  });

  it("returns count:0 when there are no candidates", async () => {
    mockFindMany.mockResolvedValue([]);
    const { calculateUserMatchesAction } = await import(
      "@/app/actions/matchmaking-action"
    );
    const result = await calculateUserMatchesAction("user-me");
    expect(result.success).toBe(true);
    expect(result.count).toBe(0);
  });

  // ── KNOWN BUG documented as a failing test ────────────────────────────────
  // `score` is declared outside the .map() callback so it ACCUMULATES across
  // candidates instead of resetting per candidate. Candidate B will get
  // candidate A's score PLUS its own, making it > 100.
  it("KNOWN BUG — score should reset per candidate (fails until fixed)", async () => {
    const capturedScores: number[] = [];

    mockInsert.mockImplementation(() => ({
      values: (v: { score: number }) => {
        capturedScores.push(v.score);
        return { onConflictDoUpdate: vi.fn().mockResolvedValue(undefined) };
      },
    }));

    const { calculateUserMatchesAction } = await import(
      "@/app/actions/matchmaking-action"
    );
    await calculateUserMatchesAction("user-me");

    // candidateA matches all 5 criteria → 100 pts
    // candidateB matches age+marital+education → 65 pts
    // After fix: [100, 65]
    // Bug present: score resets to 0 at top of fn but not per iteration,
    //              so candidateB gets 100+65 = 165
    expect(capturedScores[0]).toBe(100); // candidateA is always correct
    expect(capturedScores[1]).toBeLessThanOrEqual(100); // ← FAILS with bug
    expect(capturedScores[1]).toBe(65);  // ← exact correct value after fix
  });
});

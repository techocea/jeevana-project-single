import "@testing-library/jest-dom";
import { vi } from "vitest";

// ── Global environment stubs ─────────────────────────────────────────────────
// These prevent crashes in modules that guard on missing env vars at import time.
process.env.DATABASE_URL = "postgres://test:test@localhost/jeevana_test";
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://supabase.test";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
process.env.SMTP_HOST = "smtp.test";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "test@test.com";
process.env.SMTP_PASS = "testpass";
process.env.SMTP_FROM_EMAIL = "Test <test@test.com>";
process.env.SUPPORT_EMAIL = "support@test.com";
process.env.NEXT_PUBLIC_PLATFORM_NAME = "Jeevana Test";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.PAYMENTS_LK_SECRET_KEY = "sk_test_fake";
process.env.COUNTRY_STATE_CITY_API_KEY = "csc-test-key";
process.env.COUNTRY_STATE_CITY_BASE_URL = "https://api.countrystatecity.in/v1";

// ── Global module mocks ──────────────────────────────────────────────────────
// These modules touch real network / DB at import time — always mock them
// globally so individual test files don't have to repeat the boilerplate.

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      users: { findFirst: vi.fn() },
      profiles: { findFirst: vi.fn(), findMany: vi.fn() },
      partnerPreferences: { findFirst: vi.fn() },
      invitations: { findFirst: vi.fn() },
      profileMatches: { findFirst: vi.fn(), findMany: vi.fn() },
      orders: { findFirst: vi.fn() },
      subscriptions: { findFirst: vi.fn() },
    },
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    execute: vi.fn(),
    transaction: vi.fn(),
  },
}));

vi.mock("@/utils/supabase", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/utils/supabase-admin", () => ({
  getSupabaseAdmin: vi.fn(),
}));

vi.mock("@/utils/supabase-client", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

vi.mock("@/lib/mailer", () => ({
  sendMail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/payments-lk-client", () => ({
  paymentsLk: {
    checkouts: {
      create: vi.fn(),
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

// Next.js navigation — mocked so server actions can call redirect() / revalidatePath()
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  usePathname: vi.fn(() => "/"),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

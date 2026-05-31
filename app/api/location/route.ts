import { NextResponse } from "next/server";

const BASE_URL = process.env.COUNTRY_STATE_CITY_BASE_URL;
const API_KEY = process.env.COUNTRY_STATE_CITY_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const countryCode = searchParams.get("countryCode");
    const stateCode = searchParams.get("stateCode");

    if (countryCode === "LK") {
      return NextResponse.json([]);
    }

    if (!API_KEY)
      return NextResponse.json(
        { error: "API Key missing in environment config" },
        { status: 500 },
      );

    const headers = {
      "X-CSCAPI-KEY": API_KEY,
      "Content-Type": "application/json",
    };

    if (type === "countries") {
      const res = await fetch(`${BASE_URL}/countries`, {
        headers,
        next: { revalidate: 86400 },
      });
      const data = await res.json();

      const countries = data.map((c: any) => ({
        value: c.name,
        isoCode: c.iso2, // Crucial reference key for dependent downstream matches
      }));
      return NextResponse.json(
        data.map((c: any) => ({ value: c.name, isoCode: c.iso2 })),
      );
    }

    if (type === "states" && countryCode) {
      const res = await fetch(`${BASE_URL}/countries/${countryCode}/states`, {
        headers,
        next: { revalidate: 86400 },
      });
      const data = await res.json();

      const states = data.map((s: any) => ({
        value: s.name,
        isoCode: s.iso2, // Crucial reference key for dependent downstream matches
      }));
      return NextResponse.json(
        data.map((s: any) => ({ value: s.name, isoCode: s.iso2 })),
      );
    }

    if (type === "cities" && countryCode && stateCode) {
      const res = await fetch(
        `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
        { headers, next: { revalidate: 86400 } },
      );
      const data = await res.json();

      const cities = data.map((c: any) => ({
        value: c.name,
      }));
      return NextResponse.json(
        data.map((s: any) => ({ value: s.name, isoCode: s.iso2 })),
      );
    }

    return NextResponse.json(
      { error: "Invalid parameters requested" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("[LOCATION_API_CRASH]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

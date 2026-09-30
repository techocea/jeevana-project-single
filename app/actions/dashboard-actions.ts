'use server'

import {db} from '@/lib/db'
import {sql} from 'drizzle-orm'

export interface DemographicData {
    gender: 'Male' | 'Female'
    count: number
}

export interface RevenueAdData {
    date: string
    revenue: number
    paidAds: number
}

// Fetch Advertiser Demographics (Gender Distribution)
export async function getDemographicsData(): Promise<DemographicData[]> {
    const result = await db.execute(sql`
   SELECT 
      INITCAP(gender::text) AS gender,
      COUNT(*)::int AS count
    FROM profiles
    WHERE LOWER(gender::text) IN ('male', 'female')
    GROUP BY INITCAP(gender::text)
    ORDER BY count DESC;
  `)

    return result as unknown as DemographicData[]
}

// 2. Fetch Daily Paid Ads Count & Revenue for Chart
export async function getRevenueAdData(days = 30): Promise<RevenueAdData[]> {
    const result = await db.execute(sql`
    SELECT 
      TO_CHAR(DATE(p.created_at), 'Mon DD') AS date,
      COALESCE(SUM(p.amount), 0)::int AS revenue,
      COUNT(DISTINCT a.id)::int AS "paidAds"
    FROM payments p
    JOIN ads a ON a.id = p.ad_id
    WHERE p.status = 'SUCCESS'
      AND p.created_at >= NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(p.created_at), TO_CHAR(DATE(p.created_at), 'Mon DD')
    ORDER BY DATE(p.created_at) ASC;
  `)

    return result as unknown as RevenueAdData[]
}
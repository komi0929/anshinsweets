import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Self-Cleaning: Freshness Management API
 * 
 * Designed to be called by Vercel Cron Jobs (daily).
 * Checks products whose last_confirmed_at is older than 180 days.
 * Generates warnings for the store dashboard.
 * 
 * Cron config in vercel.json:
 * { "crons": [{ "path": "/api/cron/freshness", "schedule": "0 4 * * *" }] }
 */

const STALE_THRESHOLD_DAYS = 180; // 6 months

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - STALE_THRESHOLD_DAYS);

    // Find stale published products
    const { data: staleProducts, error } = await supabase
      .from('products')
      .select('id, product_name, store_id, last_confirmed_at')
      .eq('is_published', true)
      .lt('last_confirmed_at', thresholdDate.toISOString());

    if (error) throw error;

    return NextResponse.json({
      message: `Found ${staleProducts?.length || 0} stale products (>${STALE_THRESHOLD_DAYS} days)`,
      staleCount: staleProducts?.length || 0,
      staleProducts: staleProducts?.map(p => ({
        id: p.id,
        name: p.product_name,
        storeId: p.store_id,
        lastConfirmed: p.last_confirmed_at,
        daysSinceConfirmation: Math.floor(
          (Date.now() - new Date(p.last_confirmed_at).getTime()) / (1000 * 60 * 60 * 24)
        ),
      })),
    });
  } catch (err) {
    console.error('[Freshness Check] Error:', err);
    return NextResponse.json({ error: 'Freshness check failed' }, { status: 500 });
  }
}

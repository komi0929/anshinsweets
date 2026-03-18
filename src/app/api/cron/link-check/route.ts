import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Self-Cleaning: Link Health Check API
 * 
 * Designed to be called by Vercel Cron Jobs (weekly).
 * Checks all published product URLs for 404/500 errors.
 * Products with dead links are automatically unpublished.
 * 
 * Cron config in vercel.json:
 * { "crons": [{ "path": "/api/cron/link-check", "schedule": "0 3 * * 1" }] }
 */
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    // Get all published products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, product_url, product_name, store_id')
      .eq('is_published', true);

    if (error) throw error;
    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No products to check', checked: 0 });
    }

    let checkedCount = 0;
    let deadCount = 0;
    const deadProducts: string[] = [];

    for (const product of products) {
      try {
        const response = await fetch(product.product_url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(10000), // 10s timeout
          redirect: 'follow',
        });

        const isAlive = response.status < 400;

        // Record health check
        await supabase.from('link_health_checks').insert({
          product_id: product.id,
          status_code: response.status,
          is_alive: isAlive,
        });

        // Unpublish dead links
        if (!isAlive) {
          await supabase
            .from('products')
            .update({ is_published: false })
            .eq('id', product.id);
          deadProducts.push(product.product_name);
          deadCount++;
        }

        checkedCount++;
      } catch {
        // Network error = dead link
        await supabase.from('link_health_checks').insert({
          product_id: product.id,
          status_code: 0,
          is_alive: false,
        });

        await supabase
          .from('products')
          .update({ is_published: false })
          .eq('id', product.id);
        deadProducts.push(product.product_name);
        deadCount++;
        checkedCount++;
      }
    }

    return NextResponse.json({
      message: `Checked ${checkedCount} products, ${deadCount} dead links found`,
      checked: checkedCount,
      dead: deadCount,
      deadProducts,
    });
  } catch (err) {
    console.error('[Link Check] Error:', err);
    return NextResponse.json({ error: 'Link check failed' }, { status: 500 });
  }
}

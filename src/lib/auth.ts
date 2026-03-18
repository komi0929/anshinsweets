/**
 * JWT Authentication Utility for Store Dashboard
 * Uses Web Crypto API (Edge Runtime compatible)
 */

import type { StoreAuthPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'anshinsweets-dev-secret-change-in-production';
const JWT_EXPIRY_HOURS = 24 * 7; // 1 week

// ===== ENCODING HELPERS =====
function base64url(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlEncode(obj: Record<string, unknown>): string {
  return base64url(JSON.stringify(obj));
}

function base64urlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

// ===== HMAC-SHA256 =====
async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return base64url(String.fromCharCode(...new Uint8Array(signature)));
}

// ===== JWT FUNCTIONS =====

export async function createToken(payload: StoreAuthPayload): Promise<string> {
  const header = base64urlEncode({ alg: 'HS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const body = base64urlEncode({
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRY_HOURS * 3600,
  });
  const signature = await hmacSign(`${header}.${body}`, JWT_SECRET);
  return `${header}.${body}.${signature}`;
}

export async function verifyToken(token: string): Promise<StoreAuthPayload | null> {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;

    // Verify signature
    const expected = await hmacSign(`${header}.${body}`, JWT_SECRET);
    if (expected !== signature) return null;

    // Decode and check expiry
    const payload = JSON.parse(base64urlDecode(body));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      storeId: payload.storeId,
      email: payload.email,
      storeName: payload.storeName,
    };
  } catch {
    return null;
  }
}

/** Extract token from Authorization header */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

/** Simple password hashing (for demo; use bcrypt in production) */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

/**
 * Input validation utilities
 */

/** Validate URL - only http/https allowed */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Sanitize string - trim and limit length */
export function sanitize(str: string, maxLength: number = 1000): string {
  return str.trim().slice(0, maxLength);
}

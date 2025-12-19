import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normalize phone number for comparison (returns just digits starting with 62)
// Handles: +62 812-xxx, 0812-xxx, 812-xxx, etc.
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';

  // Remove all non-digits
  let digits = phone.replace(/[^\d]/g, '');

  if (!digits) return '';

  // Convert leading 0 to 62 (Indonesian local format)
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  }
  // If it doesn't start with 62, assume it's missing country code
  else if (!digits.startsWith('62') && digits.length >= 9 && digits.length <= 12) {
    digits = '62' + digits;
  }

  return digits;
}

// Check if two phone numbers match (handles various formats)
export function phonesMatch(phone1: string | null | undefined, phone2: string | null | undefined): boolean {
  const norm1 = normalizePhone(phone1);
  const norm2 = normalizePhone(phone2);

  if (!norm1 || !norm2) return false;

  // Check exact match
  if (norm1 === norm2) return true;

  // Check if last 8-10 digits match (handles country code variations)
  const last1 = norm1.slice(-10);
  const last2 = norm2.slice(-10);

  return last1.includes(last2) || last2.includes(last1);
}

// Format phone number with dashes: +62 812-3456-7890
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '';

  // Remove all non-digits except leading +
  let digits = phone.replace(/[^\d+]/g, '');

  // Ensure starts with +62
  if (digits.startsWith('62')) digits = '+' + digits;
  if (!digits.startsWith('+62')) return phone;

  // Get the number part after +62
  const numberPart = digits.substring(3);

  // Format: +62 xxx-xxxx-xxxx
  if (numberPart.length >= 10) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + '-' + numberPart.substring(7);
  } else if (numberPart.length >= 7) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + (numberPart.length > 7 ? '-' + numberPart.substring(7) : '');
  }

  return phone;
}

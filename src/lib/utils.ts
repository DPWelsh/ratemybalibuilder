import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')       // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters except dashes
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

/**
 * Generates a placeholder image URL with the given text and colors
 */
export const generatePlaceholderImage = (text: string, bgColor: string = '#3B82F6', textColor: string = 'FFFFFF') => {
  // Remove # from hex color if present
  const bg = bgColor.replace('#', '');
  const fg = textColor.replace('#', '');
  
  // Get first letter of each word and uppercase it
  const initials = text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substr(0, 2);

  // Create placeholder URL (using https://placehold.co service or similar)
  return `https://placehold.co/400x400/${bg}/${fg}?text=${initials}`;
};

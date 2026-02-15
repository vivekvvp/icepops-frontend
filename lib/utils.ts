import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date consistently on server and client to avoid hydration errors
 * Returns format: "February 15, 2026"
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format date with time consistently
 * Returns format: "February 15, 2026 at 10:23 AM"
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Format short date
 * Returns format: "Feb 15, 2026"
 */
export function formatShortDate(date: string | Date): string {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format currency consistently
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}


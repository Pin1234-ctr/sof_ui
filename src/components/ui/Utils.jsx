import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes efficiently.
 * It combines clsx for conditional classes and twMerge to handle Tailwind conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    return url.startsWith('http') ? url : `https://${url}`;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}

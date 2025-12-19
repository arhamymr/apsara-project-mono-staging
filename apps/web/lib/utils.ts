import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
  'node-handles-selected-style';

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_CTA_PHONE_NUMBER?.replace('+', '') || '6289669594959';
}

export function getWhatsAppUrl(message?: string) {
  const number = getWhatsAppNumber();
  if (message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${number}`;
}

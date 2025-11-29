'use client';
import { useCallback } from 'react';

export function useInitials() {
  const getInitials = useCallback((fullName: string): string => {
    const names = fullName.trim().split(' ').filter(Boolean);

    if (names.length === 0) return '';
    
    const firstName = names[0];
    if (names.length === 1 || !firstName) return firstName?.charAt(0).toUpperCase() ?? '';

    const lastName = names[names.length - 1];
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName?.charAt(0) ?? '';

    return `${firstInitial}${lastInitial}`.toUpperCase();
  }, []);

  return getInitials;
}

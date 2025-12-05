'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LOGO_URL, LOGO_WHITE_URL } from './constants';

export function Logo() {
  return (
    <Link href="/" className="relative block h-8 w-[120px]">
      <Image src={LOGO_URL} alt="logo" width={120} height={32} className="block dark:hidden" priority />
      <Image src={LOGO_WHITE_URL} alt="logo" width={120} height={32} className="hidden dark:block" priority />
    </Link>
  );
}

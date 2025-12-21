'use client';

import { useTheme } from '@/components/dark-mode/useTheme';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LogoBackground() {
  const { theme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      {/* Spinning logo background */}
      <motion.div
        className="pointer-events-none absolute -right-32 -bottom-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <Image
          src="/logo.svg"
          alt="Background Logo"
          width={512}
          height={512}
          className={isDark ? 'opacity-50' : 'opacity-30'}
          priority={false}
        />
      </motion.div>
    </div>
  );
}

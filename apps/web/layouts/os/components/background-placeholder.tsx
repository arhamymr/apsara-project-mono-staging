import { useTheme } from '@/components/dark-mode/useTheme';
import { getGradientById } from '@/layouts/os/gradients';
import {
  getWallpaper,
  listenWallpaperChange,
  type Wallpaper,
} from '@/layouts/os/wallpaper';
import { motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

export default function BackgroundPlaceholder() {
  const { theme } = useTheme();
  const [wallpaper, setWallpaper] = React.useState<Wallpaper>(() =>
    getWallpaper(),
  );

  React.useEffect(() => {
    return listenWallpaperChange((w) => setWallpaper(w));
  }, []);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false);

  const renderGradient = () => {
    const variant = getGradientById(wallpaper.value as string | undefined);
    const base = isDark ? variant.baseDark : variant.baseLight;
    const [orb1, orb2, orb3] = isDark ? variant.orbDark : variant.orbLight;
    return (
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={`absolute inset-0 ${base}`} />
        <motion.div
          className={`absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl ${orb1}`}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl ${orb2}`}
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute top-1/2 right-1/3 h-64 w-64 rounded-full blur-3xl ${orb3}`}
          animate={{ scale: [1, 1.4, 1], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle animated conic gradient sweep */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-10 rounded-[6rem] opacity-25 mix-blend-overlay blur-3xl"
          style={{
            background: isDark
              ? 'conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%)'
              : 'conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.04), rgba(0,0,0,0) 60%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    );
  };

  const renderSolid = (color: string) => (
    <div className="absolute inset-0" style={{ backgroundColor: color }} />
  );

  const renderImage = (url: string) => (
    <div
      className="absolute inset-0 bg-center"
      style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover' }}
    />
  );

  const renderSpinner = () => (
    <div
      className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`}
    >
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

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {wallpaper.kind === 'gradient'
        ? renderGradient()
        : wallpaper.kind === 'solid' && wallpaper.value
          ? renderSolid(wallpaper.value)
          : wallpaper.kind === 'image' && wallpaper.value
            ? renderImage(wallpaper.value)
            : wallpaper.kind === 'spinner'
              ? renderSpinner()
              : renderGradient()}

      {/* Grid overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.1 : 0.15 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette effect */}
      <div
        className={`bg-gradient-radial absolute inset-0 from-transparent via-transparent ${
          isDark ? 'to-black/50' : 'to-black/20'
        }`}
      />
    </div>
  );
}

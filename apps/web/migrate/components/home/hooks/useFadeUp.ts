import { useReducedMotion } from 'framer-motion';

export const useFadeUp = () => {
  const reduce = useReducedMotion();
  return {
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-20% 0px' },
    transition: { duration: reduce ? 0 : 0.6, ease: 'easeOut' },
  } as const;
};

export type FadeUpOptions = ReturnType<typeof useFadeUp>;

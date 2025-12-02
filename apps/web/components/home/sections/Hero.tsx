import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Button } from '@workspace/ui/components/button';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  const fadeUp = useFadeUp();
  const s = useStrings();

  return (
    <div className='md:px-6'>
        <Section className="bg-card relative mt-8 overflow-hidden rounded-none border md:mt-24 md:rounded-xl">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={512}
        height={512}
        className="absolute -right-[150px] -bottom-[200px] mb-8 size-128 w-auto animate-spin opacity-50 [animation-duration:30s]"
      />
      <div className="@container flex h-[65vh] items-center justify-center gap-10">
        <motion.div
          {...fadeUp}
          className="relative z-10 flex flex-col items-center"
        >
          <h1 className="text-foreground max-w-[900px] text-center text-4xl font-normal tracking-tight text-balance md:text-7xl">
            {s.hero.title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-[600px] text-center text-lg md:text-xl">
            {s.hero.description}
          </p>

          <div className="mt-10 flex flex-col items-center gap-6 @md:mt-12">
            <div className="flex flex-col gap-4 sm:flex-row">
              {s.hero.ctas.primary && (
                <Button size={'lg'}>
                  {s.hero.ctas.primary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <ul className="text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium">
              {s.hero.checklist.map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-center justify-center gap-2"
                >
                  <div className="bg-primary/20 flex h-5 w-5 items-center justify-center rounded-full backdrop-blur-sm">
                    <Check className="text-primary h-3 w-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </Section>
      </div>
  
  );
}

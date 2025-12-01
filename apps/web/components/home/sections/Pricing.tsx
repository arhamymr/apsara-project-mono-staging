import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const PRICING_META = [
  { price: 'Free', popular: false },
  { price: '$19', period: '/mo', popular: true },
];

export function Pricing() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="pricing" className="py-24 lg:py-32">
      <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
          {s.pricing.title}
        </h2>
        <p className="text-muted-foreground mt-6 text-lg">
          {s.pricing.subtitle}
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2"
      >
        {PRICING_META.map((meta, i) => {
          const tier = s.pricing.tiers[i];
          const isPopular = meta.popular;

          return (
            <div
              key={tier.name}
              className={cn(
                'border-border relative flex h-full flex-col justify-between overflow-hidden rounded-xl border p-8 transition-all duration-300 lg:p-10',
                isPopular ? 'bg-foreground text-background' : 'bg-card',
              )}
            >
              {isPopular && (
                <Badge className="bg-primary text-primary-foreground absolute top-6 right-6">
                  {s.pricing.popular}
                </Badge>
              )}
              <div>
                {' '}
                <div className="mb-8">
                  <h3
                    className={cn(
                      'mb-2 text-sm font-medium tracking-wider uppercase',
                      isPopular
                        ? 'text-background/60'
                        : 'text-muted-foreground',
                    )}
                  >
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-medium tracking-tight">
                      {meta.price}
                    </span>
                    {meta.period && (
                      <span
                        className={
                          isPopular
                            ? 'text-background/60'
                            : 'text-muted-foreground'
                        }
                      >
                        {meta.period}
                      </span>
                    )}
                  </div>
                </div>
                <p
                  className={cn(
                    'mb-8 text-lg',
                    isPopular ? 'text-background/70' : 'text-muted-foreground',
                  )}
                >
                  {tier.desc}
                </p>
                <ul className="mb-10 space-y-4">
                  {tier.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full',
                          isPopular ? 'bg-background/10' : 'bg-primary/10',
                        )}
                      >
                        <Check
                          className={cn(
                            'h-4 w-4',
                            isPopular ? 'text-background' : 'text-primary',
                          )}
                        />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button size={'lg'} className="w-full">
                {tier.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </motion.div>

      <motion.p
        {...fadeUp}
        className="text-muted-foreground mx-auto mt-8 max-w-xl text-center text-sm"
      >
        {s.pricing.footnote}
      </motion.p>
    </Section>
  );
}

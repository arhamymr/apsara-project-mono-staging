import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Card } from '@workspace/ui/components/card';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Apsara has transformed our digital presence. We launched a professional website and marketing suite in just a few days, not weeks.',
    name: 'Raka',
    role: 'Founder, Widget Labs',
    avatar: 'https://assets.apsaradigital.com/placeholders/avatar-1.png',
  },
  {
    quote:
      'The AI automation features have saved us countless hours. Our customer engagement has increased by 300% since implementing the chatbot.',
    name: 'Nadia',
    role: 'Marketing Lead',
    avatar: 'https://assets.apsaradigital.com/placeholders/avatar-2.png',
  },
  {
    quote:
      'Finally, a platform that bridges the gap between marketing and development. Our team productivity has doubled.',
    name: 'Ibrahim',
    role: 'Engineer',
    avatar: 'https://assets.apsaradigital.com/placeholders/avatar-3.png',
  },
] as const;

export function Testimonials() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="py-24">
      <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
        <h3 className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-3xl font-medium tracking-tight text-transparent md:text-5xl lg:text-6xl">
          {s.testimonials.title}
        </h3>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg md:text-xl">
          {s.testimonials.subtitle}
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="grid gap-6 px-4 md:grid-cols-3 lg:gap-8"
      >
        {TESTIMONIALS.map((testimonial, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between p-8 shadow-2xl"
          >
            <div>
              <StarRow />
              <p className="text-muted-foreground mt-6 text-base leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="ring-border/50 h-10 w-10 rounded-full ring-2"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="text-foreground text-sm font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>
    </Section>
  );
}

function StarRow() {
  return (
    <div className="flex items-center gap-1" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
  );
}

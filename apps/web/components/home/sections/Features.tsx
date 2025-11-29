import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { motion } from 'framer-motion';
import { AIFeature } from './features/AIFeature';
import { BusinessOpsFeature } from './features/BusinessOpsFeature';
import { MarketingFeature } from './features/MarketingFeature';
import { OnlinePresenceFeature } from './features/OnlinePresenceFeature';
import './features/animations.css';

export const Features = () => {
  const fadeUp = useFadeUp();

  return (
    <Section id="features" className="relative py-24">
      <div className="relative z-10">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-muted-foreground mt-3">
            From stunning websites and powerful marketing tools to AI automation
            and custom applications — all in one seamless platform.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <OnlinePresenceFeature />
          <MarketingFeature />
          <BusinessOpsFeature />
          <AIFeature />
        </div>
      </div>
    </Section>
  );
};

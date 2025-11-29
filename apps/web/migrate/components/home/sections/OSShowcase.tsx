import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { motion } from 'framer-motion';

export function OSShowcase() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="preview" className="relative overflow-hidden py-24">
      <style>{`
        @keyframes spin3d {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }
        .cube-spin {
          animation: spin3d 20s linear infinite;
        }
      `}</style>

      <motion.div {...fadeUp}>
        <div className="relative z-10 mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            {s.preview.title}
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            {s.preview.uiOnly}
          </p>
        </div>

        {/* Window Mockup - Full Width */}
        <div className="relative w-full">
          <motion.div
            className="bg-background/80 relative overflow-hidden rounded-xl border backdrop-blur-sm"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Window Title Bar */}
            <div className="text-muted-foreground flex items-center justify-between border-b px-3 py-1.5">
              <span className="text-xs font-medium">Apsara Platform</span>
              <div className="flex items-center gap-1">
                <div className="flex h-5 w-5 items-center justify-center rounded hover:bg-black/10">
                  <div className="h-[1px] w-2 bg-current" />
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded hover:bg-black/10">
                  <div className="h-2 w-2 border border-current" />
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded hover:bg-red-100/20 hover:text-red-700">
                  <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 2L10 10M10 2L2 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Window Content */}
            <div className="bg-card relative h-[450px] overflow-hidden">
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage:
                    'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* 3D Spinning Box - Outline Style */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ perspective: '800px' }}
              >
                <div
                  className="cube-spin relative h-32 w-32"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front face */}
                  <div
                    className="border-primary/50 absolute h-32 w-32 border-2"
                    style={{ transform: 'translateZ(64px)' }}
                  />
                  {/* Back face */}
                  <div
                    className="border-primary/30 absolute h-32 w-32 border-2"
                    style={{ transform: 'translateZ(-64px)' }}
                  />
                  {/* Left face */}
                  <div
                    className="border-primary/40 absolute h-32 w-32 border-2"
                    style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}
                  />
                  {/* Right face */}
                  <div
                    className="border-primary/40 absolute h-32 w-32 border-2"
                    style={{ transform: 'rotateY(90deg) translateZ(64px)' }}
                  />
                  {/* Top face */}
                  <div
                    className="border-primary/35 absolute h-32 w-32 border-2"
                    style={{ transform: 'rotateX(90deg) translateZ(64px)' }}
                  />
                  {/* Bottom face */}
                  <div
                    className="border-primary/35 absolute h-32 w-32 border-2"
                    style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}
                  />
                </div>
              </div>
            </div>

            {/* Dock */}
            <div className="border-t px-4 py-2.5">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-muted h-8 w-8 rounded-lg"
                    whileHover={{ y: -3 }}
                  />
                ))}
                <div className="bg-border mx-2 h-5 w-px" />
                {[6, 7].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-muted/50 h-8 w-8 rounded-lg"
                    whileHover={{ y: -3 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}

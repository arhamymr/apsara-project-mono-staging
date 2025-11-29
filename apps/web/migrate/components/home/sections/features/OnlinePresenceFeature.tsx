import { ArrowUp, Globe, Sparkles, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function OnlinePresenceFeature() {
  return (
    <FeatureCard
      icon={Globe}
      title="Online Presence"
      description="Professional websites, landing pages, custom domains, and brand identity tools."
      colSpan={2}
      hoverColor="primary"
      illustration={
        <div className="bg-card absolute right-0 bottom-0 h-[65%] w-[90%] translate-x-4 translate-y-4 overflow-hidden rounded-tl-lg border transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0">
          {/* Browser Toolbar */}
          <div className="border-border bg-background flex h-9 items-center gap-3 border-b px-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
            </div>
            <div className="bg-muted text-muted-foreground group-hover:border-border flex h-5 flex-1 items-center justify-between rounded border border-transparent px-2 text-[10px] transition-colors">
              <span className="opacity-50">apsara.new</span>
              <div className="text-primary flex items-center gap-1 text-[8px]">
                <Zap className="h-2 w-2 fill-current" />
                <span>Instant</span>
              </div>
            </div>
          </div>

          {/* Website Content */}
          <div className="bg-background relative h-full w-full p-6">
            {/* Generated Content Preview */}
            <div className="space-y-4 transition-all duration-500">
              {/* Hero */}
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="text-muted-foreground text-lg font-semibold">
                  Build Faster
                </div>
                <div className="text-muted-foreground text-xs">
                  Deploy your next project in minutes.
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="bg-primary text-primary-foreground flex h-6 w-20 items-center justify-center rounded-md text-[10px] font-medium">
                    Get Started
                  </div>
                  <div className="bg-muted text-muted-foreground flex h-6 w-20 items-center justify-center rounded-md text-[10px] font-medium">
                    Learn More
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="border-border bg-muted aspect-video rounded border"></div>
                    <div className="bg-muted h-2 w-3/4 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vibe Coding Prompt Bar (Floating) */}
            <div className="border-primary/30 group-hover:border-primary/60 bg-background/95 absolute bottom-12 left-1/2 flex w-[90%] -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:scale-105">
              <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="text-foreground flex items-center gap-1 text-[10px] font-medium">
                  <span>Generating website</span>
                  <span className="animate-pulse">...</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-0.5 text-[9px]">
                  <span>"Modern SaaS landing page"</span>
                  <span className="bg-primary h-2 w-0.5 animate-pulse"></span>
                </div>
              </div>
              <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-lg shadow-lg">
                <ArrowUp className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

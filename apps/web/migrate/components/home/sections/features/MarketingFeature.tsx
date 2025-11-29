import { Card } from '@/components/ui/card';
import { ArrowUpRight, Mail, MessageCircle, Share2 } from 'lucide-react';
import './animations.css';
import { FeatureCard } from './FeatureCard';

export function MarketingFeature() {
  return (
    <FeatureCard
      icon={Share2}
      title="Marketing Suite"
      description="Email campaigns, social media automation, AI chatbots, and WhatsApp integration."
      hoverColor="primary"
      illustration={
        <Card className="group/stat bg-background absolute -right-20 bottom-[-50px] mx-4 h-[280px] w-full overflow-hidden rounded-xl border p-4">
          {/* Dashboard Header */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-3 w-3 rounded-full"></div>
              <span className="text-muted-foreground text-xs font-medium">
                Marketing Overview
              </span>
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-neutral-800"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-neutral-800"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Email Stat */}
            <div className="group/stat hover:border-primary/30 border-border bg-card hover:bg-muted relative overflow-hidden rounded-lg border p-3 transition-all">
              <div className="mb-2 flex items-center justify-between">
                <Mail className="text-primary h-4 w-4" />
                <span className="text-primary flex items-center text-[10px]">
                  +12% <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <div className="text-muted-foreground text-lg font-bold">
                24.5k
              </div>
              <div className="text-muted-foreground text-[10px]">
                Emails Sent
              </div>
              <div className="bg-primary/10 absolute bottom-0 left-0 h-1 w-full">
                <div className="bg-primary h-full w-[70%] transition-all duration-1000 group-hover/stat:w-[85%]"></div>
              </div>
            </div>

            {/* Social Stat */}
            <div className="group/stat hover:border-primary/30 relative overflow-hidden rounded-lg border p-3 transition-all">
              <div className="mb-2 flex items-center justify-between">
                <Share2 className="text-primary h-4 w-4" />
                <span className="text-primary flex items-center text-[10px]">
                  +8.4% <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <div className="text-muted-foreground text-lg font-bold">
                1.2k
              </div>
              <div className="text-muted-foreground text-[10px]">
                Social Engagements
              </div>
              <div className="bg-primary/10 absolute bottom-0 left-0 h-1 w-full">
                <div className="bg-primary h-full w-[45%] transition-all duration-1000 group-hover/stat:w-[60%]"></div>
              </div>
            </div>
          </div>

          {/* Chat Activity Graph (Simplified) */}
          <div className="border-border bg-card mt-3 flex-1 rounded-lg border p-3">
            <div className="mb-3 flex items-center gap-2">
              <MessageCircle className="text-primary h-4 w-4" />
              <span className="text-muted-foreground text-[10px] font-medium">
                Chat Activity
              </span>
            </div>
            <div className="flex h-16 items-end justify-between gap-1">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="bg-primary/20 hover:bg-primary/40 w-full rounded-t-sm transition-all duration-500"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Floating Elements */}
          <div className="bg-primary absolute top-4 right-4 h-2 w-2 animate-ping rounded-full opacity-20"></div>
        </Card>
      }
    />
  );
}

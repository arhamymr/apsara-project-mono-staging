import { Bot, GitBranch, Settings, Workflow, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import './animations.css';

export function AIFeature() {
  return (
    <FeatureCard
      icon={Bot}
      title="AI Intelligence"
      description="Smart AI agents, workflow automation, and custom app development."
      colSpan={2}
      hoverColor="primary"
      illustration={
        <div className="group bg-background absolute -right-[12px] -bottom-[12px] flex h-[240px] w-[80%] translate-x-4 translate-y-4 flex-col overflow-hidden rounded-lg border transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0">
          {/* Window Header */}
          <div className="border-border bg-background flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
              </div>
              <div className="bg-muted text-muted-foreground ml-2 flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium shadow-sm">
                <Workflow className="h-3 w-3" />
                <span>workflow_builder.ai</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium">
                <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"></div>
                Active
              </div>
            </div>
          </div>

          {/* Workflow Canvas */}
          <div className="relative flex-1 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-4 dark:bg-[radial-gradient(#404040_1px,transparent_1px)]">
            {/* Nodes */}
            <div className="relative z-10 flex h-full flex-col justify-center gap-6">
              {/* Trigger Node */}
              <div className="group/node hover:border-primary/50 bg-background relative ml-4 flex w-fit items-center gap-3 rounded-lg border p-2 shadow-sm transition-all hover:shadow-md">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                  <Zap className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-[100px]">
                  <div className="text-foreground text-[10px] font-medium">
                    New Order
                  </div>
                  <div className="text-muted-foreground text-[9px]">
                    Webhook Trigger
                  </div>
                </div>
                {/* Connection Line Vertical */}
                <div className="group-hover/node:bg-primary/30 absolute top-full left-6 h-6 w-0.5 bg-gray-200 dark:bg-neutral-800"></div>
              </div>

              {/* Action Node */}
              <div className="group/node hover:border-primary/50 border-border bg-background relative ml-4 flex w-fit items-center gap-3 rounded-lg border p-2 shadow-sm transition-all hover:shadow-md">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                  <Bot className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-[100px]">
                  <div className="text-foreground text-[10px] font-medium">
                    AI Process
                  </div>
                  <div className="text-muted-foreground text-[9px]">
                    Analyze & Categorize
                  </div>
                </div>
                {/* Connection Line Vertical */}
                <div className="group-hover/node:bg-primary/30 absolute top-full left-6 h-6 w-0.5 bg-gray-200 dark:bg-neutral-800"></div>
              </div>

              {/* Branch Nodes */}
              <div className="ml-4 flex gap-4">
                <div className="border-border bg-background relative flex items-center gap-2 rounded-lg border p-2 opacity-50 transition-opacity hover:opacity-100">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span className="text-muted-foreground text-[9px] font-medium">
                    Approve
                  </span>
                </div>
                <div className="border-border bg-background relative flex items-center gap-2 rounded-lg border p-2 opacity-50 transition-opacity hover:opacity-100">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span className="text-muted-foreground text-[9px] font-medium">
                    Review
                  </span>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="border-border bg-background h-8 w-8 rounded-md border p-1.5 shadow-sm transition-transform hover:scale-105">
                <Settings className="text-muted-foreground h-full w-full" />
              </div>
              <div className="border-border bg-background h-8 w-8 rounded-md border p-1.5 shadow-sm transition-transform hover:scale-105">
                <GitBranch className="text-muted-foreground h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

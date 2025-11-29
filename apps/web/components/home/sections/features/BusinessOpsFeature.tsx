import { ArrowUpRight, Bell, Briefcase, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FeatureCard } from './FeatureCard';

export function BusinessOpsFeature() {
  const [revenue, setRevenue] = useState(284500);
  const [barHeights, setBarHeights] = useState([
    40, 60, 45, 80, 55, 90, 65, 75,
  ]);

  useEffect(() => {
    const revInterval = setInterval(() => {
      setRevenue((prev) => prev + Math.floor(Math.random() * 200));
    }, 2500);

    const barInterval = setInterval(() => {
      setBarHeights((prev) =>
        prev.map((h) => {
          const change = Math.random() * 20 - 10;
          return Math.max(20, Math.min(90, h + change));
        }),
      );
    }, 600);

    return () => {
      clearInterval(revInterval);
      clearInterval(barInterval);
    };
  }, []);

  return (
    <FeatureCard
      icon={Briefcase}
      title="Business Operations"
      description="Lead management, CRM, billing, analytics, and team collaboration tools."
      hoverColor="primary"
      illustration={
        <div className="border-border bg-background absolute -right-10 bottom-[-40px] mx-4 h-[280px] overflow-hidden rounded-xl border">
          {/* Live Toast */}
          <div className="border-primary/20 bg-primary/10 text-primary absolute top-14 left-1/2 z-20 flex -translate-x-1/2 translate-y-4 items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium opacity-0 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <Bell className="h-3 w-3 fill-current" />
            <span>New Deal: Stark Ind (+$85k)</span>
          </div>

          {/* Dashboard Header */}
          <div className="border-border bg-card border-b p-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase">
                  <DollarSign className="h-3 w-3" />
                  Pipeline Value
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
                  ${revenue.toLocaleString()}
                  <div className="text-primary flex items-center text-xs font-medium">
                    <ArrowUpRight className="h-3 w-3" />
                    12%
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                  <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
                </span>
                Live Updates
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex h-12 items-end gap-1.5">
              {barHeights.map((height, i) => (
                <div
                  key={i}
                  className="group-hover:bg-primary flex-1 rounded-t-sm bg-gray-200 transition-all duration-[600ms] ease-in-out dark:bg-neutral-800"
                  style={{ height: `${height}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-transparent to-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads List */}
          <div className="bg-muted flex-1 overflow-hidden">
            <div className="border-border bg-muted/50 text-muted-foreground flex border-b px-4 py-2 text-[10px] font-medium">
              <div className="flex-1">Company</div>
              <div className="w-20 text-right">Value</div>
              <div className="w-20 text-right">Stage</div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-neutral-800">
              {[
                {
                  name: 'Acme Corp',
                  val: '$45k',
                  status: 'Closed',
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                  border: 'border-primary/20',
                },
                {
                  name: 'Wayne Ent',
                  val: '$120k',
                  status: 'Negotiation',
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                  border: 'border-primary/20',
                },
                {
                  name: 'Cyberdyne',
                  val: '$210k',
                  status: 'Qualified',
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                  border: 'border-primary/20',
                },
                {
                  name: 'Massive',
                  val: '$34k',
                  status: 'New Lead',
                  color: 'text-muted-foreground',
                  bg: 'bg-muted',
                  border: 'border-border',
                },
              ].map((lead, i) => (
                <div
                  key={i}
                  className="group/row flex translate-x-4 transform items-center px-4 py-3 text-[10px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ transitionDelay: `${100 + i * 100}ms` }}
                >
                  <div className="text-foreground flex flex-1 items-center gap-2 font-medium">
                    <div className="text-muted-foreground flex h-5 w-5 items-center justify-center rounded">
                      {lead.name[0]}
                    </div>
                    {lead.name}
                  </div>
                  <div className="text-muted-foreground w-20 text-right">
                    {lead.val}
                  </div>
                  <div className="flex w-20 justify-end">
                    <span
                      className={`rounded-full border px-2 py-0.5 font-medium ${lead.bg} ${lead.color} ${lead.border}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

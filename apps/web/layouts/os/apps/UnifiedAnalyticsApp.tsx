import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  BarChart,
  Clock,
  DollarSign,
  Eye,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import Controls from './analytics/controls';
import FooterNote from './analytics/footer-note';
import StatCard from './analytics/stat-card';
import TopPages from './analytics/top-pages';
import TrafficChart from './analytics/traffic-chart';

// --- dummy data generators ---
const now = new Date();

function makeSeries(len: number) {
  return Array.from({ length: len }).map((_, i) => ({
    label: i + 1,
    visits: Math.round(120 + Math.sin(i / 2) * 40 + Math.random() * 30),
    unique: Math.round(100 + Math.cos(i / 2) * 30 + Math.random() * 20),
    bounce: Math.round(40 + Math.sin(i / 3) * 10 + Math.random() * 5),
    conversions: Math.round(15 + Math.cos(i / 2) * 10 + Math.random() * 5),
    revenue: Math.round(250 + Math.sin(i / 3) * 80 + Math.random() * 40),
  }));
}

const DATASETS = {
  day: makeSeries(24).map((d, i) => ({ ...d, label: `${i}:00` })),
  week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
    ...makeSeries(7)[i],
    label: d,
  })),
  month: Array.from({ length: 30 }).map((_, i) => ({
    ...makeSeries(30)[i],
    label: `${i + 1}`,
  })),
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
    (d, i) => ({ ...makeSeries(12)[i], label: d })
  ),
} as const;

const TOP_PAGES = [
  { path: '/', views: 4200, trend: 7 },
  { path: '/pricing', views: 1800, trend: 3 },
  { path: '/blog/how-to-start', views: 1320, trend: 11 },
  { path: '/docs/getting-started', views: 980, trend: -2 },
  { path: '/contact', views: 750, trend: 5 },
];

const DEVICE_DATA = [
  { name: 'Desktop', value: 65, color: 'bg-blue-500' },
  { name: 'Mobile', value: 25, color: 'bg-green-500' },
  { name: 'Tablet', value: 10, color: 'bg-purple-500' },
];

const COUNTRY_DATA = [
  { name: 'United States', value: 40, flag: '🇺🇸' },
  { name: 'United Kingdom', value: 15, flag: '🇬🇧' },
  { name: 'Germany', value: 12, flag: '🇩🇪' },
  { name: 'France', value: 10, flag: '🇫🇷' },
  { name: 'Japan', value: 8, flag: '🇯🇵' },
  { name: 'Other', value: 15, flag: '🌍' },
];

const CONVERSION_SOURCES = [
  { source: 'Organic Search', conversions: 1240, percentage: 42 },
  { source: 'Direct', conversions: 890, percentage: 30 },
  { source: 'Social Media', conversions: 420, percentage: 14 },
  { source: 'Email', conversions: 280, percentage: 9 },
  { source: 'Referral', conversions: 150, percentage: 5 },
];

const PERFORMANCE_METRICS = [
  { name: 'Response Time', value: 245, unit: 'ms', trend: -12 },
  { name: 'Uptime', value: 99.9, unit: '%', trend: 0.1 },
  { name: 'Error Rate', value: 0.3, unit: '%', trend: -0.2 },
  { name: 'Throughput', value: 1240, unit: 'req/s', trend: 8 },
];

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'traffic', label: 'Traffic' },
  { id: 'conversions', label: 'Conversions' },
  { id: 'performance', label: 'Performance' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function UnifiedAnalyticsApp() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [query, setQuery] = useState('');
  const [channel, setChannel] = useState('all');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const series = useMemo(() => DATASETS[period], [period]);

  const kpi = useMemo(() => {
    const total = series.reduce((acc, n) => acc + (n.visits ?? 0), 0);
    const unique = series.reduce((acc, n) => acc + (n.unique ?? 0), 0);
    const conversions = series.reduce((acc, n) => acc + (n.conversions ?? 0), 0);
    const revenue = series.reduce((acc, n) => acc + (n.revenue ?? 0), 0);
    const avg = Math.round(total / series.length);
    const bounceRate =
      Math.round((series.reduce((acc, n) => acc + (n.bounce ?? 0), 0) / series.length) * 100) / 100;
    const conversionRate = Math.round((conversions / total) * 10000) / 100;
    return { total, unique, conversions, revenue, avg, bounceRate, conversionRate };
  }, [series]);

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Analytics</h2>
          <Select value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[99999]">
              <SelectGroup>
                {TABS.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <PieChart className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Sidebar - Controls */}
          <aside className="space-y-3">
            <p className="text-muted-foreground text-xs">
              Filter and customize your analytics view.
            </p>
            <Controls
              now={now}
              query={query}
              setQuery={setQuery}
              channel={channel}
              setChannel={setChannel}
              period={period}
              setPeriod={setPeriod}
            />
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab kpi={kpi} series={series as SeriesItem[]} />
            )}

            {/* Traffic Tab */}
            {activeTab === 'traffic' && (
              <TrafficTab kpi={kpi} series={series as SeriesItem[]} period={period} />
            )}

            {/* Conversions Tab */}
            {activeTab === 'conversions' && (
              <ConversionsTab kpi={kpi} series={series as SeriesItem[]} />
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <PerformanceTab series={series as SeriesItem[]} period={period} />
            )}

            <FooterNote />
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Tab Components ---

type SeriesItem = {
  label: string | number;
  visits: number;
  unique: number;
  bounce: number;
  conversions: number;
  revenue: number;
};

interface TabProps {
  kpi: {
    total: number;
    unique: number;
    conversions: number;
    revenue: number;
    avg: number;
    bounceRate: number;
    conversionRate: number;
  };
  series: SeriesItem[];
  period?: string;
}

function OverviewTab({ kpi, series }: TabProps) {
  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Visits" value={kpi.total.toLocaleString()} hint="in range" trend={8} icon={<Eye className="h-4 w-4" />} />
        <StatCard title="Unique Visitors" value={kpi.unique.toLocaleString()} hint="in range" trend={12} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Conversion Rate" value={`${kpi.conversionRate}%`} hint="average" trend={2.3} icon={<BarChart className="h-4 w-4" />} />
        <StatCard title="Revenue" value={`${kpi.revenue.toLocaleString()}`} hint="in range" trend={18} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart series={series} />
        </div>
        <TopPages pages={TOP_PAGES} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Device Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative h-48 w-48">
              <PieChart className="h-full w-full" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {DEVICE_DATA.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${device.color}`}></div>
                  <span className="text-sm">{device.name}</span>
                </div>
                <span className="text-sm font-medium">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Top Countries</h3>
          <div className="space-y-3">
            {COUNTRY_DATA.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${country.value}%` }}></div>
                  </div>
                  <span className="w-8 text-sm font-medium">{country.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TrafficTab({ kpi, series, period }: TabProps) {
  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Visits" value={kpi.total.toLocaleString()} hint="in range" trend={8} icon={<Eye className="h-4 w-4" />} />
        <StatCard title="Unique Visitors" value={kpi.unique.toLocaleString()} hint="in range" trend={12} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Avg per Interval" value={kpi.avg.toLocaleString()} hint={period} trend={3} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard title="Bounce Rate" value={`${kpi.bounceRate}%`} hint="average" trend={-5} icon={<Clock className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart series={series} />
        </div>
        <TopPages pages={TOP_PAGES} />
      </div>
    </>
  );
}

function ConversionsTab({ kpi, series }: TabProps) {
  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Visits" value={kpi.total.toLocaleString()} hint="in range" trend={8} icon={<Eye className="h-4 w-4" />} />
        <StatCard title="Conversions" value={kpi.conversions.toLocaleString()} hint="in range" trend={15} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard title="Conversion Rate" value={`${kpi.conversionRate}%`} hint="average" trend={2.3} icon={<BarChart className="h-4 w-4" />} />
        <StatCard title="Revenue" value={`${kpi.revenue.toLocaleString()}`} hint="in range" trend={18} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart series={series.map((s) => ({ ...s, visits: s.conversions }))} />
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Conversion Sources</h3>
          <div className="space-y-4">
            {CONVERSION_SOURCES.map((source, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm">
                  <span>{source.source}</span>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
                <div className="bg-muted mt-1 h-2 w-full rounded-full">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: `${source.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <TopPages pages={TOP_PAGES} />
      </div>
    </>
  );
}

function PerformanceTab({ series, period }: { series: SeriesItem[]; period: string }) {
  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERFORMANCE_METRICS.map((metric, index) => (
          <Card key={index} className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className="text-muted-foreground">
                {index === 0 && <Clock className="h-4 w-4" />}
                {index === 1 && <TrendingUp className="h-4 w-4" />}
                {index === 2 && <TrendingUp className="h-4 w-4" />}
                {index === 3 && <BarChart className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {metric.value}
                <span className="text-muted-foreground ml-1 text-sm">{metric.unit}</span>
              </div>
              <p className="text-muted-foreground text-xs">
                <span className={metric.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                </span>{' '}
                from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Performance Trend</h3>
          <Badge variant="secondary">{period}</Badge>
        </div>
        <div className="h-[300px]">
          <div className="grid h-full w-full grid-cols-24 gap-1">
            {series.map((point, i) => (
              <div key={i} className="flex flex-col items-center justify-end">
                <div className="w-full rounded-t bg-green-500" style={{ height: `${((point.visits ?? 0) / 150) * 100}%` }} />
                <div className="text-muted-foreground mt-1 text-[10px]">{point.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

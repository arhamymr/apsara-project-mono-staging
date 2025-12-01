import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

export default function StatCard({
  title,
  value,
  hint,
  trend,
  icon,
}: {
  title: string;
  value: string;
  hint?: string;
  trend?: number;
  icon?: React.ReactNode;
}) {
  const positive = (trend ?? 0) >= 0;
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="text-muted-foreground text-xs">
          {hint ? `${hint} · ` : null}
          <span className={positive ? 'text-emerald-600' : 'text-rose-600'}>
            {positive ? '+' : ''}
            {trend}%
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

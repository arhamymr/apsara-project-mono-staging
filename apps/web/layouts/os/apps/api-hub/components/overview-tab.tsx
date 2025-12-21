'use client';

import { Key, TrendingUp, Activity, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Progress } from '@workspace/ui/components/progress';

interface OverviewTabProps {
  stats: {
    totalKeys: number;
    activeKeys: number;
    requestsToday: number;
    requestsThisMonth: number;
    topEndpoints?: { endpoint: string; count: number }[];
    errorRate?: number;
  };
}

export function OverviewTab({ stats }: OverviewTabProps) {
  return (
    <div className="space-y-6 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeKeys}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalKeys - stats.activeKeys} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestsToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              API calls
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorRate?.toFixed(1) ?? 0}%</div>
            <Progress value={100 - (stats.errorRate ?? 0)} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Top Endpoints */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">1</span>
              <div>
                <p className="font-medium">Create an API Key</p>
                <p className="text-muted-foreground">Generate a key with the permissions you need</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">2</span>
              <div>
                <p className="font-medium">Integrate with your app</p>
                <p className="text-muted-foreground">Use the API to fetch blogs or submit leads</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">3</span>
              <div>
                <p className="font-medium">Test in the playground</p>
                <p className="text-muted-foreground">Use the Testing tab to try API calls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Top Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topEndpoints && stats.topEndpoints.length > 0 ? (
              <div className="space-y-3 text-sm">
                {stats.topEndpoints.map((ep, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{ep.endpoint}</code>
                    <span className="text-xs text-muted-foreground">{ep.count.toLocaleString()} calls</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No API calls yet. Create a key and start making requests!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

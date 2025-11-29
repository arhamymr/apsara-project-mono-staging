/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function TopPages({ pages }: { pages: any[] }) {
  return (
    <div>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>
            Most viewed pages in the selected range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pages.map((p) => (
            <motion.div
              key={p.path}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-sm font-medium">{p.path}</p>
                <p className="text-muted-foreground text-xs">URL</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {p.views.toLocaleString()} views
                </p>
                <p
                  className={`text-xs ${p.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {p.trend >= 0 ? '+' : ''}
                  {p.trend}%
                </p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function DashboardMetricsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="w-full rounded-3xl border border-border/60 bg-background/70 p-4">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <div className="space-y-0">
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-10 w-full rounded-none" />
            </div>
          </div>
        </div>

        <div className="w-full rounded-3xl border border-border/60 bg-background/70 p-4">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <div className="space-y-0">
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-10 w-full rounded-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-3xl border border-border/60 bg-background/70 p-4">
        <div className="mb-2.5">
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="space-y-0">
            <Skeleton className="h-10 w-full rounded-none" />
            <Skeleton className="h-10 w-full rounded-none" />
            <Skeleton className="h-10 w-full rounded-none" />
          </div>
        </div>
      </div>

      <div className="w-full rounded-3xl border border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <Card size="sm" className="w-full shadow-sm">
      <CardHeader className="px-4 pb-2 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-36" />
          </div>
          <Skeleton className="size-10 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <DashboardMetricsSkeleton />
      </CardContent>
    </Card>
  );
}

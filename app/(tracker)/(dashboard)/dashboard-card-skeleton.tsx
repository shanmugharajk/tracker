import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function DashboardMetricsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="mb-6 flex gap-2 justify-between">
        <div className="min-w-0 flex-1 space-y-0.5 border-l-2 border-transparent p-2 text-left">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5 border-l-2 border-transparent p-2 text-left">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5 border-l-2 border-transparent p-2 text-left">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <div className="rounded-[22px] bg-muted/20 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <Card className="w-full rounded-[32px] shadow-sm">
      <CardHeader className="px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-36" />
          </div>
          <Skeleton className="size-10 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
        <DashboardMetricsSkeleton />
      </CardContent>
    </Card>
  );
}

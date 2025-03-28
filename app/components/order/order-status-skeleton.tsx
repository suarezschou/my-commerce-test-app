import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function OrderStatusSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-16 mt-2" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}

            <div className="h-px bg-muted my-4" />

            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            <div className="h-px bg-muted my-4" />

            <div className="flex justify-between">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


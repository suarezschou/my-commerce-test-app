import { Suspense } from "react"
import { OrderDetails } from "../../components/order/order-details"
import { OrderStatusSkeleton } from "../../components/order/order-status-skeleton"

type PageProps = {
  params: {
    orderId: string
  }
  searchParams?: Record<string, string | string[] | undefined>
}

export default function OrderStatusPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>

      <Suspense fallback={<OrderStatusSkeleton />}>
        <OrderDetails orderId={params.orderId} />
      </Suspense>
    </div>
  )
}

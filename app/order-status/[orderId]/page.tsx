import { Suspense } from "react"
import { OrderDetails } from "../../components/order/order-details"
import { OrderStatusSkeleton } from "../../components/order/order-status-skeleton"

interface OrderStatusPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const resolvedParams = await params;
  const { orderId } = resolvedParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>

      <Suspense fallback={<OrderStatusSkeleton />}>
        <OrderDetails orderId={orderId} />
      </Suspense>
    </div>
  );
}
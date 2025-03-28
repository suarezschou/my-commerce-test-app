import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface OrderConfirmationProps {
  orderData: {
    orderId: string
    shippingInfo: any
  }
}

export function OrderConfirmation({ orderData }: OrderConfirmationProps) {
  if (!orderData.orderId) {
    return null
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            Thank you for your order. We've sent a confirmation email to{" "}
            <span className="font-medium text-foreground">{orderData.shippingInfo?.email}</span>
          </p>
          <p className="mt-2 text-muted-foreground">
            Your order number is <span className="font-medium text-foreground">#{orderData.orderId}</span>
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Shipping Information</h3>
          <address className="not-italic text-muted-foreground">
            {orderData.shippingInfo?.firstName} {orderData.shippingInfo?.lastName}
            <br />
            {orderData.shippingInfo?.address1}
            <br />
            {orderData.shippingInfo?.address2 && (
              <>
                {orderData.shippingInfo.address2}
                <br />
              </>
            )}
            {orderData.shippingInfo?.city}, {orderData.shippingInfo?.state} {orderData.shippingInfo?.postalCode}
            <br />
            {orderData.shippingInfo?.country}
          </address>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/order-status/${orderData.orderId}`}>Track Order</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


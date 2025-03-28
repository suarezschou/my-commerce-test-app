import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PackageCheck, Truck, ShoppingBag } from "lucide-react"

async function getOrderDetails(orderId: string) {
  // In a real app, you would fetch this from your API
  // This is a placeholder for demonstration

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: orderId,
    orderNumber: `ORD-${orderId.slice(0, 8)}`,
    status: "processing",
    createdAt: new Date().toISOString(),
    items: [
      { id: 1, name: "Product 1", price: 29.99, quantity: 1 },
      { id: 2, name: "Product 2", price: 49.99, quantity: 2 },
    ],
    subtotal: 129.97,
    shipping: 5.99,
    tax: 10.4,
    total: 146.36,
    shippingAddress: {
      name: "John Doe",
      address1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "US",
    },
    timeline: [
      { status: "ordered", date: new Date(Date.now() - 86400000).toISOString(), completed: true },
      { status: "processing", date: new Date().toISOString(), completed: true },
      { status: "shipped", date: null, completed: false },
      { status: "delivered", date: null, completed: false },
    ],
  }
}

export async function OrderDetails({ orderId }: { orderId: string }) {
  const order = await getOrderDetails(orderId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <ShoppingBag className="h-5 w-5" />
      case "processing":
        return <PackageCheck className="h-5 w-5" />
      case "shipped":
      case "delivered":
        return <Truck className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle>Order #{order.orderNumber}</CardTitle>
            <Badge className="w-fit capitalize">{order.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {order.timeline.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${step.completed ? getStatusColor(step.status) : "bg-muted"} text-white`}
                  >
                    {getStatusIcon(step.status)}
                  </div>
                  <span className="mt-2 text-xs font-medium capitalize">{step.status}</span>
                  {step.date && (
                    <span className="text-xs text-muted-foreground">{new Date(step.date).toLocaleDateString()}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    ((order.timeline.filter((t) => t.completed).length - 1) / (order.timeline.length - 1)) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p>${order.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p>${order.shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tax</p>
                <p>${order.tax.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-medium text-lg">
              <p>Total</p>
              <p>${order.total.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <address className="not-italic">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.address1}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </CardContent>
      </Card>
    </div>
  )
}


import { CheckCircle } from "lucide-react"

interface CheckoutStepperProps {
  currentStep: number
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Confirmation" },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : <span>{step.id}</span>}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>

            {index < steps.length - 1 && (
              <div className="hidden sm:block absolute left-0 w-full">
                <div className={`h-0.5 w-full ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


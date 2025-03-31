"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import Cookies
import { CheckoutStepper } from "../components/checkout/checkout-stepper";
import { ShippingForm } from "../components/checkout/shipping-form";
import { PaymentForm } from "../components/checkout/payment-form";
import { OrderSummary } from "../components/checkout/order-summary";
import { OrderConfirmation } from "../components/checkout/order-confirmation";

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [orderData, setOrderData] = useState({
        shippingInfo: null,
        paymentInfo: null,
        orderId: "",
    });

    const handleShippingSubmit = (shippingData: any) => {
        setOrderData((prev) => ({ ...prev, shippingInfo: shippingData }));
        setCurrentStep(2);
    };

    const handlePaymentSubmit = async (paymentData: any) => {
        setOrderData((prev) => ({ ...prev, paymentInfo: paymentData }));

        try {
            const anonymousId = Cookies.get("anonymousId"); // Use Cookies
            if (!anonymousId) {
                // Handle missing anonymousId error
                return;
            }

            const response = await fetch("/api/checkout/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingInfo: orderData.shippingInfo,
                    paymentInfo: paymentData,
                    anonymousId: anonymousId,
                }),
            });

            const data = await response.json();

            if (data.orderId) {
                setOrderData((prev) => ({ ...prev, orderId: data.orderId }));
                setCurrentStep(3);
            } else {
                // Handle order creation error
                console.error("Order creation failed:", data.error);
            }
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutStepper currentStep={currentStep} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                    {currentStep === 1 && <ShippingForm onSubmit={handleShippingSubmit} />}

                    {currentStep === 2 && <PaymentForm onSubmit={handlePaymentSubmit} />}

                    {currentStep === 3 && <OrderConfirmation orderData={orderData} />}
                </div>

                <div className="md:col-span-1">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
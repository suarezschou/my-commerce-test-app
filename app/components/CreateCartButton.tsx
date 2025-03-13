"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createNewCart } from "@/app/actions/cart";
import { useCart } from "../context/CartContext";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export default function CreateCartButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setCartId, clearAnonymousId } = useCart();

    const generateAnonymousId = () => {
        return uuidv4();
    };

    const handleCreateCart = async () => {
        setIsLoading(true);
        try {
            // Clear the anonymousId first to prevent race conditions
            clearAnonymousId();
            // Generate and set a new anonymousId
            const newAnonymousId = generateAnonymousId();
            Cookies.set("anonymousId", newAnonymousId);

            
          // Call the new endpoint to create the custom object
          const createCustomObjectResponse = await fetch('/api/create-anonymous-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ anonymousId: newAnonymousId }),
        });

        if (!createCustomObjectResponse.ok) {
            throw new Error("Failed to create anonymous cart custom object");
        }


            const result = await createNewCart();
            if (result.success) {
                console.log("New cart created:", result.cart);
                if (result.cart) {
                    const cartId = result.cart.id;
                    setCartId(cartId); // Set the cartId in the context

                        
                        router.push(`/cart/${cartId}`);
                        router.refresh();
                    
                } else {
                    console.error("Cart is undefined");
                }
            } else {
                console.error("Failed to create cart:", result.error);
            }
        } catch (error) {
            console.error("Error creating cart:", error);
        } finally {
            setIsLoading(false);
        }
    };





    return (
        <button className="bg-orange-400" onClick={handleCreateCart} disabled={isLoading}>
            {isLoading ? "Creating Cart..." : "Create New Cart"}
        </button>
    );
}
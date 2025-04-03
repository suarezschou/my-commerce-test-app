"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addProductToCart, createNewCart } from "@/app/actions/cart";
import { fetchCart } from "@/app/actions/fetchCart";
import { useCart } from "@/app/context/CartContext";
import type { ProductProjection } from "@commercetools/platform-sdk";
import Cookies from "js-cookie";

interface AddToCartProps {
    product: ProductProjection | null;
}

const AddToCart: React.FC<AddToCartProps> = ({ product }) => {
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartCreationLoading, setCartCreationLoading] = useState(false); // New loading state
    const router = useRouter();
    const { cartId, setCartId } = useCart();

    const handleAddToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        try {
            let currentCartId = cartId;
            let currentCartVersion: number;

            if (currentCartId) {
                try {
                    const currentCart = await fetchCart(currentCartId);
                    currentCartVersion = currentCart.version;
                    console.log("Current cart version:", currentCartVersion);
                } catch (error) {
                    console.error("Failed to fetch current cart, creating a new one:", error);
                    setCartCreationLoading(true); // Start loading
                    const newCart = await createNewCart();
                    setCartCreationLoading(false); // Stop loading

                    if (newCart.cart) {
                        currentCartId = newCart.cart.id;
                        currentCartVersion = newCart.cart.version;
                        setCartId(currentCartId);
                    } else {
                        throw new Error("Failed to create a new cart");
                    }
                }
            } else {
                setCartCreationLoading(true); // Start loading
                const newCart = await createNewCart();
                setCartCreationLoading(false); // Stop loading
                if (newCart.cart) {
                    currentCartId = newCart.cart.id;
                    currentCartVersion = newCart.cart.version;
                    setCartId(currentCartId);
                } else {
                    throw new Error("Failed to create a new cart");
                }
            }

            // Prevent adding to cart if cart creation is still loading
            if (cartCreationLoading) return;

            // Check for anonymousId and add to anonymous cart
            const anonymousId = Cookies.get('anonymousId');
            const price = (product?.masterVariant?.prices?.[0]?.value?.centAmount ?? 0) / 100;

            if (anonymousId) {
                await addToAnonymousCart(anonymousId, product.id, product.masterVariant.id, 1, price);
                router.push(`/cart/${currentCartId}`);
            } else {
                // If no anonymousId, add to regular cart
                await addProductToCart(currentCartId, currentCartVersion, product.id, product.masterVariant.id, 1, price);
                router.push(`/cart/${currentCartId}`);
            }

            console.log("Product added to cart successfully");

        } catch (error) {
            console.error("Failed to add product to cart:", error);
        } finally {
            setAddingToCart(false);
        }
        return (
            <Button className="font-thin text-3xl flex flex-row p-10" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? "Adding to Cart..." : "Tilføj til kurv"}
            </Button>
        );
    };
    
    
    

    async function addToAnonymousCart(anonymousId: string, productId: string, variantId: number, quantity: number, price: number) {
      try {
        console.log('Sending request to add to anonymous cart:', { anonymousId, productId, variantId, quantity });
        const url = '/api/anonymous-cart';
        console.log('Fetching URL:', url); // Log the URL

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ anonymousId, productId, variantId, quantity, price }),
        });
        console.log("Response:", response);
        // Check if the request was successful
        if (!response.ok) {
          const text = await response.text();
          // Throw an error if the status is not in the 200-299 range, which indicates success
          throw new Error(`Server responded with status ${response.status} and message ${text}`);
        }
      } catch (error) {
        // Handle the error. Show error to the user or log the error to an error tracking service.
        console.error("Failed to add item to anonymous cart:", error);
        // rethrow the error so it will bubble up
        throw error;
      }
    }

    return (
        <Button className="text-3xl flex flex-row p-10" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? "Adding to Cart..." : "Add to basket"}
        </Button>
    );
};

export default AddToCart;
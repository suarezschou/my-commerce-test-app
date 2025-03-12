import { NextResponse } from 'next/server';
import { apiRoot } from '../../lib/commercetools';

export async function POST(request: Request) {
    console.log('POST request received');
    try {
        const { anonymousId, productId, variantId, quantity } = await request.json();

        console.log('Received request to add to anonymous cart:', { anonymousId, productId, variantId, quantity });

        await storeAnonymousCartItem(anonymousId, productId, variantId, quantity);
        return NextResponse.json({ message: 'Item added to anonymous cart' });
    } catch (error) {
        console.error('Error adding to anonymous cart:', error);
        return NextResponse.json({ error: 'Failed to add to anonymous cart' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const anonymousId = searchParams.get("anonymousId");

        console.log("GET Request: anonymousId =", anonymousId); // Log anonymousId

        if (!anonymousId) {
            console.log("GET Request: No anonymousId provided"); // Log missing anonymousId
            return NextResponse.json({ error: "No anonymousId provided" }, { status: 400 });
        }

        const projectKey = process.env.CTP_PROJECT_KEY || "";

        console.log("GET Request: Project Key =", projectKey); // Log projectKey

        const customObject = await apiRoot
            .withProjectKey({ projectKey })
            .customObjects()
            .withContainerAndKey({ container: "anonymous-carts", key: anonymousId })
            .get()
            .execute();

        if (customObject.body) {
            console.log("GET Request: Custom Object Found", customObject.body); // Log found object
            return NextResponse.json(customObject.body);
        } else {
            console.log("GET Request: Custom Object Not Found"); // Log not found
            return NextResponse.json({ value: [] });
        }
    } catch (error) {
        console.error("GET Request: Error retrieving anonymous cart:", error); // Log error
        return NextResponse.json({ error: "Failed to retrieve anonymous cart" }, { status: 500 });
    }
}

async function storeAnonymousCartItem(anonymousId: string, productId: string, variantId: number, quantity: number) {
    try {
        const projectKey = process.env.CTP_PROJECT_KEY || "";
        console.log('Storing anonymous cart item:', { anonymousId, productId, variantId, quantity });
        try {
        // Check if custom object exists
        const existingCustomObject = await apiRoot
            .withProjectKey({ projectKey })
            .customObjects()
            .withContainerAndKey({ container: 'anonymous-carts', key: anonymousId })
            .get()
            .execute();

        if (existingCustomObject.body) {

            // Update existing custom object

            const existingCart = existingCustomObject.body.value;
            const existingItemIndex = existingCart.findIndex(
                (item: any) => item.productId === productId && item.variantId === variantId
            );

            if (existingItemIndex !== -1) {
                existingCart[existingItemIndex].quantity += quantity;
            } else {
                existingCart.push({ productId, variantId, quantity });
            }

            console.log("Updated existingCart:", existingCart);
            
            await apiRoot
                    .withProjectKey({ projectKey })
                    .customObjects()
                    .post({
                        body: {
                            container: 'anonymous-carts',
                            key: anonymousId,
                            value: existingCart,
                            version: existingCustomObject.body.version,
                        },
                    })
                    .execute();
            }
        } catch (getCustomObjectError: any) {
            if (getCustomObjectError.statusCode === 404) {
                console.log("Custom Object not found, creating new one.");
                const createResponse = await apiRoot
                    .withProjectKey({ projectKey })
                    .customObjects()
                    .post({
                        body: {
                            container: 'anonymous-carts',
                            key: anonymousId,
                            value: [{ productId, variantId, quantity }],
                        },
                    })
                    .execute();
                console.log("Custom Object Creation Response:", createResponse);
            } else {
                throw getCustomObjectError; // Re-throw other errors
            }
        }
    } catch (error: any) {
        console.error('Error storing anonymous cart item:', error);
        if (error.response) {
            console.error("Commercetools API Error Details:", error.response);
        }
        throw error;
    }
}
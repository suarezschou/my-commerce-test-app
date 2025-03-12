import { apiRoot } from '@/app/lib/commercetools';

export async function fetchProductProjection(productId: string) {
    const projectKey = process.env.CTP_PROJECT_KEY || '';
    console.log("fetchProductProjection called with productId:", productId);
    
    try {
        const response = await apiRoot
            .withProjectKey({ projectKey })
            .products()
            .withId({ ID: productId })
            .get()
            .execute();

        console.log(`Product Projection Response for ${productId}:`, response); // Log entire response
        console.log(`Product Name for ${productId}:`, response.body?.masterData?.current?.name); // Log name property
        console.log(`Product Images for ${productId}:`, response.body?.masterData?.current?.masterVariant?.images); // Log images

        return response.body;
        
    } catch (error) {
        console.error(`Error fetching product projection for ${productId}:` , error);
        return null; // Return null on error
    }
}
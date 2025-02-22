// pages/products/[id].tsx
import { apiRoot } from '../apiClientConfig'; // Import your Commercetools client
import { ProductProjection } from '@commercetools/platform-sdk';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
 // Import the useRouter hook

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  const [product, setProduct] = useState<ProductProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) { // Only fetch if id is available
      async function fetchProduct() {
        try {
          const { body } = await apiRoot.withProjectKey({ projectKey: 'my_test_project' })
            .productProjections()
            .withId({ ID: id as string }) // Use the withId method
            .get()
            .execute();

          setProduct(body);
        } catch (err: any) {
          console.error("Error fetching product:", err);
          setError(err.message || "Failed to fetch product.");
        } finally {
          setLoading(false);
        }
      }

      fetchProduct();
    }
  }, [id]); // Add id to the dependency array

  if (!id) {
    return <div>Product ID is missing.</div>; // Handle cases where ID isn't available yet
  }

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>; // Handle cases where the product isn't found
  }

  return (
    <div>
      <h1>{product.name?.['en-US'] || "Product Name Unavailable"}</h1>
      {product.masterVariant.images && product.masterVariant.images.length > 0 && (
        <img src={product.masterVariant.images[0].url} alt={product.name?.['en-US'] || "Product Image"} width={300} />
      )}
      <p>{product.description?.['en-US'] || "No Description Available"}</p>
      <p>
        Price: {product.masterVariant.prices && product.masterVariant.prices.length > 0 ? product.masterVariant.prices[0].value.centAmount / 100 : "N/A"}{" "}
        {product.masterVariant.prices && product.masterVariant.prices.length > 0 ? product.masterVariant.prices[0].value.currencyCode : "N/A"}
      </p>
      {/* ... other product details */}
    </div>
  );
};

export default ProductDetailsPage;
'use client'
import { apiRoot } from '../../apiClientConfig'; // Import your Commercetools client
import { ProductProjection } from '@commercetools/platform-sdk';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProductList from '../../productList';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



const ProductDetailsPage: React.FC = () => {
  
  const { id } = useParams(); // Get the product ID from the URL
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
<div className='font-extralight thin flex flex-col items-center min-h'>
  <Card>
  <CardHeader>
      <CardTitle>
        <h1 className='text-3xl'>{product.name?.['en-US'] || "Product Name Unavailable"}</h1>
      </CardTitle>
      <CardDescription>
        100% økologisk merinould
      </CardDescription>
    </CardHeader>
    <CardContent>
      {product.masterVariant.images && product.masterVariant.images.length > 0 && (
        <img src={product.masterVariant.images[0].url} alt={product.name?.['en-US'] || "Product Image"} width={300} />
      )}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className='text-xl'>Beskrivelse</AccordionTrigger>
            <AccordionContent>
              <p className='text-sm'>{product.description?.['en-US'] || "No Description Available"}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>     
    </CardContent>
    
    <CardFooter>
      <p className='text-3xl'> {product.masterVariant.prices && product.masterVariant.prices.length > 0 ? product.masterVariant.prices[0].value.centAmount / 100 : "N/A"}{" "}
      {product.masterVariant.prices && product.masterVariant.prices.length > 0 ? product.masterVariant.prices[0].value.currencyCode : "N/A"}
      </p>   
    </CardFooter>
    <CardFooter>
      <Button className='font-thin text-3xl flex flex-row p-10'>Tilføj til kurv</Button>
    </CardFooter>
  </Card>
  <CardTitle>
  <h1 className='p-10 text-3xl'>Måske kan du også lide</h1>
  </CardTitle>
  <ProductList />
     
</div>
  );
};

export default ProductDetailsPage;
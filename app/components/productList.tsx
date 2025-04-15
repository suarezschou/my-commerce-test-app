"use client"
import { ProductProjection } from '@commercetools/platform-sdk';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { apiRoot } from '../lib/commercetools';
import router from 'next/router';

interface ProductListProps {
  // Define any props here if needed
}

const ProductList: React.FC<ProductListProps> = ({  }) => {
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { body } = await apiRoot
          .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
          .productProjections()
          .search()
          .get()
          .execute();

        setProducts(body.results);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(products)
  return (
    <ul className='p-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {products.map((product) => (
        <Card key={product.id}>
          <li>
          <CardHeader>
            <h2>{product.name['en-US']}</h2> 
          </CardHeader>
          <CardContent>
            {product.masterVariant.images && product.masterVariant.images.length > 0 && (
              <img src={product.masterVariant.images[0].url} alt={product.name.en} width={200} />
            )}
            <p>{product.description?.en}</p>
            {product.masterVariant.prices && product.masterVariant.prices.length > 0 && (
              <p>Price: {product.masterVariant.prices[0].value.centAmount / 100} {product.masterVariant.prices[0].value.currencyCode}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">            
            <Button className="p-7 text-xl w-full">
              <Link
                href={`/products/${product.id}`}               
                >
                View product
              </Link>
            </Button>
          </CardFooter>
          </li>
        </Card>
      ))}
    </ul>
  );
};

export default ProductList;
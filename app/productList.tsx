import { apiRoot } from './apiClientConfig'; // Your Commercetools client
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
interface ProductListProps {
  // You can add props here if needed, e.g., category ID for filtering
}

const ProductList: React.FC<ProductListProps> = ({  }) => {
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { body } = await apiRoot.withProjectKey({ projectKey: 'my_test_project' })
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
    <ul className='p-10 grid grid-cols-2'>
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
          <CardFooter>
            <Button>
              <Link
                href={`/products/${product.id}`}               
                >
                View Details
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
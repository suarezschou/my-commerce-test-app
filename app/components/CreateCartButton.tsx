'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createNewCart } from '@/app/actions/cart';

export default function CreateCartButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateCart = async () => {
    setIsLoading(true);
    try {
      const result = await createNewCart();
      if (result.success) {
        console.log('New cart created:', result.cart);
        if (result.cart) {
          const cartId = result.cart.id;
          router.push(`/cart/${cartId}`);
          
        } else {
          console.error('Cart is undefined');
        }
      } else {
        console.error('Failed to create cart:', result.error);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button className='bg-orange-400' onClick={handleCreateCart} disabled={isLoading}>
      {isLoading ? 'Creating Cart...' : 'Create New Cart'}
    </button>
    
  );
}
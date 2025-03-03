// app/components/CreateCartButton.tsx
'use client'

import { useState } from 'react';
import { createNewCart } from '../actions/route';

export default function CreateCartButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCart = async () => {
    setIsLoading(true);
    try {
      const result = await createNewCart();
      if (result.success) {
        console.log('New cart created:', result.cart);
        // Here you might want to store the cart ID in local storage or context
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
    <button className='bg-orange-500' onClick={handleCreateCart} disabled={isLoading}>
      {isLoading ? 'Creating Cart...' : 'Create New Cart'}  
    </button>
  );
}
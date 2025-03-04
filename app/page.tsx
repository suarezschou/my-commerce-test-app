import ProductList from "@/app/components/productList"
import CreateCartButton from "./components/CreateCartButton";
import CartPage from "./cart/[cartId]/page";
require('dotenv').config();


export default function Home() {
  return (
    <div className="flex flex-col items-center">
        
      <h1 className="text-4xl">Products</h1>
      
      <CartPage />
      <CreateCartButton />
      <ProductList />
      
    </div>
  )
}


import ProductList from "@/app/components/productList"
require('dotenv').config();


export default function Home() {
  return (
    <div className="flex flex-col items-center">

      <h1 className="text-4xl font-extralight">Products</h1>

      <ProductList />

    </div>
  )
}


import { useEffect, useState } from "react";
import { Product } from "../models/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  function addProduct() {
    setProducts((prevState) => [
      ...prevState,
      {
        id: prevState.length + 101,
        name: `Product ${products.length + 1}`,
        price: (products.length + 1) * 100,
        brand: "Brand",
        description: "Description",
        pictureUrl: "http://picsum.photos/200",
      },
    ]);
  }
  return (
    <div>
      <h1>NoteLinkerAl</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default App;

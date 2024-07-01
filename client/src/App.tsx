import { useState } from "react";

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
  ]);
  function addProduct() {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: `Product ${products.length + 1}`,
        price: (products.length + 1) * 100,
      },
    ]);
  }
  return (
    <div>
      <h1>NoteLinkerAl</h1>
      <ul>
        {products.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price}
          </li>
        ))}
      </ul>
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default App;

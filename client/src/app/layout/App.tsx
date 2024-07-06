// import { useEffect, useState } from "react";
// import { Product } from "../models/product";
// import Catalog from "../../features/catalog/Catalog";
import { ThemeProvider } from "../../components/ThemeContext";
import Sidebar from "../../components/Sidebar";

function App() {
  // const [products, setProducts] = useState<Product[]>([]);
  // useEffect(() => {
  //   fetch("http://localhost:5000/api/products")
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data));
  // }, []);
  // function addProduct() {
  //   setProducts((prevState) => [
  //     ...prevState,
  //     {
  //       id: prevState.length + 101,
  //       name: `Product ${products.length + 1}`,
  //       price: (products.length + 1) * 100,
  //       brand: "Brand",
  //       description: "Description",
  //       pictureUrl: "http://picsum.photos/200",
  //     },
  //   ]);
  // }
  return (
    <ThemeProvider>
      <div className="flex">
        <Sidebar />
      </div>
    </ThemeProvider>
  );
}

export default App;

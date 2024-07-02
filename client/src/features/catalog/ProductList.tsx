import { List } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

const ProductList = ({ products }: Props) => {
  return (
    <div>
      <List>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </List>
    </div>
  );
};

export default ProductList;

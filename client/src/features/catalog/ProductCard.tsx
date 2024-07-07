import { Product } from "../../app/models/product";
interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <h2>{product.price}</h2>
      <img src={product.pictureUrl} alt={product.name} />
    </div>
  );
};

export default ProductCard;

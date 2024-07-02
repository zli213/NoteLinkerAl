import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product";
interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <ListItem key={product.id}>
      <ListItemAvatar>
        <Avatar src={product.pictureUrl} />
      </ListItemAvatar>
      <ListItemText>
        {product.name} - {product.price}
      </ListItemText>
    </ListItem>
  );
};

export default ProductCard;

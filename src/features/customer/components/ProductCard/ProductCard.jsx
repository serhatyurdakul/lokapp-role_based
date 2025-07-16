import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "@/features/customer/store/customerMenuSlice";
import "./ProductCard.scss";

const ProductCard = ({
  name,
  price,
  image,
  categoryId,
  itemId,
  remainingQuantity = 0,
}) => {
  const dispatch = useDispatch();
  const isSelected = useSelector(
    (state) => state.customerMenu.selectedItems[categoryId] === itemId
  );
  const isOutOfStock = remainingQuantity === 0;

  // Ürün fiyatını formatlayarak gösteren yardımcı fonksiyon
  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : price;
  };

  return (
    <button
      className={`product-card ${isSelected ? "product-card--selected" : ""}`}
      disabled={isOutOfStock}
      aria-disabled={isOutOfStock}
      onClick={() => dispatch(selectItem({ categoryId, itemId }))}
    >
      <img
        src={image}
        alt={name}
        className='product-card__image'
        loading='lazy'
        onError={(e) => {
          e.target.src = "https://placehold.co/150x150?text=Yemek";
        }}
      />
      <div className='product-card__content'>
        <h3 className='product-card__name'>{name}</h3>
        <p className='product-card__price'>{formatPrice(price)} ₺</p>
      </div>
      {isSelected && <div className='product-card__selected-indicator'>✓</div>}
    </button>
  );
};

export default ProductCard;

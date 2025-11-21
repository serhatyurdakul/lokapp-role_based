import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "@/features/customer/store/customerMenuSlice";
import Badge from "@/common/components/Badge/Badge";
import { ReactComponent as CheckIcon } from "@/assets/icons/check.svg";
import "./ProductCard.scss";

const PLACEHOLDER_IMAGE = "https://placehold.co/150x150?text=Yemek";

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
    (state) =>
      state.customerMenu.selectedItems[String(categoryId)] === String(itemId)
  );
  const isOutOfStock = remainingQuantity === 0;

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
      aria-pressed={isSelected}
      onClick={() =>
        dispatch(
          selectItem({
            categoryId: String(categoryId),
            itemId: String(itemId),
          })
        )
      }
    >
      {isOutOfStock ? (
        <div className='product-card__status'>
          <Badge tone='out-of-stock'>Tükendi</Badge>
        </div>
      ) : null}
      <img
        src={image}
        alt={name}
        className='product-card__image'
        loading='lazy'
        onError={(event) => {
          const target = event?.target;
          if (!target) return;
          // Prevent loops if fallback also fails.
          target.onerror = null;
          target.src = PLACEHOLDER_IMAGE;
        }}
      />
      <div className='product-card__content'>
        <h3 className='product-card__name'>{name}</h3>
        <p className='product-card__price'>{formatPrice(price)} ₺</p>
      </div>
      {isSelected && !isOutOfStock ? (
        <div className='product-card__selected-indicator' aria-hidden='true'>
          <CheckIcon className='product-card__selected-indicator-icon' />
        </div>
      ) : null}
    </button>
  );
};

export default ProductCard;

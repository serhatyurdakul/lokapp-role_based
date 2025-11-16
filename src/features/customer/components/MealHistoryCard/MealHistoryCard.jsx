import PropTypes from "prop-types";
import Badge from "@/common/components/Badge/Badge";
import "./MealHistoryCard.scss";

const MealHistoryCard = ({ meal, onClick }) => {
  const { date, type, restaurant, time, items } = meal;

  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isClickable = typeof onClick === "function";

  return (
    <div
      className={`meal-item${isClickable ? " meal-item--clickable" : ""}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter") onClick();
            }
          : undefined
      }
    >
      <div className='meal-item__header'>
        <div className='meal-item__date'>
          <span className='meal-item__dateText'>{formattedDate}</span>
          <span className='meal-item__time'>{time}</span>
        </div>
        <Badge
          className='meal-item__type'
          tone={type === "Restoranda" ? "dine-in" : "delivery"}
        >
          {type}
        </Badge>
      </div>
      <div className='meal-item__body'>
        <p className='meal-item__restaurant'>{restaurant}</p>
        {items && items.length > 0 && (
          <p className='meal-item__items'>{items.join(" • ")}</p>
        )}
      </div>
    </div>
  );
};

MealHistoryCard.propTypes = {
  meal: PropTypes.shape({
    date: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["Restoranda", "Sipariş"]).isRequired,
    restaurant: PropTypes.string.isRequired,
    time: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClick: PropTypes.func,
};

export default MealHistoryCard;

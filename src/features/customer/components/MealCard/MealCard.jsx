import PropTypes from "prop-types";
import Badge from "@/common/components/Badge/Badge";
import "./MealCard.scss";

const MealCard = ({ meal, onClick }) => {
  const { date, type, restaurant, time, items } = meal;

  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isClickable = typeof onClick === "function";

  return (
    <div
      className={`meal-card${isClickable ? " meal-card--clickable" : ""}`}
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
      <div className='meal-card__header'>
        <div className='meal-card__date'>
          <span className='meal-card__date-text'>{formattedDate}</span>
          <span className='meal-card__time'>{time}</span>
        </div>
        <Badge
          className='meal-card__type'
          tone={type === "Restoranda" ? "dine-in" : "delivery"}
        >
          {type}
        </Badge>
      </div>
      <div className='meal-card__body'>
        <p className='meal-card__restaurant'>{restaurant}</p>
        {items && items.length > 0 && (
          <p className='meal-card__items'>{items.join(" • ")}</p>
        )}
      </div>
    </div>
  );
};

MealCard.propTypes = {
  meal: PropTypes.shape({
    date: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["Restoranda", "Sipariş"]).isRequired,
    restaurant: PropTypes.string.isRequired,
    time: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClick: PropTypes.func,
};

export default MealCard;

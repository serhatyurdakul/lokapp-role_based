import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";
import "./MealHistoryCard.scss";

const MealHistoryCard = ({ meal, onClick }) => {
  const { date, type, restaurant, time, items } = meal;

  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isClickable = typeof onClick === 'function';

  return (
    <div
      className={`meal-item${isClickable ? ' clickable' : ''}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      <div className='meal-header'>
        <div className='meal-date'>
          <span className='date'>{formattedDate}</span>
          <span className='time'>{time}</span>
        </div>
        <Badge className='meal-type' tone={type === "Restoranda" ? "dine-in" : "delivery"}>
          {type}
        </Badge>
      </div>
      <div className='meal-body'>
        <p className='restaurant'>{restaurant}</p>
        {items && items.length > 0 && (
          <p className='items'>{items.join(" • ")}</p>
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

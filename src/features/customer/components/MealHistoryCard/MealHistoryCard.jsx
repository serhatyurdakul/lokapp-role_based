import PropTypes from "prop-types";
import "./MealHistoryCard.scss";

const MealHistoryCard = ({ meal }) => {
  const { date, type, restaurant, time, items } = meal;

  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className='meal-item'>
      <div className='meal-header'>
        <div className='meal-date'>
          <span className='date'>{formattedDate}</span>
          <span className='time'>{time}</span>
        </div>
        <span className='meal-type' data-type={type}>
          {type}
        </span>
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
    type: PropTypes.oneOf(["Lokantada", "Sipariş"]).isRequired,
    restaurant: PropTypes.string.isRequired,
    time: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MealHistoryCard;

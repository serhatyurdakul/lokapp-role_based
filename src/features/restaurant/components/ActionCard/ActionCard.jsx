import PropTypes from "prop-types";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import "./ActionCard.scss";

const ActionCard = ({ title, value, unit, variant = "default", onClick }) => {
  const modifiers =
    variant && variant !== "default" ? ` action-card--${variant}` : "";

  return (
    <button
      type='button'
      className={`action-card${modifiers}`}
      onClick={onClick}
    >
      <span className='action-card__title'>{title}</span>
      <div className='action-card__footer'>
        <div className='action-card__metric'>
          <span className='action-card__value'>{value}</span>
          {unit && <span className='action-card__unit'>{unit}</span>}
        </div>
        <ChevronRightIcon className='action-card__chevron' aria-hidden='true' />
      </div>
    </button>
  );
};

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  variant: PropTypes.oneOf(["default", "pending"]),
  onClick: PropTypes.func.isRequired,
};

export default ActionCard;

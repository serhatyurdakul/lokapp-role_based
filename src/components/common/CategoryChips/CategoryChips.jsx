import PropTypes from "prop-types";
import "./CategoryChips.scss";

const CategoryChips = ({ options = [], selectedValue, onSelect, ariaLabel = "Kategoriler" }) => {
  return (
    <div className='chips-filter' role='group' aria-label={ariaLabel}>
      {options.map((opt) => {
        const isActive = String(opt.value) === String(selectedValue);
        return (
          <button
            key={opt.value}
            type='button'
            className={`chip ${isActive ? "active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

CategoryChips.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onSelect: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

export default CategoryChips;
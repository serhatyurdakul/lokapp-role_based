import PropTypes from "prop-types";
import React from "react";
import "./FilterBar.scss";

export const ALL = "all"; // Special value to clear applied filters

const FilterBar = ({ options, selectedValue, onChange }) => {
  return (
    <div className='category-filter'>
      <button
        className={`filter-btn ${selectedValue === ALL ? "active" : ""}`}
        onClick={() => onChange(ALL)}
      >
        Tümü
      </button>
      {options.map((option) => (
        <button
          key={option.id}
          className={`filter-btn ${
            selectedValue === String(option.id) ? "active" : ""
          }`}
          onClick={() => onChange(String(option.id))}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

FilterBar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(FilterBar);

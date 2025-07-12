import PropTypes from "prop-types";
import React from "react";
import "./FilterBar.scss";

export const ALL = "all"; // Uygulanan filtreleri kaldıran özel değer

// ALL sabitini dışa aktararak uygulamada tekrarlı "all" stringi yerine tek kaynaklı değer kullanılmasını sağlıyoruz.
// bileşenlerde tekrarlı "all" stringi yerine tek kaynaklı değer kullanılmasını sağlıyoruz.

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

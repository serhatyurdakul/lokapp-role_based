import PropTypes from "prop-types";
import "./FilterBar.scss";

const FilterBar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className='category-filter'>
      <button
        className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
        onClick={() => onCategoryChange("all")}
      >
        Tümü
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`filter-btn ${
            selectedCategory === category.id ? "active" : ""
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

FilterBar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default FilterBar;

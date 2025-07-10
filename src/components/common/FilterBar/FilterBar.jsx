import PropTypes from "prop-types";
import "./FilterBar.scss";

export const ALL = "all"; // Uygulanan filtreleri kaldıran özel değer

// Mevcut kullanımı korumak için prop isimleri değişmedi. ALL sabitini dışa aktararak diğer
// bileşenlerde tekrarlı "all" stringi yerine tek kaynaklı değer kullanılmasını sağlıyoruz.

const FilterBar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className='category-filter'>
      <button
        className={`filter-btn ${selectedCategory === ALL ? "active" : ""}`}
        onClick={() => onCategoryChange(ALL)}
      >
        Tümü
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`filter-btn ${
            selectedCategory === String(category.id) ? "active" : ""
          }`}
          onClick={() => onCategoryChange(String(category.id))}
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
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default FilterBar;

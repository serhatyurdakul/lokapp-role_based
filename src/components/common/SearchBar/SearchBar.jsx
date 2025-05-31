import PropTypes from "prop-types";
import "./SearchBar.scss";

const SearchBar = ({ value, onChange, placeholder = "Ara..." }) => {
  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange} // Doğrudan event'i dışarı aktarıyoruz
      />
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

// JavaScript varsayılan parametre değerleri kullanıldığı için defaultProps'a gerek yok

export default SearchBar;

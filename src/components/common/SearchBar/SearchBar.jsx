import PropTypes from "prop-types";
import "./SearchBar.scss";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";

const SearchBar = ({ value, onChange, placeholder = "Ara..." }) => {
  return (
    <div className='search-bar'>
      <SearchIcon className='search-bar__icon' />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;

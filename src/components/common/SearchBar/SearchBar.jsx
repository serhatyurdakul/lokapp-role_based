import PropTypes from "prop-types";
import "./SearchBar.scss";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
import { ReactComponent as ClearIcon } from "../../../assets/icons/clear.svg";

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Ara...",
  isClearable = true,
}) => {
  return (
    <div className='search-bar'>
      <SearchIcon className='search-icon' />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode='search'
        enterKeyHint='search'
      />
      {isClearable && value && value.length > 0 && (
        <button
          type='button'
          className='clear-button'
          aria-label='Temizle'
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => {
            if (typeof onClear === "function") {
              onClear();
            }
          }}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
};

export default SearchBar;

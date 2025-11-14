import { useState, useEffect, useRef } from "react";
import { ReactComponent as ChevronDownIcon } from "@/assets/icons/chevron-down.svg";
import "./CustomDropdown.scss";

const CustomDropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Seçiniz",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dışarıya tıklama olayını dinle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const handleOptionClick = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  const dropdownClassName = ["custom-dropdown", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={dropdownClassName} ref={dropdownRef}>
      <button
        className='dropdown-button'
        onClick={() => options?.length > 0 && setIsOpen(!isOpen)}
        aria-haspopup='listbox'
        aria-expanded={isOpen && options?.length > 0}
        disabled={!options || options.length === 0}
      >
        <span>{displayLabel}</span>
        <ChevronDownIcon className={`chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && options && options.length > 0 && (
        <ul className='dropdown-list' role='listbox'>
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-item ${
                selectedValue === option.value ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
              role='option'
              aria-selected={selectedValue === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;

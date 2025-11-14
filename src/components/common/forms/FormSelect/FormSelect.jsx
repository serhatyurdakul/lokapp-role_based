import "./FormSelect.scss";
import { ReactComponent as ChevronDownIcon } from "@/assets/icons/chevron-down.svg"; 

const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // Expects an array of objects: { value: 'val', label: 'Label' } or { id: 'val', name: 'Label' }
  defaultOptionText = "Seçiniz",
  disabledOptionText = "Veri bulunamadı",
  required = false,
  error,
  className = "",
  ...rest // Other native select props (e.g., disabled)
}) => {
  const selectId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <div className="select-wrapper">
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`${error ? "error" : ""} form-select`}
        {...rest}
      >
        {defaultOptionText ? (
          <option value=''>{defaultOptionText}</option>
        ) : null}
        {options.length > 0
          ? options.map((option) => (
              <option
                key={option.id || option.value}
                value={option.id || option.value}
              >
                {option.name || option.label}
              </option>
            ))
          : !defaultOptionText && (
              <option value='' disabled>
                {disabledOptionText}
              </option>
            )}
      </select>
      <ChevronDownIcon className="select-arrow" />
      </div>
      {error && <span className='input-error'>{error}</span>}
    </div>
  );
};

export default FormSelect;

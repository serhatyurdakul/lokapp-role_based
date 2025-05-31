import "./FormInput.scss";
import { ReactComponent as CloseIcon } from "@/assets/icons/close.svg";

const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  error,
  min,
  max,
  isClearable = false,
  onClear,
}) => {
  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`form-group ${isClearable ? "form-group-clearable" : ""}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          className={`form-input ${error ? "error" : ""}`.trim()}
        />
        {isClearable && value && (
          <button type="button" className="clear-button" onClick={handleClear} aria-label="İçeriği temizle">
            <CloseIcon />
          </button>
        )}
      </div>
      {error && <span className='input-error'>{error}</span>}
    </div>
  );
};

export default FormInput;

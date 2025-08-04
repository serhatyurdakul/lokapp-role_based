import { useState } from "react";
import "./FormInput.scss";
import { ReactComponent as CloseIcon } from "@/assets/icons/close.svg";
import { ReactComponent as EyeIcon } from "@/assets/icons/eye.svg";
import { ReactComponent as EyeOffIcon } from "@/assets/icons/eye-off.svg";
import { ReactComponent as SearchIcon } from "@/assets/icons/search.svg";

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
  isSearchable = false,
}) => {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

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
        {isSearchable && <SearchIcon className="search-icon" />}
      <input
        type={inputType}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        className={`form-input ${error ? "error" : ""} ${isSearchable ? "searchable" : ""}`.trim()}
      />
        {isPasswordField && (
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}

        {!isPasswordField && isClearable && value && (
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

import { useState } from "react";
import "./FormInput.scss";
import { ReactComponent as ClearIcon } from "@/assets/icons/clear.svg";
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
  inputMode,
  autoFocus = false,
  labelAdornment = null,
  disabled = false,
  ...rest
}) => {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    // Re-focus the input so the keyboard opens if it was closed
    document.getElementById(id)?.focus();
  };

  return (
    <div
      className={`form-group ${
        isClearable ? "form-group-clearable" : ""
      }`.trim()}
    >
      <label htmlFor={id}>
        {label}
        {labelAdornment ? (
          <span className='label-adornment'>{labelAdornment}</span>
        ) : null}
      </label>
      <div className='input-wrapper'>
        {isSearchable && <SearchIcon className='search-icon' />}
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
          className={`form-input ${error ? "error" : ""} ${
            isSearchable ? "searchable" : ""
          }`.trim()}
          inputMode={inputMode}
          autoFocus={autoFocus}
          disabled={disabled}
          {...rest}
        />
        {isPasswordField && (
          <button
            type='button'
            className='toggle-button'
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}

        {!isPasswordField && isClearable && value && (
          <button
            type='button'
            className='clear-button'
            onPointerDown={(e) => e.preventDefault()} // keep input focused on touch/mouse
            onClick={handleClear}
            aria-label='İçeriği temizle'
          >
            <ClearIcon />
          </button>
        )}
      </div>
      {error && <span className='input-error'>{error}</span>}
    </div>
  );
};

export default FormInput;

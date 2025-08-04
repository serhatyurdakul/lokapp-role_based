import React from "react";
import PropTypes from "prop-types";
import "./Button.scss"; 

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  loading = false,
  loadingText = "Yükleniyor...",
}) => {
  const baseClassName = "btn";
  const variantClassName = `btn-${variant}`;

  // Merge additional classes received via className prop
  const combinedClassName =
    `${baseClassName} ${variantClassName} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? loadingText : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
};

export default Button;

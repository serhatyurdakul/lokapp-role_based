import React from "react";
import PropTypes from "prop-types";
import "./Button.scss"; // Temel yapı için, başlangıçta boş olabilir veya _buttons.scss'e yönlendirebilir

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

  // className prop'u ile gelen ek sınıfları birleştir
  const combinedClassName =
    `${baseClassName} ${variantClassName} ${className} ${loading ? "btn-loading" : ""}`.trim();

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

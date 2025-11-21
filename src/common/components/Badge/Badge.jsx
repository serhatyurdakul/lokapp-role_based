import PropTypes from "prop-types";
import "./Badge.scss";

const toneClassMap = {
  neutral: "badge--tone-neutral",
  delivery: "badge--tone-delivery",
  "dine-in": "badge--tone-dine-in",
  success: "badge--tone-success",
  warning: "badge--tone-warning",
  error: "badge--tone-error",
  pending: "badge--tone-pending",
  completed: "badge--tone-completed",
  "out-of-stock": "badge--tone-out-of-stock",
};

const Badge = ({
  as: Component = "span",
  tone = "neutral",
  size = "default",
  icon,
  endIcon,
  fullWidth = false,
  className,
  children,
  ...rest
}) => {
  const toneClass = toneClassMap[tone] ?? toneClassMap.neutral;

  const classNames = [
    "badge",
    toneClass,
    size !== "default" ? `badge--size-${size}` : null,
    fullWidth ? "badge--fullWidth" : null,
    icon || endIcon ? "badge--with-icon" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames} {...rest}>
      {icon ? (
        <span className='badge__icon' aria-hidden='true'>
          {icon}
        </span>
      ) : null}
      <span className='badge__content'>{children}</span>
      {endIcon ? (
        <span className='badge__icon badge__icon--end' aria-hidden='true'>
          {endIcon}
        </span>
      ) : null}
    </Component>
  );
};

Badge.propTypes = {
  as: PropTypes.elementType,
  tone: PropTypes.oneOf([
    "neutral",
    "delivery",
    "dine-in",
    "success",
    "warning",
    "error",
    "pending",
    "completed",
    "out-of-stock",
  ]),
  size: PropTypes.oneOf(["default", "compact"]),
  icon: PropTypes.node,
  endIcon: PropTypes.node,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Badge;

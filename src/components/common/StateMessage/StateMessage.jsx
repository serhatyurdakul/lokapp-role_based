import PropTypes from "prop-types";
import Button from "@/components/common/Button/Button";
import "./StateMessage.scss";

/**
 * StateMessage – generic UI for empty / error (and future) states.
 * Props:
 *  - variant ("empty" | "error"): determines theme coloring.
 *  - message (string): main text.
 *  - icon   (ReactComponent, optional): illustration component.
 *  - actionText (string): label for the action button (default: "Yenile").
 *  - onAction (function): click handler for the action button; if omitted, button is not rendered.
 */
const StateMessage = ({
  variant = "empty",
  message,
  icon: Icon,
  actionText = "Yenile",
  onAction,
}) => {
  return (
    <div className={`state-message state-message--${variant}`}>      
      {Icon && <Icon className="state-message__icon" />}
      <p className="state-message__message">{message}</p>
      {onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          className="state-message__button"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

StateMessage.propTypes = {
  variant: PropTypes.oneOf(["empty", "error"]),
  message: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
};

export default StateMessage;

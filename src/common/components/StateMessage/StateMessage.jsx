import PropTypes from "prop-types";
import Button from "@/common/components/Button/Button";
import "./StateMessage.scss";

const StateMessage = ({
  variant = "empty",
  message,
  icon: Icon,
  actionText = "Yenile",
  onAction,
}) => {
  return (
    <div className={`state-message state-message--${variant}`}>
      {Icon && <Icon className='state-message__icon' />}
      <p className='state-message__message'>{message}</p>
      {onAction && (
        <Button
          variant='primary'
          onClick={onAction}
          className='state-message__button'
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

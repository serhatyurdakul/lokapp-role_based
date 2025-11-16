import PropTypes from "prop-types";
import StateMessage from "./StateMessage";

// Wrapper for error state (keeps semantic import name)
const ErrorState = ({ message, onRetry }) => (
  <StateMessage variant='error' message={message} onAction={onRetry} />
);

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

export default ErrorState;

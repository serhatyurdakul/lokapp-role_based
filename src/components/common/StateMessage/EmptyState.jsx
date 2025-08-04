import PropTypes from "prop-types";
import { ReactComponent as EmptyIcon } from "@/assets/icons/empty.svg";
import StateMessage from "./StateMessage";

// Wrapper for empty state (keeps semantic import name)
const EmptyState = ({ message, onRefresh }) => (
  <StateMessage
    variant="empty"
    icon={EmptyIcon}
    message={message}
    onAction={onRefresh}
  />
);

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  onRefresh: PropTypes.func,
};

export default EmptyState;

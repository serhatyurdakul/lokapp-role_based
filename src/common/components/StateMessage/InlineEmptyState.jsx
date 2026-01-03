import PropTypes from "prop-types";
import "./InlineEmptyState.scss";

// Inline empty state for list/filter results
const InlineEmptyState = ({ children }) => {
  return <div className='inline-empty-state'>{children}</div>;
};

InlineEmptyState.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InlineEmptyState;

import PropTypes from "prop-types";
import { ReactComponent as ClockIcon } from "@/assets/icons/clock.svg";
import "./DeadlineNotice.scss";

const DeadlineNotice = ({ children, className }) => {
  const classNames = ["deadline-notice", className].filter(Boolean).join(" ");

  return (
    <div className={classNames} role='note'>
      <ClockIcon className='deadline-notice__icon' aria-hidden='true' />
      <span className='deadline-notice__text'>{children}</span>
    </div>
  );
};

DeadlineNotice.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default DeadlineNotice;

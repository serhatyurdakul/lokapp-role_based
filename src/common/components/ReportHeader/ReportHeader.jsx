import PropTypes from "prop-types";
import "./ReportHeader.scss";

const ReportHeader = ({ title, align = "between", className = "", children }) => {
  const alignClass = align === "start" ? "report-header--start" : "";
  const composedClassName = ["report-header", alignClass, className].filter(Boolean).join(" ");

  return (
    <div className={composedClassName}>
      <h2 className='report-header__title'>{title}</h2>
      {children && <div className='report-header__actions'>{children}</div>}
    </div>
  );
};

ReportHeader.propTypes = {
  title: PropTypes.string.isRequired,
  align: PropTypes.oneOf(["between", "start"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ReportHeader;

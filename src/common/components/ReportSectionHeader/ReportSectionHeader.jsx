import PropTypes from "prop-types";
import "./ReportSectionHeader.scss";

const ReportSectionHeader = ({
  title,
  align = "between",
  className = "",
  children,
}) => {
  const alignClass = align === "start" ? "report-section-header--start" : "";
  const composedClassName = ["report-section-header", alignClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={composedClassName}>
      <h2 className='report-section-header__title'>{title}</h2>
      {children && <div className='report-section-header__actions'>{children}</div>}
    </div>
  );
};

ReportSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  align: PropTypes.oneOf(["between", "start"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ReportSectionHeader;

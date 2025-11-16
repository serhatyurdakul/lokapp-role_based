import PropTypes from "prop-types";
import "./SummaryStatCard.scss";

const SummaryStatCard = ({ value, label, variant = "" }) => {
  const className = variant ? `summary-item ${variant}` : "summary-item";
  return (
    <div className={className}>
      <span className='value'>{value}</span>
      <span className='label'>{label}</span>
    </div>
  );
};

SummaryStatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.string,
};

export default SummaryStatCard;

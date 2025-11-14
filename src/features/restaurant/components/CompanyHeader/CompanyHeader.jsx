import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";
import "./CompanyHeader.scss";

const CompanyHeader = ({ companyName, region, totalPeople, status }) => {
  return (
    <div className='company-header'>
      <div className='company-info'>
        <div className='company-title-row'>
          <h2 className='company-name'>{companyName}</h2>
          <Badge
            className='status-badge'
            tone={status === "pending" ? "pending" : "completed"}
          >
            {status === "pending" ? "Bekliyor" : "Tamamlandı"}
          </Badge>
        </div>
        <div className='company-meta'>
          <span className='meta-text'>
            {region} • {totalPeople} kişilik
          </span>
        </div>
      </div>
    </div>
  );
};

CompanyHeader.propTypes = {
  companyName: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  totalPeople: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  status: PropTypes.oneOf(["pending", "completed"]).isRequired,
};

export default CompanyHeader;

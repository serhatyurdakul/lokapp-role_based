import PropTypes from "prop-types";
import { ReactComponent as BagIcon } from "@/assets/icons/bag-outline.svg";
import { ReactComponent as QrCodeIcon } from "@/assets/icons/qr-outline.svg";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import Badge from "@/components/common/Badge/Badge";
import "./ReportSummaryCard.scss";

const ReportSummaryCard = ({
  title,
  total = 0,
  delivery = 0,
  dineIn = 0,
  siteName,
  onClick,
}) => (
  <div
    className={`report-summary-card`}
    onClick={onClick}
    aria-label={`${title} – toplam ${total || 0} tabldot`}
  >
    <div className='card-header'>
      <span className='card-title'>{title}</span>
      <ChevronRightIcon className='chevron' />
    </div>
    {siteName && (
      <Badge className='card-site-badge' tone='neutral'>
        {siteName}
      </Badge>
    )}
    <span className='card-total'>{total} Toplam Tabldot</span>
    <div className='card-details'>
      <Badge tone='delivery' icon={<BagIcon />}>
        {delivery} Siparişle Tabldot
      </Badge>
      <Badge tone='dine-in' icon={<QrCodeIcon />}>
        {dineIn} Restoranda Tabldot
      </Badge>
    </div>
  </div>
);

ReportSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number,
  delivery: PropTypes.number,
  dineIn: PropTypes.number,
  siteName: PropTypes.string,
  onClick: PropTypes.func,
};

export default ReportSummaryCard;

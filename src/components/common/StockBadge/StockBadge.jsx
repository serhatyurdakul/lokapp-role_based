import PropTypes from "prop-types";
import { getStockStatus } from "@/features/restaurant/utils/stockUtils";
import Badge from "@/components/common/Badge/Badge";
import "./StockBadge.scss";

const StockBadge = ({ remaining, sold = 0 }) => {
  const status = getStockStatus(remaining);
  const toneMap = {
    good: "success",
    warning: "warning",
    critical: "error",
    depleted: "neutral",
  };

  const remainingTone = toneMap[status] || "neutral";
  const soldTone = "neutral";

  return (
    <div className='meal-stock-badge-wrapper'>
      <Badge tone={remainingTone}>
        {remaining === 0 ? "Tükendi" : `Kalan: ${remaining}`}
      </Badge>
      <Badge tone={soldTone}>Satılan: {sold}</Badge>
    </div>
  );
};

StockBadge.propTypes = {
  remaining: PropTypes.number.isRequired,
  sold: PropTypes.number,
};

export default StockBadge;

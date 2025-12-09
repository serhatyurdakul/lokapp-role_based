import PropTypes from "prop-types";
import Badge from "@/common/components/Badge/Badge";
import { getPortionStatus } from "@/features/restaurant/utils/portionUtils";
import "./PortionBadge.scss";

const toneMap = {
  good: "success",
  warning: "warning",
  critical: "error",
  depleted: "neutral",
};

const PortionBadge = ({ remaining, sold = 0 }) => {
  const status = getPortionStatus(remaining);
  const remainingTone = toneMap[status] || "neutral";
  const soldTone = "neutral";

  return (
    <div className='portion-badge'>
      <Badge tone={remainingTone}>
        {remaining === 0 ? "Tükendi" : `Kalan: ${remaining}`}
      </Badge>
      <Badge tone={soldTone}>Satılan: {sold}</Badge>
    </div>
  );
};

PortionBadge.propTypes = {
  remaining: PropTypes.number.isRequired,
  sold: PropTypes.number,
};

export default PortionBadge;

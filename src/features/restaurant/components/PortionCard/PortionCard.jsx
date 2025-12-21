import PropTypes from "prop-types";
import PortionBadge from "@/common/components/PortionBadge/PortionBadge";
import Badge from "@/common/components/Badge/Badge";
import { getPortionStatus } from "../../utils/portionUtils";
import "./PortionCard.scss";

const PortionCard = ({
  title,
  remaining,
  sold,
  status,
  onClick,
  variant = "status",
  added,
}) => {
  const resolvedStatus =
    variant === "status" ? status ?? getPortionStatus(remaining ?? 0) : "";
  const statusClass =
    resolvedStatus && ["critical", "warning"].includes(resolvedStatus)
      ? `portion-card--${resolvedStatus}`
      : "";
  const cardClassName = ["portion-card", statusClass].filter(Boolean).join(" ");

  return (
    <button type='button' className={cardClassName} onClick={onClick}>
      <div className='portion-card__header'>
        <h4 className='portion-card__title'>{title}</h4>
        {variant === "status" ? (
          <PortionBadge remaining={remaining ?? 0} sold={sold ?? 0} />
        ) : added !== undefined ? (
          <Badge tone='delivery'>Eklenecek {Number(added) || 0}</Badge>
        ) : null}
      </div>
    </button>
  );
};

PortionCard.propTypes = {
  title: PropTypes.string.isRequired,
  remaining: PropTypes.number,
  sold: PropTypes.number,
  status: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["status", "pending"]),
  added: PropTypes.number,
};

export default PortionCard;

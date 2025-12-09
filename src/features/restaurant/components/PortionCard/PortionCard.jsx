import PropTypes from "prop-types";
import StockBadge from "@/common/components/StockBadge/StockBadge";
import Badge from "@/common/components/Badge/Badge";
import { getStockStatus } from "../../utils/stockUtils";
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
  const isInteractive = typeof onClick === "function";
  const resolvedStatus =
    variant === "status" ? status ?? getStockStatus(remaining ?? 0) : "";
  const statusClass =
    resolvedStatus && ["critical", "warning"].includes(resolvedStatus)
      ? `portion-card--${resolvedStatus}`
      : "";
  const cardClassName = ["portion-card", statusClass].filter(Boolean).join(" ");

  return (
    <div
      className={cardClassName}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isInteractive) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className='portion-card__header'>
        <h4 className='portion-card__title'>{title}</h4>
        {variant === "status" ? (
          <StockBadge remaining={remaining ?? 0} sold={sold ?? 0} />
        ) : added !== undefined ? (
          <Badge tone='delivery'>Eklenecek {Number(added) || 0}</Badge>
        ) : null}
      </div>
    </div>
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

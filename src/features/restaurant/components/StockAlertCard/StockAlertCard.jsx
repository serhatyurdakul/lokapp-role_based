import PropTypes from "prop-types";
import StockBadge from "@/common/components/StockBadge/StockBadge";
import Badge from "@/common/components/Badge/Badge";
import { getStockStatus } from "../../utils/stockUtils";
import "./StockAlertCard.scss";

const StockAlertCard = ({
  title,
  remaining,
  sold,
  status,
  onClick,
  variant = "alert",
  added,
}) => {
  const isInteractive = typeof onClick === "function";
  const statusClass =
    variant === "alert" ? status ?? getStockStatus(remaining ?? 0) : "";
  const cardClassName = `alert-card ${statusClass} ${
    isInteractive ? "interactive" : ""
  }`.trim();

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
      <div className='alert-header'>
        <h4>{title}</h4>
        {variant === "alert" ? (
          <StockBadge remaining={remaining ?? 0} sold={sold ?? 0} />
        ) : added !== undefined ? (
          <Badge className='added-chip' tone='delivery'>
            Eklenecek {Number(added) || 0}
          </Badge>
        ) : null}
      </div>
    </div>
  );
};

StockAlertCard.propTypes = {
  title: PropTypes.string.isRequired,
  remaining: PropTypes.number,
  sold: PropTypes.number,
  status: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["alert", "summary"]),
  added: PropTypes.number,
};

export default StockAlertCard;

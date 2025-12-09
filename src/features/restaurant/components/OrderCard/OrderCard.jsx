import PropTypes from "prop-types";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import Badge from "@/common/components/Badge/Badge";
import "./OrderCard.scss";

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      className={`order-card order-card--${order.status}`}
      onClick={() => onClick(order.companyId)}
      role='button'
      tabIndex={0}
    >
      <div className='order-card__header'>
        <div className='order-card__top'>
          <h3 className='order-card__title'>{order.company}</h3>
          <ChevronRightIcon
            className='order-card__chevron'
            aria-hidden='true'
          />
        </div>
        <Badge className='order-card__region' tone='neutral'>
          {order.region}
        </Badge>
      </div>
      <div className='order-card__meta'>
        <span className='order-card__items'>{order.totalPeople} kişilik</span>
        <Badge
          className='order-card__status'
          tone={order.status === "pending" ? "pending" : "completed"}
        >
          {order.status === "pending" ? "Bekliyor" : "Tamamlandı"}
        </Badge>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    company: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["pending", "completed"]).isRequired,
    totalPeople: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    orderTime: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OrderCard;

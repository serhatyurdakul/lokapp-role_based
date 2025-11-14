import PropTypes from "prop-types";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import Badge from "@/components/common/Badge/Badge";
import "./OrderCard.scss";

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      className={`order-card ${order.status}`}
      onClick={() => onClick(order.companyId)}
      role='button'
      tabIndex={0}
    >
      <div className='order-header'>
        <div className='order-header__top'>
          <h3>{order.company}</h3>
          <ChevronRightIcon className='chevron' aria-hidden='true' />
        </div>
        <Badge className='order-region' tone='neutral'>
          {order.region}
        </Badge>
      </div>
      <div className='order-meta'>
        <span className='order-items'>{order.totalPeople} kişilik</span>
        <Badge
          className='order-status'
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
